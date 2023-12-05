//import express, { json } from 'express';
const express = require('express');
//import { executeGetAll, executeFavorUpdate, executePost } from './handler.js';
const handler = require('./handler.js');
const executeGetAll = handler.executeGetAll;
const executeFavorUpdate = handler.executeFavorUpdate;
const executePost = handler.executePost;

var router = express.Router();


router.route('/post')
    .post(async (req, res) => {
        let post_body = req.body.content

        await executePost(post_body);

        res.status = 201;
    })

router.route('/post/')
    .get(async (req,res) => {
        const error = await executeGetAll(false);

        if (error === true) {
            //DB unavailable
            res.status = 503;
            return;
        }
    
        res.json(error); //not an error
        res.status = 200;
    })

router.route('/post/sorted')
    .get(async (req,res) => {
        const error = await executeGetAll(true);

        if (error === true) {
            //DB unavailable
            res.status = 503;
            return;
        }
    
        res.json(error); //not an error
        res.status = 200;
    })

router.route('/post/:id')
    .delete(async (res,req) => {
        res.status = 501;
    })

router.route('/post/:id/favor/:amount')
    .put(async (res, req) => {
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
        res.send("good job buckaroo")

        return err
    })

module.exports = router;