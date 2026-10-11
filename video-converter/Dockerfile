FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg chromium ca-certificates fonts-liberation && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
ENV NODE_ENV=production
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV MAX_RENDER_SECONDS=45
EXPOSE 10000
CMD ["npm", "start"]
