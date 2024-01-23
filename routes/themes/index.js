const express = require('express');
const database = require('better-sqlite3');

const router = express.Router();
const db = database(process.cwd() + '/database/chinook.sqlite')// Connect to the SQLite database

//Endpoint to get THEMEs
router.get('/', (req, res) => {
    const query = db.prepare('SELECT * FROM themes')
    const result = query.all();

    res.json(result)
})


module.exports = router;