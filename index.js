const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// Middle wair
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ivkpyx5.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('newDatabase').collection('data')

        app.get('/data', async(req, res)=>{
            const result = await database.find().toArray()
            res.send(result)
        })
        app.get('/data/:id',async(req, res)=>{
            const id = req.params.id;
            const quary = {_id: new ObjectId(id)};
            const result =await database.findOne(quary);
            res.send(result)
        })






        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Weall come Again Rana sir')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
