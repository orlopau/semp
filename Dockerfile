FROM node
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
EXPOSE 8081
CMD ["npm", "run", "start"]