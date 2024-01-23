const express = require('express');
const database = require('better-sqlite3');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

const router = express.Router();
// console.log(__dirname + '/database/chinook.sqlite')
const db = database(process.cwd() + '/database/chinook.sqlite')// Connect to the SQLite database



//Schema for Album validation
const albumSchema = Joi.object({
    Title: Joi.string().min(3).max(120).required(),
    ReleaseYear: Joi.number().integer().min(4).optional(),
    ArtistId: Joi.number().integer().required()
})

//Endpoint to request tracks based on a selected album
router.get('/:id/tracks', (req, res) => {
    const tracks = db.prepare('SELECT * FROM tracks WHERE AlbumId = ?')
    const result = tracks.all(req.params.id)

    res.json(result);
})

//Get Album Data
router.get('/:id', (req, res) => {
    const albums = db.prepare('SELECT * FROM albums WHERE AlbumId = ?')
    const result = albums.get(req.params.id)

    res.json(result)
})


//Endpoint to collect an image file and handle file upload

//configure multer to store uploaded files
const storage = multer.diskStorage({
    destination: './_FrontendStarterFiles/albumart/', //define the directory to store the uploaded file
    filename: (req, file, callback) => {
        // callback(null, 'INET_' + file.originalname) //give the uploaded file its original name before storing it
        callback(null, req.albumArt = 'INET_' + Date.now().toString() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.post('/:id/albumart', upload.single('albumart'), (req, res) => {
    const statement = db.prepare('UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?;');
    const result = statement.run(req.albumArt, req.params.id);
    res.json(result);
})


//Endpoint to handle CREATION of albums
router.post('/', (req, res) => {

        //VALIDATOR FOR REQ.BODY
        const {error} = albumSchema.validate(req.body, {abortEarly: false})
        if(error){
            return res.status(422).send(error.details);
        }
    
        const columns = [];
        const values = [];
        const parameters = []

        for(key in req.body){
            parameters.push('?');
            columns.push(key);
            values.push(req.body[key]);
        }
    
        //build a db query that we can send to the db to enter a new record
        let statement = `INSERT INTO albums (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
        const database = db.prepare(statement);
        const result = database.run(values);
        res.status(201).json(result);
})

//Endpoint to handle UPDATE/EDIT albums
router.patch('/:id', (req, res) => {

    const {error} = albumSchema.validate(req.body, {abortEarly: false})
    if(error){
        return res.status(422).send(error.details);
    }

    const columns = [];
    const values = [];
    
    for(key in req.body) {
        columns.push(`${key}=?`);
        values.push(req.body[key]);
    }
    values.push(req.params.id);

    const sql = `UPDATE albums SET ${columns.join(', ')} WHERE AlbumId=?;`
    const statement = db.prepare(sql);
    const result = statement.run(values);

    if(result.changes > 0) {
        res.json(result)
    } else {
        res.status(404).json(result)
    }
    // res.json(result);
})

//Endpoint to handle DELETE of albums
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM albums WHERE AlbumId = ?`
    const statement = db.prepare(sql);
    const result = statement.run([req.params.id])

    if(result.changes > 0){
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})

module.exports = router;