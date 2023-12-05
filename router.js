import { config } from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import express, { json } from 'express';
import { executeGetAll, executeFavorUpdate, executePost } from './handler.js';

export const router = express.Router();

router.route('/post')
    .all(function (req, res) {
        //middleware (nah)
    })
    .get('/', async (req, res) => {
        const error = await handler.executeGetAll(false);

        if (error === true) {
            //DB unavailable
            res.status = 503;
            return;
        }
    
        res.json(error); //not an error
        res.status = 200;
    })
    .get('/sorted/', async (req, res) => {
        const error = await handler.executeGetAll(true);

        if (error === true) {
            //DB unavailable
            res.status = 503;
            return;
        }
    
        res.json(error); //not an error
        res.status = 200;
    })
    .post(async (req, res) => {
        let post_body = req.body.content

        await executePost(post_body);

        res.status = 201;
    })
    .post('/:id/comment',async (req,res) => {
        res.status = 501;
    })
    .put('/:id/favor/:amount', async function (res, req) {
        //Express should JSON-ify req automatically?..
        const body = req.body;

        const favor = body.favor;
        const id = body.id;
        //res.body = error;  //not an error
        //tell mongodb to start cooking
        const err = await handler.executeFavorUpdate(id,favor);

        if (err === true) {
            //DB unavailable
            res.status = 503;
            return;
        }
        res.status = 200;
        res.send("good job buckaroo")

        return err
    })
    .delete('/:id', async (res,req) => {
        res.status = 501;
    })

//module.exports = router;