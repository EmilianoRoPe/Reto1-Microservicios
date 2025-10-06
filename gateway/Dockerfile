# gateway/Dockerfile
# Usamos una imagen oficial de Nginx, que es pequeña y estable
FROM nginx:stable-alpine

# Copiamos nuestro archivo de configuración personalizado (nginx.conf)
# en la ubicación donde Nginx lo buscará en el contenedor.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# El puerto 80 ya está expuesto por la imagen base de Nginx, 
# pero lo ponemos para claridad.
EXPOSE 80

# Este es el comando por defecto para iniciar Nginx en primer plano 
# (necesario para Docker).
CMD ["nginx", "-g", "daemon off;"]