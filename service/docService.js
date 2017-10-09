var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

moment.locale('es');
var now = moment();
var fechaActaLarga = now.clone().format('D MMMM YYYY');
var fechaInicio = now.clone().subtract(7,'days').format('D-M-YYYY');
var fechaActa = now.clone().format('D-M-YYYY');
console.log(fechaActaLarga, fechaActa, fechaInicio);

var getReportName = function () {
	return 'Acta de Reunión de seguimiento semanal de proyecto '+ fechaActaLarga +'.docx';
}

var generateReport = function (data) {
    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, '../reports/template.docx'), 'binary');

    var zip = new JSZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    //set the templateVariables
    doc.setData({
        "jiraData": data,
        "fechaActaLarga" : fechaActaLarga,
        "fechaActa" : fechaActa,
        "fechaInicio" : fechaInicio
    });

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    } catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({
            error: e
        }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }

    var buf = doc.getZip().generate({
        type: 'nodebuffer'
    });

    // buf is a nodejs buffer, you can either write it to a file or 
    fs.writeFileSync(path.resolve(__dirname, '../reports', getReportName()), buf);
    return getReportName();
};

module.exports.generateReport = generateReport;