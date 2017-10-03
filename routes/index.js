var express = require('express');
var router = express.Router();

// Local dependencies
var browser			= require("../utils/browser");
var prUtils			= require("../utils/promiseUtils");
var errorUtils		= require("../utils/errorUtils");
var jiraService		= require("../service/jiraService.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getJirasInfo/:user/:pass/:codes', function (req, res) {
	try {
		var user = req.params.user;
		var pass = req.params.pass;
		var codes = req.params.codes;

		jiraService.getJirasInfo(user,pass,codes)
		
		.then(function (response){
			res.send(response);
		})
		.catch(function (error) {
			errorUtils.handleError(error, res);
		});
	} catch (error) {
		errorUtils.handleError(error, res);
	}
});

module.exports = router;
