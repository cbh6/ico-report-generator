var express = require('express');
var router = express.Router();
var path = require('path');

// Local dependencies
var browser			= require("../utils/browser");
var prUtils			= require("../utils/promiseUtils");
var errorUtils		= require("../utils/errorUtils");
var jiraService		= require("../service/jiraService.js");
var docService 		= require("../service/docService.js");

function loadFile(url,callback){
	JSZipUtils.getBinaryContent(url,callback);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getJirasInfo/:user/:pass/:host/:codes', function (req, res) {
	try {
		var user = req.params.user;
		var pass = req.params.pass;
		var host = req.params.host;
		var codes = req.params.codes;

		jiraService.getJirasInfo(user,pass,host,codes)
		
		.then(function (response){
			docService.generateReport(response);
			res.download(path.resolve(__dirname, '../reports/output.docx'), 'prueba.docx');
		})
		.catch(function (error) {
			errorUtils.handleError(error, res);
		});
	} catch (error) {
		errorUtils.handleError(error, res);
	}
});

module.exports = router;
