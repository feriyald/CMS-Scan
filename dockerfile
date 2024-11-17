# Gunakan Node.js sebagai base image
FROM node:18-alpine

# Set working directory dalam container
WORKDIR /app

# Copy package.json dan package-lock.json dan install dependensi
COPY package*.json ./
RUN npm install

# Copy seluruh source code ke container
COPY . .

# Build aplikasi untuk produksi
RUN npm run build

# Expose port yang akan digunakan oleh aplikasi (misal, port 8080)
EXPOSE 81

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]