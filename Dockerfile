FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY wryte-byte/package*.json ./wryte-byte/

RUN npm ci
RUN cd wryte-byte && npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]