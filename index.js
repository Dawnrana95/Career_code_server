const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// Middle wair
app.use(cors({
    origin : ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;

    if(!token){
        return res.statas(404).send({massage: 'Page Node found'})
    }
    jwt.verify(token,process.env.JWT_SECRET,async(err, decoded)=>{
        if(err){return res.statas(401).send({massage: 'You are a Bot Fuck You'})}
        req.decoded = decoded
        next()
    })
}




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
        const {UserEmail} = req.body;
        console.log(UserEmail);
        
        const token =jwt.sign({UserEmail},process.env.JWT_SECRET,{expiresIn: '1d'})
        res.cookie('token',token,{
            httpOnly: true,
            secure: false
        })

        res.send({success: true})
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

        app.get('/application',verifyToken, async (req, res) => {
            const email = req.query.email;
            
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
