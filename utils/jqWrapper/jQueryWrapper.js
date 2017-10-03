var jqSource = function(){
    return require("fs").readFileSync(__dirname+"/jquery-3.1.0.js", "utf-8").toString();
}();

exports.source = jqSource;