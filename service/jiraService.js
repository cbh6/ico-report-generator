"use strict";

//LOCAL DEPENDENCIES
var browser = require("../utils/browser");
var prUtils = require("../utils/promiseUtils");
var errorCodes = require("../utils/errorCodes");
var objUtils = require("../utils/ObjectUtils");

var getJiraInfo = function (url) {
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

				resolve(jiraInfo);
			}).catch(function (err) {
				prUtils.handleRejection(err, reject)
			});
		} catch (error) {
			reject(error);
		}
	});
};

var getJirasInfo = function (user,pass,codes) {
	console.log("ENTRADA EN getJirasInfo(", user,pass,host,codes, ")");
	return new Promise(function (resolve, reject) {
		try {
			//Promise array
			var promiseArray = [];
			console.log(typeof(codes));
			console.log(codes);
			var url = "https://"+ user +":"+ pass +"@"+ host +"/jira/browse/";

			codes = codes.split(",");
			for (var i in codes) {
			  promiseArray.push(getJiraInfo(url.concat(codes[i])))
			}

			Promise.all(promiseArray).then(function (jiras) {
				resolve(jiras);
			}).catch(function (err) {
				prUtils.handleRejection(err, reject)
			});
		} catch (error) {
			reject(error);
		}
	});
};
module.exports.getJirasInfo = getJirasInfo;