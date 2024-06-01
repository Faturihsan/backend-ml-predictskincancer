FROM node:20
WORKDIR /usr/src/app
ENV PORT 3000
COPY . .
RUN npm install
ENV MODEL_URL=https://storage.googleapis.com/submissionmlgc-bucketfaturihsan/submissions-model/model.json
CMD [ "npm", "run", "start"]