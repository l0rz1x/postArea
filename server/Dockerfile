# 1. Base Image: Node.js 20'nin hafifletilmiş resmi Debian tabanlı imajı
FROM node:20-slim

# 2. Konteyner içinde çalışacağımız dizin
WORKDIR /app

# 3. Önbellekleme (Caching) avantajı için önce paket listesini kopyalıyoruz
COPY package*.json ./

# 4. Bağımlılıkları konteyner içinde kuruyoruz
RUN npm install

# 5. Kaynak kodları konteynere kopyalıyoruz
COPY . .

# 6. Backend portunu dökümante ediyoruz
EXPOSE 5000

# 7. Konteyner ayağa kalktığında çalıştırılacak komut
CMD ["npm", "start"]
