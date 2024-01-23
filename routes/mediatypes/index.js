const express = require('express');
const database = require('better-sqlite3');

const router = express.Router();
const db = database(process.cwd() + '/database/chinook.sqlite')// Connect to the SQLite database


//Endpoint to get MEDIATYPES
router.get('/', (req, res) => {
    const query = db.prepare('SELECT * FROM media_types')
    const result = query.all();

    res.json(result)

})


module.exports = router;