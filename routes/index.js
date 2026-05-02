var express = require('express');
var router = express.Router();



router.get('/landing', function(req, res) {
	res.render('landing', { title: 'Downtown Donuts', currentPage: 'landing' });
});

router.get('/menu', function(req, res) {
	res.render('menu', { title: 'Our Menu - Downtown Donuts', currentPage: 'menu' });
});

router.get('/about', function(req, res) {
	res.render('about', { title: 'About Us - Downtown Donuts', currentPage: 'about' });
});

router.get('/comments', function(req, res) {
	res.render('comments', { title: 'Comments - Downtown Donuts', currentPage: 'comments' });
});

module.exports = router;