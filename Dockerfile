# 1. Aşama: Bağımlılıkları yükleme
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Aşama: Build aşaması
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build sırasında .env değerlerine ihtiyaç varsa:
# COPY .env.production .env 

RUN npm run build

# 3. Aşama: Çalıştırma (Runner)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5104

RUN addgroup -S nodejs -g 1001
RUN adduser -S nextjs -u 1001

# ÖNEMLİ: Builder'dan .env dosyasını runner'a çekiyoruz
COPY --from=builder /app/.env* ./ 

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 5104

CMD ["npm", "run", "start"]