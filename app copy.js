// // Import required modules
// const express = require('express');
// const database = require('better-sqlite3');
// const multer = require('multer');
// const path = require('path');
// const Joi = require('joi');

// // Connect to the SQLite database
// const db = database(__dirname + '/database/chinook.sqlite')

// //creata an instance of an express app
// const app = express();

// // // Set up middleware to serve static files and parse incoming requests
// app.use(express.static('_FrontendStarterFiles'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));


// //Schema for Artists validation
// const artistSchema = Joi.object({
//     Name: Joi.string().min(3).max(120).required()
// })

// //Schema for Album validation
// const albumSchema = Joi.object({
//     Title: Joi.string().min(3).max(120).required(),
//     ReleaseYear: Joi.number().integer().min(4).optional(),
//     ArtistId: Joi.number().integer().required()
// })

// //Schema for Track validation
// const trackSchema = Joi.object({
//     Name: Joi.string().min(3).max(200).required(),
//     MediaTypeId: Joi.number().integer().required(),
//     AlbumId: Joi.number().integer().required(),
//     Milliseconds: Joi.number().integer().min(0).required()
// });


// //Endpoint to get THEMEs
// app.get('/api/themes', (req, res) => {
//     const query = db.prepare('SELECT * FROM themes')
//     const result = query.all();

//     res.json(result)
// })

// //Endpoint to get MEDIATYPES
// app.get('/api/mediatypes', (req, res) => {
//     const query = db.prepare('SELECT * FROM media_types')
//     const result = query.all();

//     res.json(result)

// })

// //Handle GET requests to /api/artists
// app.get('/api/artists', (req, res) => {
//     // Define a query to send to the database to retrieve all artists
//     const query = db.prepare('SELECT * FROM artists')
//     const results = query.all();

//     // Respond to the client with the retrieved data
//     res.json(results)
// })

// // Handle GET requests to /api/artists/:id/albums
// app.get('/api/artists/:id/albums', (req, res) => {
//     // Retrieve albums associated with a specific artist ID from the database
//     const albumData = db.prepare('SELECT * FROM albums WHERE ArtistId = ?')
//     const albums = albumData.all(req.params.id)

//     // Respond to the client with the retrieved albums data
//     res.json(albums)
// })

// //Endpoint to request tracks based on a selected album
// app.get('/api/albums/:id/tracks', (req, res) => {
//     const tracks = db.prepare('SELECT * FROM tracks WHERE AlbumId = ?')
//     const result = tracks.all(req.params.id)

//     res.json(result);
// })

// //Get Artist Data
// app.get('/api/artists/:id', (req, res) => {
//     const artist = db.prepare('SELECT * FROM artists WHERE ArtistId = ?')
//     const result = artist.get(req.params.id)

//     res.json(result)
// })

// //Get Track Data
// app.get('/api/tracks/:id', (req, res) => {
//     const tracks = db.prepare('SELECT * FROM tracks WHERE TrackId = ?')
//     const result = tracks.get(req.params.id)

//     res.json(result)
// })

// //Get Album Data
// app.get('/api/albums/:id', (req, res) => {
//     const albums = db.prepare('SELECT * FROM albums WHERE AlbumId = ?')
//     const result = albums.get(req.params.id)

//     res.json(result)
// })


// //Endpoint to collect an image file and handle file upload

// //configure multer to store uploaded files
// const storage = multer.diskStorage({
//     destination: './_FrontendStarterFiles/albumart/', //define the directory to store the uploaded file
//     filename: (req, file, callback) => {
//         // callback(null, 'INET_' + file.originalname) //give the uploaded file its original name before storing it
//         callback(null, req.albumArt = 'INET_' + Date.now().toString() + path.extname(file.originalname))
//     }
// })

// const upload = multer({storage: storage})

// app.post('/api/albums/:id/albumart', upload.single('albumart'), (req, res) => {
//     const statement = db.prepare('UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?;');
//     const result = statement.run(req.albumArt, req.params.id);
//     res.json(result);
// })

// //-------------------------------------------------------------------------------------------------------------------------

// //Endpoint to handle CREATION of artist name
// app.post('/api/artists', (req, res) =>{

//     //VALIDATOR FOR REQ.BODY
//     const {error} = artistSchema.validate(req.body)
//     if(error){
//         return res.status(422).send(error.details);
//     }

//     const artistName = db.prepare('INSERT INTO artists (Name) VALUES (?);');
//     const result = artistName.run(req.body.Name);
//     res.json(result)
// })

// //Endpoint to handle UPDATE/EDIT of artist name
// app.patch('/api/artists/:id', (req, res) => {

//     //VALIDATOR FOR REQ.BODY
//     const {error} = artistSchema.validate(req.body)
//     if(error){
//         return res.status(422).send(error.details);
//     }

