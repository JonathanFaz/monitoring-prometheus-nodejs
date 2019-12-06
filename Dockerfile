FROM mhart/alpine-node:6.10.0

RUN mkdir -p /home/app/nodejs
WORKDIR /home/app/nodejs

COPY package.json /home/app/nodejs
RUN npm install


COPY . /home/app/nodejs

# network ports
EXPOSE 3000

CMD [ "node", "index.js" ]
