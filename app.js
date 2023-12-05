//import { config } from 'dotenv'
const config = require('dotenv');
const cors = require('cors');
//import cors from 'cors';
//import express, { json } from 'express';
const express = require('express');
const json = express.json;
//import { router } from './router.js';
const router = require('./router.js')
//"type": "module",

// const cors = require('cors');
// const express = require('express');
const app = express();
config.config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use('/post/',router);
app.use('/post',router);
app.use('/post/sorted',router);
app.use('/post/:id',router);
app.use('/post/:id/favor/:amount',router);

app.listen(8080, () => { console.log(`server listening on port ${process.env.PORT}`) })