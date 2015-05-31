/*
 * Copyright (c) 2015 Malcolm Taylor
 *
 * See the file LICENSE for copying permission.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* global define, brackets, $, JSHINT */
define(function (require, exports, module) {
  "use strict";

  var CodeInspection      = brackets.getModule("language/CodeInspection"),
      PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
      ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
      NodeDomain          = brackets.getModule("utils/NodeDomain"),
      pm = PreferencesManager.getExtensionPrefs("jshint"),
      options = {},
      globals_arg = '';

  pm.definePreference("options", "object", {}).on("change", function () {
    options = pm.get("options");
  });

  pm.definePreference("globals", "object", {}).on("change", function () {
    globals_arg = '';
    $.each(pm.get("globals"), function(name, value) {
      if(value)   globals_arg += ' ' + name;
    });
    if(globals_arg)
      globals_arg = '--globals' + globals_arg;
  });

  var luacheckDomain = new NodeDomain("luacheck", ExtensionUtils.getModulePath(module, "node/luacheck"));

  // Asynch linter
  function scanFileAsync(text, fullPath) {
    var deferred = new $.Deferred();
    
    luacheckDomain.exec('runLuacheck', text, globals_arg).done(function(items) {
      var errors = [];
      items.forEach(function(item) {
        errors.push({
          pos: item.pos,
          message: item.message,
          type: (item.code && /\(W/.test(item.code)) ? CodeInspection.Type.WARNING : CodeInspection.Type.ERROR,
        });
      });
      deferred.resolve({ errors: errors });
    }).fail(function(err) {
      console.log('[luacheck] failed to run luacheck.runLuacheck', err);
      deferred.reject(err);
    });
    return deferred.promise();
  }

  CodeInspection.register("lua", {
    name: "Luacheck",
    scanFileAsync: scanFileAsync
  });
});
