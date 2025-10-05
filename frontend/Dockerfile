

# Dockerfile para build/preview, no para desarrollo local
FROM node:22-slim
WORKDIR /app

# Copia archivos de dependencias y binario de Yarn Berry
COPY package.json yarn.lock .yarnrc.yml .yarn/releases/yarn-4.10.3.cjs ./
COPY .yarn .yarn

# Instala dependencias (solo para build, no para desarrollo local)
RUN yarn install --immutable || yarn install --mode=skip-build

# Copia el resto de la app
COPY . .

# Expone el puerto de Vite
EXPOSE 5173

# Inicia el servidor de desarrollo (solo para pruebas en Docker)
CMD ["node", "node_modules/vite/bin/vite.js"]
