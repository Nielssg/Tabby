#!/bin/bash
read -s ACCESS_KEY
COLLECTION_ID=86335868
URL="https://api.unsplash.com/collections/$COLLECTION_ID/photos?client_id=$ACCESS_KEY&orientation=landscape"
cd src/resources || exit
curl "$URL" -o wallpapers.json
echo "defaultCollection=$(cat wallpapers.json)" > wallpapers.js
rm wallpapers.json