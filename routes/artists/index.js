const express = require('express');
const database = require('better-sqlite3');
const Joi = require('joi');

const router = express.Router();
// console.log(__dirname + '/database/chinook.sqlite')
const db = database(process.cwd() + '/database/chinook.sqlite')// Connect to the SQLite database


//Schema for Artists validation
const artistSchema = Joi.object({
    Name: Joi.string().min(3).max(120).required()
})

//Handle GET requests to /api/artists
router.get('/', (req, res) => {
    // Define a query to send to the database to retrieve all artists
    const query = db.prepare('SELECT * FROM artists')
    const results = query.all();

    // Respond to the client with the retrieved data
    res.json(results)
})

//Get Artist Names
router.get('/:id', (req, res) => {
    const artist = db.prepare('SELECT * FROM artists WHERE ArtistId = ?')
    const result = artist.get(req.params.id)

    res.json(result)
})

// Handle GET requests to /api/artists/:id/albums
router.get('/:id/albums', (req, res) => {
    // Retrieve albums associated with a specific artist ID from the database
    const albumData = db.prepare('SELECT * FROM albums WHERE ArtistId = ?')
    const albums = albumData.all(req.params.id)

    // Respond to the client with the retrieved albums data
    res.json(albums)
})

//Endpoint to handle CREATION of artist name
router.post('/', (req, res) =>{

    //VALIDATOR FOR REQ.BODY
    const {error} = artistSchema.validate(req.body)
    if(error){
        return res.status(422).send(error.details);
    }

    const artistName = db.prepare('INSERT INTO artists (Name) VALUES (?);');
    const result = artistName.run(req.body.Name);
    res.json(result)
})

//Endpoint to handle UPDATE/EDIT of artist name
router.patch('/:id', (req, res) => {

    //VALIDATOR FOR REQ.BODY
    const {error} = artistSchema.validate(req.body)
    if(error){
        return res.status(422).send(error.details);
    }

    const statement = db.prepare('UPDATE artists SET Name = ? WHERE ArtistId = ?;');
    const result = statement.run([req.body.Name, req.params.id]);

    if(result.changes > 0){
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})

//Endpoint to handle DELETE of artist
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM artists WHERE ArtistId = ?`
    const statement = db.prepare(sql);
    const result = statement.run([req.params.id])

    if(result.changes > 0){
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})


module.exports = router;