FROM node:4.4.4
RUN mkdir -p /srv/executor-ui
WORKDIR /srv/executor-ui
COPY . /srv/executor-ui/
RUN npm install
EXPOSE 8080

CMD ["npm", "start"]