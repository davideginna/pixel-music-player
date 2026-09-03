# Security Policy

## Versioni Supportate

| Versione | Supportata | Note |
| :--- | :---: | :--- |
| 1.x (Main) | :white_check_mark: | Rilascio attivo e supportato |
| < 1.0 | :x: | Versioni sperimentali precedenti |

---

## Architettura e Sicurezza dei Dati Locali

**Pixel Music Player** è un lettore musicale concepito secondo il paradigma **Privacy-First & Local-First**:

1. **Nessun invio di file audio a server terzi**: I file audio importati (MP3, WAV, FLAC, AAC, OGG) vengono memorizzati localmente all'interno del database isolato del browser (**IndexedDB**) e non lasciano mai il dispositivo dell'utente.
2. **Nessun tracciamento o telemetria utente**: L'applicazione non utilizza tracker di terze parti, cookie invasivi o pixel pubblicitari.
3. **Sintetizzatore e Motore Audio Web**: L'audio engine utilizza le API standard `Web Audio API` e `MediaElementAudioSourceNode` eseguite localmente nella sandbox del browser.
4. **Chiavi API**: L'applicazione non richiede chiavi di accesso per la riproduzione di musica locale. Nel caso di integrazioni opzionali con API esterne, tutte le credenziali devono essere mantenute su variabili di ambiente server-side (`.env`) e mai esposte pubblicamente nel client.

---

## Segnalazione di una Vulnerabilità

Prendiamo molto sul serio la sicurezza dell'applicazione e dei dati degli utenti. Se riscontri una vulnerabilità di sicurezza, ti chiediamo di seguire una procedura di disclosure responsabile:

1. **Non aprire una Issue pubblica su GitHub** con dettagli exploitabili.
2. Segnala la vulnerabilità inviando un'email a:
   - **Contatto**: `davideginna@gmail.com`
3. Nel report includi:
   - Tipo di vulnerabilità e impatto potenziale
   - Passaggi dettagliati per riprodurre il problema (PoC o codice)
   - Dispositivo, sistema operativo Android o browser in cui si verifica
4. Riceverai un riscontro entro 48 ore lavorative con la presa in carico e il piano di correzione.
5. Una volta rilasciata la patch correttiva (tramite hotfix e nuovo rilascio APK), verrà pubblicata una menzione di ringraziamento (se desiderata).
