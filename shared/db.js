const mongoose = require("mongoose");

const user = 'docker_sandeep';
const password = 'PzqxnbBKzhddagJf';
const domain = 'clusterforresumebuilder.8bkgcgl.mongodb.net';
const database = 'dehing_patkai_db';
const queries = ['retryWrites=true', 'w=majority'];
const q = queries.join('&');
const uri = `mongodb+srv://${user}:${password}@${domain}/${database}?${q}`;

async function main() {
  await mongoose.connect(uri);
};

main().catch(err => console.log(err));

module.exports = mongoose;