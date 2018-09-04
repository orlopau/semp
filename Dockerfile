FROM node
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ARG semp=9765
ARG api=9766
# SEMP Port
EXPOSE $semp
# Api Port
EXPOSE $api
CMD ["npm", "run", "start"]