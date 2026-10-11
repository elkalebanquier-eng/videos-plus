FROM node:22-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY video-converter/package.json ./package.json
RUN npm install --omit=dev
COPY video-converter/server.js ./server.js
ENV NODE_ENV=production
EXPOSE 10000
CMD ["npm", "start"]
