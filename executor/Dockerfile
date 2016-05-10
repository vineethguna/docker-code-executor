FROM ubuntu:14.04
MAINTAINER "Vineeth Guna <vineeth.guna@gmail.com>"

RUN \
  sudo apt-get -y update && \
  sudo apt-get -y install gcc python ruby curl \
  && curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && mkdir -p /srv/executor

WORKDIR  /srv/executor
COPY . /srv/executor/
RUN npm install
EXPOSE 3000

CMD ["npm", "start"]