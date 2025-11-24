const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;


//


//mongo db connection

const uri = "mongodb+srv://kuttodb:NB5CjFvz1n0Nf1Cf@cluster0.lgpbd6x.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    const db = client.db("kuttodb");
    const recentlistsCollection = db.collection("recentlist");

    app.get('/recentlist', async (req, res)=>{

      const result = await recentlistsCollection.find().toArray();
      console.log(result);



      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
















app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`);
})
