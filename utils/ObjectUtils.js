'use strict';
/**
 * This method sets a value into a property path in an object.
 * This means, if you send an empty object, "a.b.c" as path and "test" as value the result would be {a:{b:{c:"test"}}}.
 * @param {object} baseObject
 * @param {String, Array} path
 * @param {*} property
 */
module.exports.setAtPath = function (baseObject, path, property) {
	if (typeof path === 'string') {
		path = path.split('.');
	}
	//We clone this array because we are going to empty it
	path = path.slice();
	var currentProperty = baseObject;
	var currentPropertyName;
	while (path.length > 1) {
		currentPropertyName = path.shift();

		if (!currentProperty[currentPropertyName]) {
			currentProperty[currentPropertyName] = {};
		}
		currentProperty = currentProperty[currentPropertyName];
	}

	var lastPropertyName = path.shift();
	currentProperty[lastPropertyName] = property;
};

/**
 * This method gets a value from a property path in an object.
 * This means, if you send an empty object like this: {a:{b:{c:"test"}}} and "a.b.c" as path, the result will be "test"
 * @param {object} baseObject
 * @param {String, Array} path
 * @param {boolean} closest if set to true, in case of the path matching only part of the object sub-properties, the last of the matching properties will be returned instead of throwing an error.
 * @return {*} value at specified path in object
 */
module.exports.getFromPath = function (baseObject, path, closest) {
	if (typeof path === 'string') {
		path = path.split('.');
	}
	//We clone this array because we are going to empty it
	path = path.slice();
	var currentProperty = baseObject;
	var currentPropertyName;
	while (path.length > 0) {
		currentPropertyName = path.shift();

		if (closest) {
			if (currentProperty[currentPropertyName] === undefined) {
				return currentProperty;
			}
		}

		currentProperty = currentProperty[currentPropertyName];
	}
	return currentProperty;
};

module.exports.isDate = function (d) {
	return d.constructor === Date;
};