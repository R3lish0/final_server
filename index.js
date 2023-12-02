import { config } from 'dotenv'
import { MongoClient } from 'mongodb';

const cors = require('cors');
const express = require('express');
const app = express();


config();
const DB_URL = process.env.DB_URL;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

//just mongo things
export async function connectToCluster(URL) {
    let mongoClient;
    
    try {
        mongoClient = new MongoClient(URL);
        console.log("MongoDB: Connecting to cluster...");
        await mongoClient.connect();
        console.log("MongoDB: Connection Established!");
        
        return mongoClient;
    } catch (err) {
        console.error("MongoDB: Connection failed. ", error);
    }
}

export async function executePost(post_body) {
    flag=false;
    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.collection);

        console.log("MongoDB: Creating post...");
        const today = new Date();
        const newPost = {
            content: post_body,
            favor: 0,
            date: today,
        }
        await collection.insertOne(newPost);
    } catch(err) {
        console.error("MongoDB: ",err);
        flag=true;
    } finally {
        await mongoClient.close();
        console.log("MongoDB: Done!");

        return flag;
    }
}

export async function executeFavorUpdate(id,amount) {
    flag = false;
    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.collection);

        console.log("MongoDB: Updating favor...");
        
        await collection.updateMany(
            { id },
            { $inc: {favor: amount} }
        )
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    } finally {
        await mongoClient.close();
        console.log("MongoDB: Done!");

        return flag;
    }
}

export async function executeGetAll() {
    flag = false;
    jsonArray = {};
    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.collection);

        console.log("MongoDB: Retrieving all...");
        
        const cursor = await collection.find({});
        await cursor.forEach((document) => {
            jsonArray.push(document);
        });

        return jsonArray;
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    } finally {
        await mongoClient.close();
        console.log("MongoDB: Done!");

        if (flag) {
            return flag;
        }
        
        return jsonArray;
    }
}

app.get('/', (req, res) => {
    res.send('Hello from our server!')

    res.status = 200;
})

/*
returns

JSON array of post objects
*/
app.get('/allusers', (req,res) => {
    const error = executeGetAll();

    if (error === true) {
        //DB unavailable
        res.status = 503;
        return;
    }

    content = error;
    res.body = content;
    res.status = 200;
})

/*
{
    content: ""
}
*/
app.post('/createpost',(req,res) => {
    //Express should JSON-ify req automatically?..
    let post_body = req.body.content

     //tell mongodb to start cooking
    executePost(post_body);

    res.status = 201;
})

/*
{
    id
    favor (1 or -1)
}
*/
app.put('/favor',(req,res) => {
    //Express should JSON-ify req automatically?..
    const body = req.body;

    const favor = body.favor;
    const id = body.id;

     //tell mongodb to start cooking
    const err = executeFavorUpdate(id,favor);

    if (flag) {
        res.status = 503;
        return;
    }

    res.status = 200;
})
/*
app.post('/createcomment',(req,res) => {

    //get object
    //tell mongodb to start cooking
    res.status = 201;
})
*/




















// vv PORT THINGY IS THIS WAY vv




















//WAY














//WAY WAY













//WAY DOWN 


















// HERE
app.listen(8080, () => { console.log('server listening on port 8080') })
