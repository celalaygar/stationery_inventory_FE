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

# EĞER .env dosyan .dockerignore içinde değilse yukarıdaki "COPY . ." ile gelir.
# Ama garantiye almak için build'den hemen önce şunu ekleyebilirsin:
COPY .env.production .env

# Next.js telemetry verisini kapatmak istersen:
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. Aşama: Çalıştırma (Runner)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5104
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs -g 1001
RUN adduser -S nextjs -u 1001

# Build aşamasından sadece gerekli olanları alalım
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 5104

CMD ["npm", "run", "start"]