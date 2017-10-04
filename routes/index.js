var express = require('express');
var router = express.Router();
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');

// Local dependencies
var browser			= require("../utils/browser");
var prUtils			= require("../utils/promiseUtils");
var errorUtils		= require("../utils/errorUtils");
var jiraService		= require("../service/jiraService.js");

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
			// loadFile("../template.docx", function(err,content){
			// 	doc = new DocxGen(content)
			// 	doc.setData({
			// 		"peticiones": response
			// 	}); //set the templateVariables
			// 	doc.render() //apply them
			// 	output = doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
			// 	saveAs(output,"output.docx")
			// });

			//Load the docx file as a binary
			var content = fs.readFileSync(path.resolve(__dirname, '../template.docx'), 'binary');

			var zip = new JSZip(content);

			var doc = new Docxtemplater();
			doc.loadZip(zip);

			//set the templateVariables
			doc.setData({
			    "peticiones": response
			});

			try {
			    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
			    doc.render()
			}
			catch (error) {
			    var e = {
			        message: error.message,
			        name: error.name,
			        stack: error.stack,
			        properties: error.properties,
			    }
			    console.log(JSON.stringify({error: e}));
			    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
			    throw error;
			}

			var buf = doc.getZip().generate({type: 'nodebuffer'});

			// buf is a nodejs buffer, you can either write it to a file or 
			fs.writeFileSync(path.resolve(__dirname, '..', 'output.docx'), buf);

			res.send('El documento se ha generado correctamente');

		})
		.catch(function (error) {
			errorUtils.handleError(error, res);
		});
	} catch (error) {
		errorUtils.handleError(error, res);
	}
});

module.exports = router;
