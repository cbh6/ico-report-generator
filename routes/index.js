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

router.post('/getJirasInfo', function (req, res) {
	try {
		var user = req.body.user;
		var pass = req.body.pass;
		var host = req.body.host;
		var info = req.body.info;

		jiraService.getJirasInfo(user,pass,host,info)
		.then(function (response){
			res.send(docService.generateReport(response));
			
		})
		.catch(function (error) {
			errorUtils.handleError(error, res);
		});
		//res.send('output.docx');
	} catch (error) {
		errorUtils.handleError(error, res);
	}
});

router.get('/download/:file', function(req, res){
	res.download(path.resolve(__dirname, '../reports/' + req.params.file));
});

module.exports = router;
