/**
 * Created by Vincent on 10/07/2016.
 */
//NPM DEPENDENCIES
var fs = require('fs');

//LOCAL DEPENDENCIES
var errorUtil = require('./errorUtils');

var handleRejection = function (originalError, reject) {
	originalError.message = originalError.message.replace(/Error: /g, '');
	var error = new Error("❯" + originalError.message);
	console.warn("[REJECTION] - ", originalError.message);

	if (originalError.type) {
		//We clone the error type so the next error checks will work after this.
		error.type = originalError.type;
	}

	error.cause = originalError;
	if (typeof reject === "function") {
		reject(error);
	}else{
		errorUtil.printErrorCausesStack(error);
		return error;
	}
};

var getFileText = function (path, options) {
	return new Promise(function (resolve, reject) {
		try {
			getFileBuffer(path, options)
			.then(function (buffer) {
				resolve(buffer.toString());
			})
			.catch(function (err) {
				handleRejection(err, reject)
			});
		} catch (error) {
			reject(error);
		}
	});
};

var getFileBuffer = function (path, options) {
	return new Promise(function (resolve, reject) {
		try {
			fs.readFile(path, options, function (err, buffer) {
				if (err) {
					reject(err);
				} else {
					resolve(buffer);
				}
			})
		} catch (error) {
			reject(error);
		}

	});
};

exports.handleRejection = handleRejection;
exports.getFileText = getFileText;