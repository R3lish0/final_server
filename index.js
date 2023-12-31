import { config } from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import express, { json } from 'express';



// const cors = require('cors');
// const express = require('express');
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
    let flag=false;
    let mongoClient;
    let id;

    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.DB_Collection);

        console.log("MongoDB: Creating post...");
        const today = new Date();
        const newPost = {
            content: post_body,
            favor: 0,
            date: today,
        }
        const result = await collection.insertOne(newPost);
        var user = await collection.findOne({_id:result.insertedId})

        id = user._id
    } catch(err) {console.log(result);
        console.error("MongoDB: ",err);
        flag=true;
    }
    finally{
        await mongoClient.close();
        console.log("MongoDB: Closed.");

        if (flag === true) {
            return flag;
        }
        return id;
    }
}

export async function executeFavorUpdate(id,amount) {
    let flag = false;
    let mongoClient;
 

    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.DB_Collection);

        console.log("MongoDB: Updating favor...");
        
        let o_id = new ObjectId(id)

        let res = await collection.findOneAndUpdate(
            { "_id": o_id},
            { $inc: {"favor": amount}}
        )
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    }
    finally
    {
    await mongoClient.close();
    console.log("MongoDB: Closed.");
    return flag
    }
}

export async function executeGetAll(sorted) {
    let flag = false;
    let mongoClient;
    let response = [];

    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.DB_Collection);

        console.log("MongoDB: Retrieving all...");

        // deprecated by MongoDB Driver
        // const cursor = await collection.find({});
        // await cursor.forEach((document) => {
        //     jsonArray.push(document);
        // });
        let cursor
        if (sorted === true) {
            cursor = collection.find().sort({favor : 1});
        } else {
            cursor = collection.find();
        }

        for await (const doc of cursor) {
            response.push(doc);
        }
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    } finally {
        await mongoClient.close();
        console.log("MongoDB: Closed.");

        if (flag) {
            return flag;
        }
        
        return response;
    }
}

export async function executeDelete(id) {
    let flag = false;
    let mongoClient;
 
    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.DB_Collection);

        console.log("MongoDB: Deleting post...");
        
        let o_id = new ObjectId(id)

        let res = await collection.deleteOne(
            { "_id": o_id}
        )
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    }
    finally
    {
        await mongoClient.close();
        console.log("MongoDB: Closed.");
    return flag
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
app.get('/allusers', async (req,res) => {
    const error = await executeGetAll();

    if (error === true) {
        //DB unavailable
        res.status = 503;
        return;
    }

    //res.body = error; 
    res.json(error); //not an error
    res.status = 200;
})



app.get('/test', async (req,res) => {
    const error = await executeIdTest();

    if (error === true) {
        //DB unavailable
        res.status = 503;
        return;
    }

    //res.body = error; 
    res.json(error); //not an error
    res.status = 200;
})

app.get('/allusers-sorted', async (req,res) => {
    const error = await executeGetAll(true);

    if (error === true) {
        //DB unavailable
        res.status = 503;
        return;
    }

    //res.body = error; 
    res.json(error); //not an error
    res.status = 200;
})

/*
{
    content: ""
}
*/
app.post('/createpost',async (req,res) => {
    //Express should parse req body automatically?..
    let post_body = req.body.content

     //tell mongodb to start cooking
    let error = await executePost(post_body);
    console.log(error)
    if (error===true) {
        res.status=503;
        return;
    }

    res.status = 200;
    res.send(error.toString());
})

app.put('/favor', async (req,res) => {
    //Express should JSON-ify req automatically?..
    const body = req.body;

    const favor = body.favor;
    const id = body.id;
    //res.body = error;  //not an error
     //tell mongodb to start cooking
    const err = await executeFavorUpdate(id,favor);

    if (err === true) {
        //DB unavailable
        res.status = 503;
        return;
    }
    res.status = 200;
    res.send("Successfully updated post.")

    return err;
})

app.post('/createcomment',(req,res) => {
    res.status = 501;
});

app.delete('/deletepost', async (req,res) => {
    const body = req.body;

    const id = body.id;

    let err = await executeDelete(id);

    if (err === true) {
        //DB unavailable
        res.status = 503;
        return;
    }

    res.status = 200;
    res.send("Delete request completed!")
})

app.listen(8080, () => { console.log(`server listening on port ${process.env.PORT}`) })
