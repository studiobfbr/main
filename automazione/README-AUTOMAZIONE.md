# Automazione BFBR — pubblicazione siti

Uno script che, per ogni codice sito, fa **tutta** la catena in automatico:
crea la repo GitHub → pusha i file → crea il sito Netlify → deploy in produzione.

Gira **sul tuo PC** (dove la rete raggiunge GitHub e Netlify). Claude prepara i file
dei siti; tu lanci la pubblicazione con un doppio clic.

## Preparazione (una volta sola)

1. **Token** — copia `bfbr-config.esempio.json` in un nuovo file `bfbr-config.json`
   e incolla i due token:
   - `github_token`: GitHub → Settings → Developer settings → Personal access tokens
     → *Tokens (classic)* → scope **repo**. (Oppure fine-grained con **Contents: Read/Write**
     e **Administration: Read/Write** per creare le repo.)
   - `netlify_token`: Netlify → User settings → Applications → **Personal access tokens** → New.
   > `bfbr-config.json` è già in `.gitignore`: non finisce mai su GitHub.

2. **Node**: già installato (v22). `netlify-cli` viene installato in automatico al primo avvio.

## Uso

- **Tutti i siti** non ancora pubblicati / da aggiornare:
  doppio clic su **`PUBBLICA.bat`**.

- **Un solo sito**: da terminale nella cartella `automazione`:
  ```
  PUBBLICA.bat RIS000001MB
  ```
  oppure più codici: `PUBBLICA.bat RIS000001MB CAR000002MI`

Lo script cerca la cartella del sito in `..\siti\<categoria>\<CODICE>\` e pubblica quella.
Rilanciandolo sullo stesso codice, **aggiorna** repo e sito (nuovo deploy).

## Come sono nominati i siti
- Repo GitHub: `studiobfbr/<CODICE>` (privata) — es. `studiobfbr/RIS000001MB`
- Sito Netlify: `<codice minuscolo>` → `https://ris000001mb.netlify.app`
- La mappa codice→sito Netlify è salvata in `bfbr-netlify-map.json` (non toccarla a mano).

## Schema codici
`[CAT 3 lettere][6 cifre][PROV 2 lettere]` — es. `RIS000001MB`
(RIS ristorante, BAR bar, CAR carrozzeria, ELE elettricista, IDR idraulico,
PAR parrucchiere, EST estetista, SLE studio legale, COM commercialista).
