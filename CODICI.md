# CODICI SITO — schema di identificazione

Ogni sito ha un codice univoco "parlante", es. **RI0000001BO**.
Il codice è: la chiave unica del sistema. È uguale in: nome cartella, ID nell'Excel, nome sito Netlify.
Il nome vero dell'attività vive nel config.yaml e nell'Excel (colonna Nome attività), non nel codice.

## Struttura: [CAT][NNNNNNN][PROV]
- **CAT** — 2 lettere, categoria
- **NNNNNNN** — 7 cifre, progressivo per categoria (0000001, 0000002, …)
- **PROV** — 2 lettere, sigla provincia

## Categorie (CAT)
| Codice | Categoria      |
|--------|----------------|
| RI     | ristorante     |
| BA     | bar            |
| CA     | carrozzeria    |
| EL     | elettricista   |
| ID     | idraulico      |
| PA     | parrucchiere   |
| ES     | estetista      |
| SL     | studio legale  |
| CO     | commercialista |

## Province (PROV) — sigla automobilistica italiana
| Sigla | Provincia          |
|-------|--------------------|
| MB    | Monza e Brianza    |
| MI    | Milano             |
| BO    | Bologna            |
| TO    | Torino             |
(qualsiasi altra sigla provincia italiana è valida)

## Esempi
- **RI0000001BO** = 1° ristorante, Bologna (Trattoria del Rosso)
- **RI0000002MB** = 2° ristorante, Monza e Brianza
- **CA0000001MI** = 1° carrozzeria, Milano

## Regola per i nuovi siti
Il progressivo si assegna guardando l'ultimo numero usato per quella categoria nell'Excel e sommando 1.
