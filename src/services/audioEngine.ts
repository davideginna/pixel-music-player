import { EqualizerSettings, Track } from '../types';

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private bassBoostNode: BiquadFilterNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private gainNode: GainNode | null = null;
  private synthOscillators: OscillatorNode[] = [];
  private synthGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private isSynthPlaying = false;
  private isInitialized = false;

  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onPlayPauseCallback: ((isPlaying: boolean) => void) | null = null;
  private onTrackChangeRequest: ((direction: 'next' | 'prev') => void) | null = null;

  constructor() {
    // Lazy initialize on user gesture
  }

  private initAudioContext() {
    if (this.isInitialized && this.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'metadata';

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio && this.onTimeUpdateCallback) {
          const current = this.audio.currentTime;
          const dur = this.audio.duration || 0;
          this.onTimeUpdateCallback(current, dur);
          this.updateMediaSessionPosition(current, dur);
        }
      });

      this.audio.addEventListener('ended', () => {
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      });

      this.audio.addEventListener('play', () => {
        this.updateMediaSessionPlaybackState('playing');
        if (this.onPlayPauseCallback) this.onPlayPauseCallback(true);
      });

      this.audio.addEventListener('pause', () => {
        this.updateMediaSessionPlaybackState('paused');
        if (this.onPlayPauseCallback) this.onPlayPauseCallback(false);
      });

      // Equalizer frequencies: 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz
      const freqs = [60, 230, 910, 3600, 14000];
      this.eqFilters = freqs.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === freqs.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Bass boost filter
      this.bassBoostNode = this.audioCtx.createBiquadFilter();
      this.bassBoostNode.type = 'lowshelf';
      this.bassBoostNode.frequency.value = 120;
      this.bassBoostNode.gain.value = 0;

      // Master gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 1;

      // Analyser for visualizer
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect element source
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // Chain: source -> bassBoost -> eq1 -> eq2 -> eq3 -> eq4 -> eq5 -> gain -> analyser -> destination
      let lastNode: AudioNode = this.sourceNode;
      lastNode.connect(this.bassBoostNode);
      lastNode = this.bassBoostNode;

      for (const filter of this.eqFilters) {
        lastNode.connect(filter);
        lastNode = filter;
      }

      lastNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio API initialization note:', err);
    }
  }

  public setCallbacks(callbacks: {
    onTimeUpdate: (time: number, duration: number) => void;
    onEnded: () => void;
    onPlayPause: (isPlaying: boolean) => void;
    onTrackChangeRequest: (direction: 'next' | 'prev') => void;
  }) {
    this.onTimeUpdateCallback = callbacks.onTimeUpdate;
    this.onEndedCallback = callbacks.onEnded;
    this.onPlayPauseCallback = callbacks.onPlayPause;
    this.onTrackChangeRequest = callbacks.onTrackChangeRequest;
  }

  public async playTrack(track: Track, startTime = 0) {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.stopSynth();

    if (track.audioUrl && track.audioUrl.length > 0) {
      if (this.audio) {
        this.audio.src = track.audioUrl;
        this.audio.currentTime = startTime;
        try {
          await this.audio.play();
        } catch {
          // If browser or CORS blocks it, gracefully fallback to generative synthesizer
          this.startProceduralSynth(track);
        }
      }
    } else {
      // Procedural synthesizer track
      this.startProceduralSynth(track);
    }

    this.setupMediaSession(track);
  }

  public async togglePlay(isPlaying: boolean, currentTrack?: Track) {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (this.isSynthPlaying) {
      if (isPlaying) {
        this.stopSynth();
        if (this.onPlayPauseCallback) this.onPlayPauseCallback(false);
      } else if (currentTrack) {
        this.startProceduralSynth(currentTrack);
        if (this.onPlayPauseCallback) this.onPlayPauseCallback(true);
      }
      return;
    }

    if (!this.audio) return;

    if (this.audio.paused) {
      try {
        await this.audio.play();
      } catch {
        if (currentTrack) this.startProceduralSynth(currentTrack);
      }
    } else {
      this.audio.pause();
    }
  }

  public seek(seconds: number) {
    if (this.audio && !this.isSynthPlaying) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
    if (this.synthGain) {
      this.synthGain.gain.value = Math.max(0, Math.min(1, volume)) * 0.2;
    }
  }

  public applyEqualizer(eq: EqualizerSettings) {
    if (!this.audioCtx) return;
    if (this.bassBoostNode) {
      this.bassBoostNode.gain.value = eq.enabled ? (eq.bassBoost / 100) * 12 : 0;
    }

    this.eqFilters.forEach((filter, index) => {
      const gain = eq.enabled ? eq.bands[index] || 0 : 0;
      filter.gain.value = gain;
    });
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyserNode) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  private async setupMediaSession(track: Track) {
    if ('mediaSession' in navigator) {
      let pngArtwork = track.coverUrl;
      try {
        if (track.coverUrl.startsWith('data:image/svg') && typeof document !== 'undefined') {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            await new Promise<void>((resolve) => {
              img.onload = () => {
                ctx.drawImage(img, 0, 0, 512, 512);
                pngArtwork = canvas.toDataURL('image/png');
                resolve();
              };
              img.onerror = () => resolve();
              img.src = track.coverUrl;
            });
          }
        }
      } catch {
        // Fallback to original
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: pngArtwork, sizes: '512x512', type: 'image/png' },
          { src: pngArtwork, sizes: '256x256', type: 'image/png' },
          { src: pngArtwork, sizes: '128x128', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        this.togglePlay(false, track);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.togglePlay(true, track);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (this.onTrackChangeRequest) this.onTrackChangeRequest('prev');
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (this.onTrackChangeRequest) this.onTrackChangeRequest('next');
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (this.audio) this.seek(this.audio.currentTime + 10);
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (this.audio) this.seek(Math.max(0, this.audio.currentTime - 10));
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        this.pause();
      });
    }
  }

  public updateMediaSessionPosition(position: number, duration: number) {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(1, Math.round(duration)),
          playbackRate: 1,
          position: Math.min(Math.max(0, Math.round(position)), Math.max(1, Math.round(duration))),
        });
      } catch {
        // Ignore if state cannot be set
      }
    }
  }

  private updateMediaSessionPlaybackState(state: 'playing' | 'paused' | 'none') {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }

  // Built-in melodic procedural synthesizer
  private startProceduralSynth(track: Track) {
    if (!this.audioCtx) return;
    this.stopSynth();
    this.isSynthPlaying = true;

    // Keep active audio stream alive so Android lock screen media controls don't disappear
    if (this.audio) {
      try {
        // 1-second silent WAV loop
        this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.audio.loop = true;
        this.audio.play().catch(() => {});
      } catch {
        // ignore
      }
    }

    const synthMaster = this.audioCtx.createGain();
    synthMaster.gain.value = 0.18;
    if (this.analyserNode) {
      synthMaster.connect(this.analyserNode);
    } else {
      synthMaster.connect(this.audioCtx.destination);
    }
    this.synthGain = synthMaster;

    // Chord progressions depending on track genre
    const scales: Record<string, number[]> = {
      'Lo-Fi': [261.63, 329.63, 392.0, 493.88, 523.25], // Cmaj7 pentatonic
      'Synthwave': [220.0, 261.63, 329.63, 392.0, 440.0], // Am
      'Ambient': [196.0, 246.94, 293.66, 392.0, 440.0], // G
      'Default': [220.0, 277.18, 329.63, 415.3, 440.0],
    };

    const chordScale = scales[track.genre] || scales['Default'];
    let step = 0;
    let virtualCurrentTime = 0;

    const tick = () => {
      if (!this.audioCtx || !this.isSynthPlaying) return;

      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      const freq = chordScale[step % chordScale.length] * (step % 4 === 0 ? 0.5 : 1);
      osc.type = step % 3 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.25, this.audioCtx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.9);

      osc.connect(noteGain);
      noteGain.connect(synthMaster);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.95);

      step++;
      virtualCurrentTime += 0.5;

      const pos = virtualCurrentTime % track.duration;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(pos, track.duration);
      }
      this.updateMediaSessionPosition(pos, track.duration);
    };

    tick();
    this.synthInterval = window.setInterval(tick, 500);

    this.updateMediaSessionPlaybackState('playing');
    if (this.onPlayPauseCallback) this.onPlayPauseCallback(true);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthPlaying = false;
    if (this.audio && this.audio.src.startsWith('data:audio/wav')) {
      this.audio.pause();
    }
  }

  public pause() {
    this.stopSynth();
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.updateMediaSessionPlaybackState('paused');
    if (this.onPlayPauseCallback) this.onPlayPauseCallback(false);
  }

  public destroy() {
    this.stopSynth();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}

export const audioEngine = new AudioEngine();
