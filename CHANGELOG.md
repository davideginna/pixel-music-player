# Changelog

Tutte le modifiche salienti apportate a **Pixel Music Player** sono documentate in questo file.
Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/) e aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [1.1.0] - 2026-09-03

### Aggiunto
- **Tema Google Gemini Aurora**: Nuova palette cromatica ispirata a Google Gemini con accenti blu elettrico (`#1A73E8` / `#8AB4F8`), lavanda aurora (`#7C3AED`) e gradiente tramonto sul vinile.
- **Material 3 Confirm Dialogs**: Sostituiti tutti i dialoghi nativi del browser (`window.confirm`) con finestre di dialogo Material 3 ad alto contrasto, perfettamente fruibili su dispositivi touch screen.
- **Material 3 Toast & Snackbar**: Feedback visivo contestuale con pulsante **"Annulla"** al momento della cancellazione di brani o playlist.
- **Bottom Sheet Azioni Brano**: Menu contestuale accessibile dall'icona a tre puntini per riprodurre, mettere in coda, aggiungere ai preferiti, consultare i metadati o eliminare il brano.
- **GitHub Actions Pipeline CI/CD**: Workflow automatico (`.github/workflows/build-apk.yml`) per compilare e generare direttamente su GitHub il pacchetto installabile **APK Android** come Artifact o Release.
- **Documentazione Progetto**: Aggiunti `README.md`, `CHANGELOG.md`, `SECURITY.md` e screenshot vettoriale dell'interfaccia.

### Risolto
- **Persistenza della Cancellazione Brani**: Risolto il ripristino automatico involontario dei brani demo su IndexedDB; le cancellazioni ora persistono in modo definitivo tra le sessioni.
- **Rimozione a Cascata**: Quando un brano viene rimosso, viene automaticamente disincagliato sia dalla coda di riproduzione attiva che da tutte le playlist in cui era presente.
- **Supporto Transazioni Asincrone IndexedDB**: Tutte le operazioni di scrittura e cancellazione nel database locale sono ora basate su `Promise` per prevenire perdite di transazione durante la chiusura dei modal.

---

## [1.0.0] - Rilascio Iniziale

### Aggiunto
- **Esperienza Google Pixel & Material You**: Supporto completo per Dynamic Color, palette estratte (Pixel Bay Blue, Mint, Rose Coral, Hazel, Amber, Licorice, Gemini).
- **Player a Schermo Intero (Now Playing)**: Vinile animato, visualizzatore di forma d'onda audio in tempo reale basato su Web Audio API e slider progressivo personalizzato.
- **Equalizzatore Grafico a 5 Bande**: Equalizzazione a filtri Biquad con preset sonori (Bassi profondi, Voce chiara, Rock, Elettronica, Jazz, Piatto).
- **Scanner Cartelle e File Audio**: Importazione rapida di file audio da disco locale o memoria interna dello smartphone con estrazione automatica dei tag.
- **Gestione Code & Playlist**: Creazione, modifica e gestione di raccolte musicali personalizzate e ordinamento dinamico.
- **Schermata di Blocco e MediaSession API**: Integrazione con i controlli multimediali di sistema di Android e Windows/macOS.
