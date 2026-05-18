# 1. Partiamo da un'immagine leggera di Node.js
FROM node:22-alpine

# 2. Creiamo la cartella di lavoro nel container
WORKDIR /usr/src/app

# 3. Copiamo i file dei pacchetti e installiamo le dipendenze
COPY package*.json ./
RUN npm install

# 4. Copiamo il resto del codice
COPY . .

# 5. Esponiamo la porta 3000
EXPOSE 3000

# 6. Comando per avviare l'app
CMD ["node", "index.js"]