require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const moongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const graphqlHttp = require('express-graphql').graphqlHTTP;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');
const fs = require('fs');
const { clearImage } = require('./util/file');

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const app = express();

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + '-' + file.originalname)
    }
});

const fileFilter = (req,file,cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

app.use(bodyParser.json()); // application/json

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images',express.static(path.join(__dirname,'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(auth); // this take care od authentication by setting isauth in req and will be validated in resolver.

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }

    const imageUrl = req.file.path.replace("\\" ,"/");

    return res.status(201).json({ message: 'File stored.', filePath: imageUrl });
  });

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err){
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occured.';
        const code = err.originalError.code || 500;
        return {
            message: message,
            status: code,
            data: data
        }
    }
}));

app.use((error,req,res,next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});


moongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
     app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
