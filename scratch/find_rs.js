
const { MongoClient } = require('mongodb');
const uri = "mongodb://woww:admin123@ac-kar4e7y-shard-00-00.jyt8ic9.mongodb.net:27017/?ssl=true&authSource=admin&directConnection=true";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const isMaster = await client.db('admin').command({ isMaster: 1 });
    console.log("Replica Set:", isMaster.setName);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
