FROM ubuntu:14.04
MAINTAINER "Vineeth Guna <vineeth.guna@gmail.com>"

RUN \
  sudo apt-get -y update && \
  sudo apt-get -y install curl \
  && curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && mkdir -p /srv/executor-ui

WORKDIR /srv/executor-ui
COPY . /srv/executor-ui/
RUN npm install
EXPOSE 8080

CMD ["npm", "start"]