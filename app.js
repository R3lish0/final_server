import { config } from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import express, { json } from 'express';
import { router } from './router.js';


// const cors = require('cors');
// const express = require('express');
const app = express();
config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use('/post',router);

app.listen(8080, () => { console.log(`server listening on port ${process.env.PORT}`) })