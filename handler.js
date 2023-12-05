//import { config } from 'dotenv'
const config = require('dotenv');
//import { MongoClient, ObjectId } from 'mongodb';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

config.config();
const DB_URL = process.env.DB_URL;

async function connectToCluster(URL) {
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

async function executePost(post_body) {
    let flag=false;
    let mongoClient;

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
    } catch(err) {
        console.error("MongoDB: ",err);
        flag=true;
    }
    finally{
        await mongoClient.close();
        console.log("MongoDB: Done!");

        return flag;
    }
}

async function executeFavorUpdate(id,amount) {
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
        console.log(res)
    } catch(err) {
        console.error("MongoDB: ",err);
        flag = true;
    }
    finally
    {
    await mongoClient.close();
    console.log("MongoDB: Done!");
    return flag
    }
}

async function executeGetAll(sorted) {
    let flag = false;
    let mongoClient;
    let response = [];

    try {
        mongoClient = await connectToCluster(DB_URL);
        const db = mongoClient.db(process.env.DB);
        const collection = db.collection(process.env.DB_Collection);

        console.log("MongoDB: Retrieving all...");

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
        console.log("MongoDB: Done!");

        if (flag) {
            return flag;
        }
        
        return response;
    }
}

module.executeGetAll = executeGetAll;
module.executeFavorUpdate = executeFavorUpdate;
module.executePost = executePost;