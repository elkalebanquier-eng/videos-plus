FROM node:22-alpine
RUN apk add --no-cache ffmpeg chromium nss freetype harfbuzz ca-certificates ttf-freefont
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
ENV NODE_ENV=production
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
ENV MAX_RENDER_SECONDS=45
EXPOSE 10000
CMD ["npm", "start"]
