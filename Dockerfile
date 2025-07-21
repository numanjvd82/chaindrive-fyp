FROM node:24.2.0-bookworm

# --- Install dependencies first for caching ---
WORKDIR /app

# Copy package files first
COPY ./client/package*.json ./client/
COPY ./server/package*.json ./server/

# === Build frontend ===
WORKDIR /app/client
RUN npm install

# === Install server dependencies ===
WORKDIR /app/server
RUN npm install

# Copy entire project AFTER installing deps to leverage cache
WORKDIR /app
COPY . .

# === Build frontend ===
WORKDIR /app/client
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# === Rebuild better-sqlite3 for container environment ===
WORKDIR /app/server
RUN npm rebuild better-sqlite3

# === Compile Hardhat contracts ===
RUN npx hardhat compile

# === Copy typechain-types to client/src/constants ===
WORKDIR /app
RUN rm -rf client/src/constants/typechain-types && \
    cp -r server/typechain-types client/src/constants

# === Build API TypeScript ===
WORKDIR /app/server
RUN npm run build

# === Expose API port ===
EXPOSE 4000

# === Start your server ===
CMD ["node", "dist/src/index.js"]
