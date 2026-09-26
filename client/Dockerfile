# 1. Base Image: Node.js 20'nin resmi hafif imajı
FROM node:20-slim

# 2. Konteyner içinde çalışacağımız dizin
WORKDIR /app

# 3. Bağımlılık dosyalarını kopyala
COPY package*.json ./

# 4. Bağımlılıkları kur
RUN npm install

# 5. Kaynak kodları kopyala
COPY . .

# 6. React WebSocket portu ve tarayıcı entegrasyonu için ortam değişkeni
ENV WDS_SOCKET_PORT=0

# 7. React varsayılan portu
EXPOSE 3000

# 8. React geliştirme sunucusunu başlat
CMD ["npm", "start"]
