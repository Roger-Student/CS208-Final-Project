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

router.get('/', function(req, res) {
	var comments = readComments();

	var page = parseInt(req.query.page, 10) || 1;
	var limit = parseInt(req.query.limit, 10) || 10;

	if (page < 1) page = 1;
	if (limit < 1) limit = 10;
	if (limit > 50) limit = 50;

	comments.sort(function(a, b) {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});

	var totalComments = comments.length;
	var totalPages = Math.ceil(totalComments / limit) || 0;
	var start = (page - 1) * limit;
	var paged = comments.slice(start, start + limit);

	res.json({
		comments: paged,
		page: page,
		totalPages: totalPages,
		totalComments: totalComments
	});
});

module.exports = router;