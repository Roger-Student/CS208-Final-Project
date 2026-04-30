function validateComment(req, res, next) {
	const { name, comment } = req.body;

	if (!name || !comment) {
		return res.status(400).json({ error: 'Name and comment are required.' });
	}

	const trimmedName = name.trim();
	const trimmedComment = comment.trim();

	if (!trimmedName) {
		return res.status(400).json({ error: 'Name cannot be empty.' });
	}

	if (!trimmedComment) {
		return res.status(400).json({ error: 'Comment cannot be empty.' });
	}

	if (trimmedName.length > 100) {
		return res.status(400).json({ error: 'Name must be under 100 characters.' });
	}

	if (trimmedComment.length > 1000) {
		return res.status(400).json({ error: 'Comment must be under 1000 characters.' });
	}

	req.body.name = trimmedName;
	req.body.comment = sanitize(trimmedComment);
	next();
}

function sanitize(str) {
	return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = { validateComment };