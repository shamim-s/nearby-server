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
        const postsCollection = client.db('nearByDB').collection('postsCollection');
        const likesCollection = client.db('nearByDB').collection('likesCollection');

        //Add users to databse when register
        app.post('/addUsers', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //Add user post to databse
        app.post('/user/post', async(req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            res.send(result);
        })

        //add users likes to databse
        app.post('/post/like', async(req, res) => {
            const like = req.body;
            const result = await likesCollection.insertOne(like);
            res.send(result);
        })

        //Get specefic user posts
        app.get('/user/posts/:email', async(req, res) => {
            const email = req.params.email;
            const query = {userEmail: email};
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })

        //Get post likes
        app.get('/post/:id', async(req, res) => {
            const id = req.params.id;
            const query = {PostId: id};
            const result = await likesCollection.find(query).toArray();
            res.send(result);
        })

        //Get all posts
        app.get('/posts/all', async(req, res) => {
            const query = {};
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })

        //Get user for user profile
        app.get('/user/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const result = await usersCollection.findOne(query);
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