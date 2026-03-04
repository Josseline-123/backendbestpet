# backend/Dockerfile

# 1. Usamos Node.js como base
FROM node:18

# 2. Creamos la carpeta donde vivirá la app dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# 4. Instalamos las dependencias (como si hicieras npm install)
RUN npm install

# 5. Copiamos el resto del código (rutas, modelos, server.js, etc.)
COPY . .

# 6. Exponemos el puerto que usa el backend
EXPOSE 5000

# 7. Comando que se ejecuta cuando arranca el contenedor
CMD ["node", "server.js"]
