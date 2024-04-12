var express = require('express');
var router = express.Router();


router.get('/', function test(req, res) {
    res.send('heyo !');
})

module.exports = router