const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('Travel-Blogs');
        const blogsCollection = database.collection('blogs');
        const usersCollection = database.collection('users-collection');

        //POST API FOR NEW POST ADDING API
        app.post('/addPost', async (req, res) => {
            const newPost = req.body;
            let result = await blogsCollection.insertOne(newPost);
            res.json(result);
        });

        //POST API FOR NEW USER ADDING API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        //GET API FOR CHECK ADMIN
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //PUT API FOR NEW USER ADDING API
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //PUT API TO MAKE ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // GET API FOR ALL DATA LOAD IN BLOGS SECTION API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        })

        // GET SINGLE PRODUCT API
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await blogsCollection.findOne(query);
            res.send(product);
        })

        // MANAGE ALL BLOGS API
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result);
        })

        //GET MY BLOGS API
        app.get('/myBlogs/:email', async (req, res) => {
            const email = { email: req.params.email }
            const result = await blogsCollection.find(email).toArray();
            res.send(result);
        })

        // MANAGE ALL BLOGS API
        app.delete('/myBlogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result);
        })

        // MANAGE ALL BLOGS API
        app.delete('/manageBlogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result);
        })

        // GET ALL BLOGS API
        app.get('/manageBlogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const allBookedOrders = await cursor.toArray();
            res.send(allBookedOrders);
        })


    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello, I am form node js and express.')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:`, port)
})
