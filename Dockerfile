FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000 8000 8080 1935
CMD ["npm", "start"]