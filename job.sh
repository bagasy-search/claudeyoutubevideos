#!/bin/bash
set -e
while read -r id; do id=$(echo "$id" | tr -d '\r'); [ -z "$id" ] && continue
  get "${id}_c.mp4"; python corte.py "${id}_c.mp4" "${id}_a.webm"; put "${id}_a.webm"; rm -f "${id}_c.mp4"
done < lista.txt
