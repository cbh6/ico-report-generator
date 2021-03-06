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
				jiraInfo.comentario = comment;
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
	return new Promise(function (resolve, reject) {
		try {
			//Promise array
			var promiseArray = [];
			var url = "https://"+ user +":"+ pass +"@"+ host +"/jira/browse/";

			var reportData = [];
			for(var key in info){

				// init reportData member
				var newMember = {};
				newMember.name = info[key].member;
				newMember.cards = [];
				reportData.push(newMember);

				for(var card in info[key].cards){
					var cardUrl = url.concat(info[key].cards[card].code);
					var cardComment = info[key].cards[card].comment;
					var cardOwner = info[key].member;
					promiseArray.push(getJiraInfo(cardUrl, cardComment, cardOwner));
				}
			}

			
			Promise.all(promiseArray).then(function (jiras) {
				for(var key in jiras){
					reportData.filter(function(e){
						return e.name == jiras[key].owner;
					})[0].cards.push(jiras[key]);
				}
				resolve(reportData);
			}).catch(function (err) {
				prUtils.handleRejection(err, reject);
			});

		} catch (error) {
			reject(error);
		}
	});
};
module.exports.getJirasInfo = getJirasInfo;