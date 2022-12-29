const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Datbase Connection
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@database-2.yrgjegt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const usersCollection = client.db('nearByDB').collection('usersCollection');

        app.post('/addUsers', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
    }
    catch{
        console.log('Connection to MongoDB failed');
    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('NearBy Server Running');
})

app.listen(port, () => {
    console.log(`NearBy Server Running in port ${port}`);
})