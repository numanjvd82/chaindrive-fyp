FROM node:24.2.0-bookworm

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # if using TypeScript

EXPOSE 4000

CMD ["node", "dist/src/index.js"] # adjust to your built entry point