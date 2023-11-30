const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

// GETSSSSSS //
app.get('/', (req, res) => {
    res.send('Hello from our server!')

    // req.status = 200;
})

app.get('/allusers', (req,res) => {

})

// POSTSSSSSSS //
app.post('/createpost',(req,res) => {
    let content = body.content


    //tell mongodb to start cooking


    res.status = 201;
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
