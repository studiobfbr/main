#!/usr/bin/env bash
# Registra un NUOVO sito Netlify puntato alla cartella di un cliente.
# Uso: ./crea-sito.sh <slug> <percorso-cartella>
# Esempio: ./crea-sito.sh trattoria-esempio siti/ristoranti/ristorante-torino-trattoria-esempio
set -e
SLUG="$1"; DIR="$2"
netlify sites:create --name "$SLUG"
netlify link --name "$SLUG"
netlify deploy --dir "$DIR" --prod
echo "Sito online: https://$SLUG.netlify.app"
