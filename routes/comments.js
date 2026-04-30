var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var { validateComment } = require('../middleware/validation');

var dataPath = path.join(__dirname, '..', 'data', 'comments.json');

function readComments() {
	try {
		var raw = fs.readFileSync(dataPath, 'utf-8');
		return JSON.parse(raw);
	} catch (err) {
		return [];
	}
}

function writeComments(comments) {
	fs.writeFileSync(dataPath, JSON.stringify(comments, null, '\t'), 'utf-8');
}

router.post('/', validateComment, function(req, res) {
	var comments = readComments();
	var newComment = {
		id: Date.now().toString(),
		name: req.body.name,
		comment: req.body.comment,
		timestamp: new Date().toISOString()
	};
	comments.push(newComment);
	writeComments(comments);
	res.status(201).json(newComment);
});

module.exports = router;