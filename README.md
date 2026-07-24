# BFBR — sistema siti + outreach

Fabbrica di siti demo per attivita locali: Claude trova i lead, costruisce il sito da
template, lo pubblica online, registra un video demo e prepara l'email. Voi approvate ai
cancelli. Tutto tracciato in PIPELINE.xlsx (l'ERP), che vive su Drive.

## Dove vive cosa
- **Git (questa repo):** codice, template, siti dei clienti. Netlify pubblica da qui.
- **Drive (condiviso):** PIPELINE.xlsx (ERP), foto originali pesanti, report giornalieri.

## Struttura
```
bfbr-web-agency/
├── template/            modelli riusabili (stile L1/L2)
├── siti-in-lavorazione/ in costruzione, non ancora online
├── siti/                ONLINE: 1 sottocartella = 1 sito Netlify = 1 link
│   ├── ristoranti/  carrozzerie/  studi-legali/   (shard per categoria)
│   └── .../<slug>/  → config.yaml · brief.md · images/ · index.html
├── archivio/            rifiutati/ · scartati/  (housekeeping)
├── scripts/             moduli pipeline (Claude)
├── netlify/crea-sito.sh registra un nuovo sito da riga di comando
├── INDICE.md            elenco siti generato dall'Excel (sola lettura)
├── PLAYBOOK.md          le vostre regole/preferenze (come Claude decide)
└── docs/                report giornalieri
```

## Regole chiave
1. **Slug = chiave unica** che lega riga Excel ↔ cartella ↔ sito Netlify. Non cambia mai.
2. **Una volta online, la cartella non si sposta** (link stabile). La fase vive nell'Excel.
3. **Foto:** originali pesanti su Drive; solo versioni web leggere su Git.
4. **Venduto** = si aggancia il dominio del cliente al sito Netlify esistente (non si sposta).

## Setup (una volta)
```
git init && git add . && git commit -m "init"
git remote add origin https://github.com/UTENTE/bfbr-web-agency.git
git push -u origin main
```
Poi su Netlify: un sito per cartella cliente (o netlify/crea-sito.sh via CLI).
