/**
 * Created by Vincent on 10/07/2016.
 */

//NPM DEPENDENCES
var request = require("request");
var jsdom = require("jsdom");
var valUrl = require("valid-url");

//LOCAL DEPENDENCES
var prUtils = require("./promiseUtils");
var errorCodes = require("./errorCodes");
var jqw = require("./jqWrapper/jQueryWrapper");

/**
 * Este método obtiene la response de una página en formato jQuery para un tratamiento más sencillo del arbol DOM.
 * El valor retornado es window, la variable jQuery ($) se encuentra en "window.$".
 * ---
 * This method gets the response from a webpage already formatted in jQuery for a easier DOM management.
 * The return value is window, the jQuery variable ($) is in "window.$".
 *
 * @param url
 * @return Promise: resolve(window), reject(err)
 */
var visit = function (url) {
	return new Promise(function (resolve, reject) {
		getWebResponse(url).then(function (resp) {
			var settings = {
				html: resp.body,
				src: [jqw.source],
				done: function proccess$(err, window) {
					if (err) {
						var error = new Error("Error while jquerifying with jsdom [" + err + "] ");
						error.rejectionData = arguments;
						reject(error);
					} else {
						jsdom.changeURL(window, resp.request.href);
						resolve(window);
					}
				}
			};

			//TODO: Check the jsdom version

			jsdom.env(settings);
		}).catch(function (err) {
			prUtils.handleRejection(err, reject)
		});
	});
};

/**
 * Método encargado de visitar una url recibida por parámetro y obtener la response correspondiente mediante el uso de la líbrería request de npm.
 * ---
 * This method will visit a parameter-recieved URL and get the response using the request library from npm.
 *
 * @param url
 *
 * @return Promise: resolve(response), reject(err)
 */
var getWebResponse = function (url) {
	return new Promise(function (resolve, reject) {
		try {
			var encodedURL = encodeURI(url);

			if (!valUrl.is_web_uri(encodedURL)) {
				return reject(new Error(" The URL [" + url + "] is not valid"));
			}

			var requestOptions = {
				uri: encodedURL,
				headers: {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
					"user-agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36"
				}
			};
			request(requestOptions, function doRequest(err, resp) {
				if (err) {
					var error = new Error("Error visiting URL [" + encodedURL + "] -- " + err.message);
					error.cause = err;
					error.rejectionData = arguments;
					reject(error);
				} else if (resp.statusCode !== 200) {
					var invalidStatusCodeError = new Error("Error: Invalid StatusCode [" + resp.statusCode + "] when trying to visit URL [" + encodedURL + "]");
					invalidStatusCodeError.type = errorCodes.INVALID_WEB_STATUS_CODE;
					invalidStatusCodeError.rejectionData = arguments;
					reject(invalidStatusCodeError);
				}
				else {
					resolve(resp);
				}
			});
		} catch (error) {
			var localError = new Error("Error visiting URL [" + url + "] -- " + error.message);
			localError.cause = error;
			localError.rejectionData = arguments;
			reject(localError);
		}
	});
};

module.exports.getWebResponse = getWebResponse;
module.exports.visit = visit;