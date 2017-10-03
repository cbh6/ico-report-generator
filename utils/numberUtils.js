'use strict';
/**
 * Created by Vincent on 21/08/2016.
 */

//NPM DEPENDENCIES
var numeral = require('numeral');

var DEFAULT_LANGUAGE = 'es-ES';

var supportedLanguages = ['es-ES'];

for(var language of supportedLanguages){
	var languageFile = require('numeral/languages/'+language);
	numeral.language(language, languageFile);
}

/**
 * Will return the unformatted number
 * @param {String} numberStr
 * @param {String} numberFormat
 */
var unFormat = module.exports.unFormat = function(numberStr, numberFormat){
	if(numberFormat){
		numeral.language(numberFormat);
	}else{
		numeral.language(DEFAULT_LANGUAGE);
	}
	return numeral().unformat(numberStr);
};

/**
 * Will return the number in float format.
 * @param {String} numberStr
 * @param {String} numberFormat
 * @return {Number}
 */
module.exports.parseFloat = function(numberStr, numberFormat){
	return parseFloat(unFormat(numberStr, numberFormat));
};

/**
 * Will return the number in integer format.
 * @param {String} numberStr
 * @param {String} numberFormat
 * @return {Number}
 */
module.exports.parseInt = function(numberStr, numberFormat){
	return parseInt(unFormat(numberStr, numberFormat));
};

/**
 * Will return recieved string without any non-numerical characters
 * Example: "12-3 45(6)A%.:" --> "123456"
 * @param {String} dirtyNumber
 * @return {String}
 */
module.exports.cleanNumberString = (dirtyNumber)=>{
	return dirtyNumber.replace(/[^0-9]/g,'');
};