//     const statement = db.prepare('UPDATE artists SET Name = ? WHERE ArtistId = ?;');
//     const result = statement.run([req.body.Name, req.params.id]);

//     if(result.changes > 0){
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
// })

// //Endpoint to handle DELETE of artist name
// app.delete('/api/artists/:id', (req, res) => {
//     const sql = `DELETE FROM artists WHERE ArtistId = ?`
//     const statement = db.prepare(sql);
//     const result = statement.run([req.params.id])

//     if(result.changes > 0){
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
// })

// //-------------------------------------------------------------------------------------------------------------------------

// //Endpoint to handle CREATION of albums
// app.post('/api/albums', (req, res) => {
//     //VALIDATOR FOR REQ.BODY
//     // const {error} = albumSchema.validate(req.body)
//     // if(error){
//     //     return res.status(422).send(error.details);
//     // }

//     // const albumInfo = db.prepare('INSERT INTO albums (Title, ReleaseYear, ArtistId) VALUES (?, ?, ?);');
//     // const result = albumInfo.run([req.body.Title, req.body.ReleaseYear, req.body.ArtistId]);
//     // res.json(result)

//         //VALIDATOR FOR REQ.BODY
//         const {error} = albumSchema.validate(req.body, {abortEarly: false})
//         if(error){
//             return res.status(422).send(error.details);
//         }
    
//         const columns = [];
//         const values = [];
//         const parameters = []

//         for(key in req.body){
//             parameters.push('?');
//             columns.push(key);
//             values.push(req.body[key]);
//         }
    
//         //build a db query that we can send to the db to enter a new record
//         let statement = `INSERT INTO albums (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
//         const database = db.prepare(statement);
//         const result = database.run(values);
//         res.status(201).json(result);
// })

// //Endpoint to handle UPDATE/EDIT albums
// app.patch('/api/albums/:id', (req, res) => {

//     const {error} = albumSchema.validate(req.body, {abortEarly: false})
//     if(error){
//         return res.status(422).send(error.details);
//     }

//     const columns = [];
//     const values = [];
    
//     for(key in req.body) {
//         columns.push(`${key}=?`);
//         values.push(req.body[key]);
//     }
//     values.push(req.params.id);

//     const sql = `UPDATE albums SET ${columns.join(', ')} WHERE AlbumId=?;`
//     const statement = db.prepare(sql);
//     const result = statement.run(values);

//     if(result.changes > 0) {
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
//     // res.json(result);
// })

// //Endpoint to handle DELETE of albums
// app.delete('/api/albums/:id', (req, res) => {
//     const sql = `DELETE FROM albums WHERE AlbumId = ?`
//     const statement = db.prepare(sql);
//     const result = statement.run([req.params.id])

//     if(result.changes > 0){
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
// })

// //-----------------------------------------------------------------------------------------------------------------------------



// //Endpoint to handle CREATION of tracks
// app.post('/api/tracks', (req, res) => {
//     //VALIDATOR FOR REQ.BODY
//     const {error} = trackSchema.validate(req.body, {abortEarly: false})
//     if(error){
//         return res.status(422).send(error.details);
//     }
        

//     const columns = [];
//     const values = [];
//     const parameters = [];

//     for(key in req.body){
//         columns.push(key);
//         values.push(req.body[key]);
//         parameters.push('?');
//     }

//     const sql = `INSERT INTO tracks (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
//     const database = db.prepare(sql);
//     const result = database.run(values);

//     res.status(201).json(result);
// })

// //Endpoint to handle UPDATE/EDIT tracks
// app.patch('/api/tracks/:id', (req, res) => {

//     const {error} = trackSchema.validate(req.body, {abortEarly: false})
//     if(error){
//         return res.status(422).send(error.details);
//     }

//     const columns = [];
//     const values = [];
    
//     for(key in req.body) {
//         columns.push(`${key}=?`);
//         values.push(req.body[key]);
//     }
//     values.push(req.params.id);

//     const sql = `UPDATE tracks SET ${columns.join(', ')} WHERE TrackId = ?;`
//     const statement = db.prepare(sql);
//     const result = statement.run(values);

//     if(result.changes > 0) {
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
// })

// //Endpoint to handle DELETE of tracks
// app.delete('/api/tracks/:id', (req, res) => {
//     const sql = `DELETE FROM tracks WHERE TrackId = ?`
//     const statement = db.prepare(sql);
//     const result = statement.run([req.params.id])

//     if(result.changes > 0){
//         res.json(result)
//     } else {
//         res.status(404).json(result)
//     }
// })


// // Start the server and listen on port 5000
// app.listen('5000', () => {console.log('Listening on port 5000')})