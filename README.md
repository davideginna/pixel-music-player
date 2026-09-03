# 🎵 Pixel Music Player

<p align="center">
  <img src="public/app-screenshot.svg" alt="Pixel Music Player Screenshot" width="760"/>
</p>

<p align="center">
  <strong>Un lettore musicale Android elegante, moderno e locale ispirato all'ecosistema Google Pixel e al design Material You (Material 3).</strong>
</p>

<p align="center">
  <a href="#-funzionalit-principali">Caratteristiche</a> •
  <a href="#-pipeline-github-actions-download-apk">Download APK automatico</a> •
  <a href="#-guida-passo-passo-per-pubblicare-su-github">Pubblicazione su GitHub</a> •
  <a href="#-compilazione-e-installazione-manuale">Build Locale</a> •
  <a href="CHANGELOG.md">Changelog</a> •
  <a href="SECURITY.md">Sicurezza</a>
</p>

---

## ✨ Funzionalità Principali

- 🎨 **Material You & Dynamic Color**: Palette estratte ispirate agli sfondi di Google Pixel (Gemini Aurora, Pixel Blue Bay, Mint Forest, Rose Coral, Hazel, Amber Sunset, Obsidian Pure). Supporta modalità Chiaro, Scuro e segue il tema di sistema.
- 💽 **Visuale Disco Vinile e Waveform**: Player a schermo intero con rotazione fluida del disco vinile, visualizzatore di forma d'onda audio in tempo reale ed effetto haptic.
- 🎚️ **Equalizzatore a 5 Bande**: Controllo fine delle frequenze (60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz) con amplificazione bassi e profili preimpostati.
- 📂 **Archiviazione Locale & Privacy-First**: I file musicali risiedono esclusivamente nel dispositivo tramite **IndexedDB**. Nessun dato viene caricato su server esterni.
- 🔍 **Ricerca Rapida & Filtri per Tag**: Ricerca istantanea per titolo, artista, album, genere o playlist con ordinamento personalizzabile.
- 📱 **MediaSession API Android**: Controlli musicali integrati nativamente nell'area notifiche e nella schermata di blocco di Android.
- 🗑️ **Gestione e Cancellazione Sicura**: Dialog di conferma Material 3 con feedback a comparsa (Toast) e opzione di annullamento immediato.

---

## 🚀 Pipeline GitHub Actions (Download APK)

Questo repository include una **pipeline CI/CD automatizzata** pronta all'uso (`.github/workflows/build-apk.yml`).

### Come scaricare l'APK compilato da GitHub:

1. Pubblica il repository sul tuo account GitHub (vedi la guida sotto).
2. Vai nella scheda **Actions** del tuo repository su GitHub.
3. Seleziona la workflow **"Build & Release Android APK"**.
4. Clicca sull'ultima esecuzione completata con successo (spunta verde).
5. In fondo alla pagina, nella sezione **Artifacts**, troverai il file:
   👉 **`pixel-music-player-debug-apk`** (un file `.zip` contenente l'APK pronto per l'installazione).
6. Scaricalo, estrailo e trasferisci `app-debug.apk` sul tuo smartphone Android!

> 💡 **Suggerimento Release**: Se crei un tag (ad esempio `v1.1.0`), la pipeline creerà in automatico una vera **GitHub Release** allegando l'APK pronto per il download pubblico.

---

## 🛠️ Guida Passo-Passo per Pubblicare su GitHub

Se stai usando Google AI Studio o hai esportato il file ZIP dell'app:

### 1. Crea un nuovo repository su GitHub
- Vai su [github.com/new](https://github.com/new).
- Chiama il repository `pixel-music-player` (o il nome che preferisci).
- Lascialo vuoto (non aggiungere README o .gitignore, sono già presenti nel progetto).

### 2. Inizializza Git e invia il codice dal tuo computer
Apri il terminale nella cartella del progetto:

```bash
# Inizializza il repository locale
git init
git add .
git commit -m "feat: initial commit with Material You Pixel Player and CI/CD"

# Collega il tuo repository remoto (sostituisci USERNAME con il tuo username GitHub)
git branch -M main
git remote add origin https://github.com/USERNAME/pixel-music-player.git

# Effettua il push
git push -u origin main
```

Appena inviato il codice, la **GitHub Action partirà automaticamente** e compilerà il tuo APK!

---

## 💻 Compilazione e Installazione Manuale

Se preferisci compilare l'APK localmente sulla tua macchina tramite **Android Studio** o riga di comando:

### Prerequisiti
- **Node.js** (v18 o superiore)
- **Java JDK 17**
- **Android Studio** (con Android SDK Platform 34+ installato)

### Passaggi:

1. **Installa le dipendenze web**:
   ```bash
   npm install
   ```

2. **Compila l'applicazione web**:
   ```bash
   npm run build
   ```

3. **Inizializza Capacitor e crea il progetto Android**:
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   npx cap init "Pixel Music Player" "com.google.pixel.music" --web-dir dist
   npx cap add android
   npx cap copy android
   ```

4. **Compila l'APK**:
   - **Opzione A: Da riga di comando (veloce)**:
     ```bash
     cd android
     chmod +x gradlew
     ./gradlew assembleDebug
     ```
     L'APK sarà disponibile in:
     `android/app/build/outputs/apk/debug/app-debug.apk`

   - **Opzione B: Tramite Android Studio**:
     ```bash
     npx cap open android
     ```
     Nel menu in alto: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.

---

## 📲 Come Installare l'APK sul Telefono

1. Invia il file `app-debug.apk` al telefono (tramite cavo USB, Google Drive, WhatsApp o Telegram).
2. Apri il file sul telefono dal gestore file.
3. Se richiesto, abilita **"Installa app da origini sconosciute"** per quell'app.
4. Tocca **Installa** e avvia **Pixel Music Player**.

---

## 🛡️ Sicurezza e Segnalazioni

Per dettagli sulla gestione della privacy dei dati e le procedure di sicurezza, consulta il file [`SECURITY.md`](SECURITY.md).

---

## 📄 Licenza

Distribuito con licenza MIT. I loghi, i nomi e lo stile Material You sono marchi o concept visivi ispirati a Google LLC.
