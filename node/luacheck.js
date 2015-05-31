/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
  "use strict";

  var exec = require('child_process').exec;

  // Asynch linter
  function runLuacheck(text, args, callback) {
    var child = exec('luacheck ' + args + '--codes --no-color -', function(error, stdout, stderr) {
      // Parse stdout to extract the errors.
      var errors = [];
      var rx = /^\s*stdin:(\d+):(\d+):\s*(\([A-Z]\d*\))?\s*(.*)$/mg;

      var line;
      while((line = rx.exec(stdout))) {
        errors.push({
          pos: { line: line[1] - 1, ch: line[2] - 1 },
          message: line[4],
          code: line[3],
        });
      }

      callback(null, errors);
    });
	child.stdin.write(text);
	child.stdin.end();
  }

  function init(domainManager) {
    if(!domainManager.hasDomain("luacheck"))
      domainManager.registerDomain("luacheck", { major: 0, minor: 1 });
    domainManager.registerCommand(
      "luacheck",
      "runLuacheck",
      runLuacheck,
      true,           // asynch
      "Runs Luacheck, and returns an array of errors for the text",
      [{
        name: "text",
        type: "string",
        description: "The text to check with luacheck"
      }, {
        name: "args",
        type: "string",
        description: "Extra arguments to pass to luacheck"
      }], [{
        name: "errors",
        type: "array",
        description: "list of error objects returned by luacheck"
      }]
    );
  }

  exports.init = init;

}());
