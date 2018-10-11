// Generated by CoffeeScript 2.3.2
(function() {
  var ask, filterLastDays, format, getIndexCount, mapIndicesToAliases, moment, patternAlias, patternTimestamp, printIndicesWithAliases, promisify, rl, stop, stopIfNotString,
    hasProp = {}.hasOwnProperty;

  ({promisify} = require('bluebird'));

  rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // timestamp format
  format = "YYYYMMDDHHmmss";

  // regexp for timestamp
  patternTimestamp = new RegExp("([0-9]{14})");

  patternAlias = new RegExp("([a-zA-Z-]+)[^-0-9]");

  moment = require("moment");

  filterLastDays = function(result, older) {
    var aliases, diff, expired, index, indexTimestamp, valid;
    valid = [];
    expired = [];
    for (index in result) {
      if (!hasProp.call(result, index)) continue;
      aliases = result[index];
      indexTimestamp = patternTimestamp.exec(index)[0];
      diff = moment().diff(moment(indexTimestamp, format), "days");
      if (aliases.length > 0) {
        valid[index] = aliases;
      } else if (typeof older === "string" && "none" === older.trim()) {
        expired[index] = aliases;
      } else if (diff <= Number(older)) {
        valid[index] = aliases;
      } else {
        expired[index] = aliases;
      }
    }
    return {valid, expired};
  };

  getIndexCount = function(obj) {
    return Object.keys(obj).length;
  };

  mapIndicesToAliases = function(result) {
    var i, index, indices, len, output;
    if (!result) {
      return [];
    }
    if (result && Object.keys(result).length === 0) {
      return [];
    }
    output = [];
    indices = Object.keys(result);
    for (i = 0, len = indices.length; i < len; i++) {
      index = indices[i];
      output[index] = Object.keys(result[index].aliases);
    }
    return output;
  };

  stop = function(code) {
    if (typeof code === "number") {
      return process.exit(code);
    } else {
      return process.exit();
    }
  };

  stopIfNotString = function(s) {
    if (typeof s !== "string") {
      console.error("The given argument does not seem to be a string!");
      return stop(1);
    }
  };

  printIndicesWithAliases = function(result) {
    var alias, aliases, index, key, results;
    results = [];
    for (index in result) {
      if (!hasProp.call(result, index)) continue;
      aliases = result[index];
      console.log("\n- [index] %s", index);
      results.push((function() {
        var results1;
        results1 = [];
        for (key in aliases) {
          if (!hasProp.call(aliases, key)) continue;
          alias = aliases[key];
          results1.push(console.log("  - [alias] %s", alias));
        }
        return results1;
      })());
    }
    return results;
  };

  ask = function(assumeYes) {
    return promisify(function(question, callback) {
      if (assumeYes) {
        return callback(null, "y");
      } else {
        return rl.question(question, callback.bind(null, null));
      }
    });
  };

  module.exports = {format, patternTimestamp, filterLastDays, mapIndicesToAliases, stop, printIndicesWithAliases, stopIfNotString, getIndexCount, patternAlias, ask};

}).call(this);
