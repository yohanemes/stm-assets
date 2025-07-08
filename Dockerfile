# Usar Node.js 18 Alpine (más ligero)
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto de la aplicación
COPY . .

# Crear directorio para assets si no existe
RUN mkdir -p public/images

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
