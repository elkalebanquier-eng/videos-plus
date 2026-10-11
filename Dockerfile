FROM node:22-alpine
RUN apk add --no-cache ffmpeg chromium nss freetype harfbuzz ca-certificates ttf-freefont
WORKDIR /app
COPY video-converter/package.json ./package.json
RUN npm install --omit=dev
COPY video-converter/server.js ./server.js
ENV NODE_ENV=production
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV MAX_RENDER_SECONDS=45
EXPOSE 10000
CMD ["npm", "start"]
