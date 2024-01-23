// Import required modules
const express = require('express');

//IMPORT ROUTER MODULES
const artistsRouter = require('./routes/artists')
const albumsRouter = require('./routes/albums')
const tracksRouter = require('./routes/tracks')
const mediatypesRouter = require('./routes/mediatypes')
const themesRouter = require('./routes/themes')

//creata an instance of an express app
const app = express();

// // Set up middleware to serve static files and parse incoming requests
app.use(express.static('_FrontendStarterFiles'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/artists', artistsRouter)
app.use('/api/albums', albumsRouter)
app.use('/api/tracks', tracksRouter)
app.use('/api/mediatypes', mediatypesRouter)
app.use('/api/themes', themesRouter)


// Start the server and listen on port 5000
app.listen('5000', () => {console.log('Listening on port 5000')})