const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
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
        const applicationCullaction = client.db('newDatabase').collection('application')

        // jwt relatad Api
        app.post('/jwt',async(req, res) => {
            const {email} = req.body;
            const user = {email}
            const token = jwt.sign(user, 'secret', {expiresIn : '1h'});
            res.send({token})
        })


        // database
        app.get('/data', async (req, res) => {
            const email = req.query.email;
            const quary = {};

            if(email){
                quary.hr_email = email;
            }

            const result = await database.find(quary).toArray()
            res.send(result)
        })

        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await database.findOne(quary);
            res.send(result)
        })

        app.post('/data', async(req, res) =>{
            const newData = req.body;
            const result = await database.insertOne(newData);
            res.send(result)
        })


        // applicationCullactio
        app.get('/application/job/:_id', async(req ,res) => {
            const _id = req.params._id;
            const quary = {id : _id}
            const result = await applicationCullaction.find(quary).toArray()
            res.send(result)
        })

        app.post('/application', async (req, res) => {
            const applications = req.body;
            const result = await applicationCullaction.insertOne(applications)
            res.send(result)
        })

        app.get('/application', async (req, res) => {
            const email = req.query.email;
            // console.log(email);

            const quary = { UserEmail: email }

            const result = await applicationCullaction.find(quary).toArray()
            res.send(result)
        })

        // await client.connect();
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
