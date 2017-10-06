"use strict";

// Local dependencies
var browser = require("../utils/browser");
var prUtils = require("../utils/promiseUtils");
var errorCodes = require("../utils/errorCodes");
var objUtils = require("../utils/ObjectUtils");

var getJiraInfo = function (url, comment, owner) {
	return new Promise(function (resolve, reject) {
		try {
			browser.visit(decodeURI(url)).then(function (window) {
				var $ = window.$;
				var jiraInfo = {};
				$('html').find('script').remove();
				jiraInfo.codigo = $('#key-val').html();
				jiraInfo.prioridad = $('#priority-val').text().trim();
				jiraInfo.estado = $('#status-val').text().trim();
				jiraInfo.titulo = $('#summary-val').html();
				jiraInfo.componente = $('strong[title="Componente (ICO)"]').next().text().trim();
				jiraInfo.servicio = $('strong[title="Línea  de  Servicio"]').next().text().trim();
				jiraInfo.descripcion = $('#description-val').text().trim();
				jiraInfo.fechaCreada = $('[data-name="F. Creada"]').text().trim();
				jiraInfo.fechaEntrega = $('[data-name="F. Prevista de Entrega"]').text().trim();
				jiraInfo.comment = comment;
				jiraInfo.owner = owner;
				resolve(jiraInfo);
			}).catch(function (err) {
				prUtils.handleRejection(err, reject)
			});
		} catch (error) {
			reject(error);
		}
	});
};

var getJirasInfo = function (user,pass,host,info) {
	// console.log("ENTRADA EN getJirasInfo(", user,pass,host,codes, ")");
	return new Promise(function (resolve, reject) {
		try {
			//Promise array
			var promiseArray = [];
			var url = "https://"+ user +":"+ pass +"@"+ host +"/jira/browse/";

			// codes = codes.split(",");
			// for (var i in codes) {
			//   promiseArray.push(getJiraInfo(url.concat(codes[i])))
			// }

			// Promise.all(promiseArray).then(function (jiras) {
			// 	resolve(jiras);
			// }).catch(function (err) {
			// 	prUtils.handleRejection(err, reject)
			// });
			for(var member in info){
				// var memberData = {};
				// memberData.member = info[member].member;
				for(var card in info[member].cards){
					var cardUrl = url.concat(info[member].cards[card].code);
					var cardComment = info[member].cards[card].comment;
					var cardOwner = info[member].member;
					promiseArray.push(getJiraInfo(cardUrl, cardComment, cardOwner));
				}
			}

			var reportData = {};
			Promise.all(promiseArray).then(function (jiras) {
				for(var key in jiras){
					if(reportData[jiras[key].owner].cards == undefined){
						reportData[jiras[key].owner].cards = [];
					} 
					reportData[jiras[key].owner].cards.push(jiras[key]);
				}
				console.log(reportData);
				//resolve(reportData);
			}).catch(function (err) {
				prUtils.handleRejection(err, reject);
			});

		} catch (error) {
			reject(error);
		}
	});
};
module.exports.getJirasInfo = getJirasInfo;