FROM node:18

WORKDIR /app

COPY package*.json ./

# Recria o node_modules corretamente dentro do container
RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
