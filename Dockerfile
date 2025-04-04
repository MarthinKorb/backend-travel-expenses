# Usa uma imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos de dependências
COPY package*.json ./

# Instala as dependências dentro do container
RUN npm install --force

# Copia o restante do código
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
