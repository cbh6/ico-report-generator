'use strict';
/**
 * Created by Vincent on 19/08/2016.
 */

//LOCAL DEPENDENCIES
var prUtils		= require('./promiseUtils');
var errorCodes	= require('./errorCodes');

module.exports.handleError = function(originalError, res) {
	var error = prUtils.handleRejection(originalError);
	var strStack = getStringErrorCausesStack(error);

	if(res){
		res.statusCode = 500;
		res.send("<h1>ERROR</h1><br/><pre>" + strStack + "</pre>");
	}
};

module.exports.printErrorCausesStack = function(error) {
	var strStack = getStringErrorCausesStack(error);

	console.error("######################################################################################################################################)");
	console.error("####                                                      ERROR STACK BEGINS                                                      ####)");
	console.error(strStack);
	console.error("####                                                       ERROR STACK ENDS                                                       ####)");
	console.error("######################################################################################################################################)");
	console.error();
	return strStack;
};

var getStringErrorCausesStack = module.exports.getStringErrorCausesStack = function(error){
	var stack = getErrorCausesStack(error);
	var strStack = error.message + "\n\n";
	for (var err of stack) {
		strStack += "\nCaused by:\n";
		strStack += err.stack.toString() + "\n"
	}
	return strStack;
};

var getErrorCausesStack = module.exports.getErrorCausesStack = function(error) {
	var errorStack = [error];
	var cause = error.cause;
	if (cause) {
		errorStack = errorStack.concat(getErrorCausesStack(cause));
	}
	return errorStack;
};

module.exports.getTypedError = function(type, description){
	var errorType;
	if(typeof type === String){
		errorType = errorCodes[type];
	}
	errorType = type;
	
	var error;
	if(!errorType){
		throw new Error("Unexpected type \""+type+"\"");
	}
	if(!description){
		description = errorType.description;
	}
	
	error = new Error(description);

	var firstSTE = error.stack.shift();
	console.log("removing "+firstSTE);

	return error;
};