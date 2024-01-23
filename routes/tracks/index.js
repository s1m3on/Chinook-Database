const express = require('express');
const database = require('better-sqlite3');
const Joi = require('joi');

const router = express.Router();
const db = database(process.cwd() + '/database/chinook.sqlite')// Connect to the SQLite database


//Schema for Track validation
const trackSchema = Joi.object({
    Name: Joi.string().min(3).max(200).required(),
    MediaTypeId: Joi.number().integer().required(),
    AlbumId: Joi.number().integer().required(),
    Milliseconds: Joi.number().integer().min(0).required()
});

//Get Track Data
router.get('/:id', (req, res) => {
    const tracks = db.prepare('SELECT * FROM tracks WHERE TrackId = ?')
    const result = tracks.get(req.params.id)

    res.json(result)
})

//Endpoint to handle CREATION of tracks
router.post('/', (req, res) => {
    //VALIDATOR FOR REQ.BODY
    const {error} = trackSchema.validate(req.body, {abortEarly: false})
    if(error){
        return res.status(422).send(error.details);
    }
        

    const columns = [];
    const values = [];
    const parameters = [];

    for(key in req.body){
        columns.push(key);
        values.push(req.body[key]);
        parameters.push('?');
    }

    const sql = `INSERT INTO tracks (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
    const database = db.prepare(sql);
    const result = database.run(values);

    res.status(201).json(result);
})

//Endpoint to handle UPDATE/EDIT tracks
router.patch('/:id', (req, res) => {

    const {error} = trackSchema.validate(req.body, {abortEarly: false})
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

    const sql = `UPDATE tracks SET ${columns.join(', ')} WHERE TrackId = ?;`
    const statement = db.prepare(sql);
    const result = statement.run(values);

    if(result.changes > 0) {
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})

//Endpoint to handle DELETE of tracks
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM tracks WHERE TrackId = ?`
    const statement = db.prepare(sql);
    const result = statement.run([req.params.id])

    if(result.changes > 0){
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})

module.exports = router;