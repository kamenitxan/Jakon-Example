(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("forms/j_foreign_object.js", function(exports, require, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ForeignObjectSelector = function () {
    function ForeignObjectSelector(objectName, objectHash) {
        var _this = this;

        _classCallCheck(this, ForeignObjectSelector);

        this.objectName = objectName;
        this.objectHash = objectHash;
        this.endPoint = "/admin/api/search";
        this.selectbox = document.getElementById(this.objectHash);
        this.searchbox = document.getElementById("js_foreign_" + this.objectHash);

        /* this.selectbox.addEventListener("click", (e) => {
             this.showSearch(e);
         }); */
        this.selectbox.addEventListener("blur", function (e) {
            _this.hideSearch(e);
        });
        this.searchbox.addEventListener("keyup", function (e) {
            _this.handleSearch(e);
        });
        this.searchbox.addEventListener("blur", function (e) {
            _this.handleSearch(e);
        });
        this.handleSearch();
    }

    _createClass(ForeignObjectSelector, [{
        key: "showSearch",
        value: function showSearch() {
            this.searchbox.classList.remove("hidden");
            this.searchbox.focus();
        }
    }, {
        key: "hideSearch",
        value: function hideSearch() {
            if (document.activeElement !== this.searchbox) {
                //this.searchbox.classList.add("hidden");
            }
        }
    }, {
        key: "handleSearch",
        value: function handleSearch() {
            var _this2 = this;

            var Ajax = require("utils/Ajax.js");
            Ajax.post(this.endPoint, {
                objectName: this.objectName,
                query: this.searchbox.value
            }).then(function (data) {
                console.log(data);
                _this2.fillSelect(data);
            }).catch(function (error) {
                return console.error(error);
            });
        }
    }, {
        key: "fillSelect",
        value: function fillSelect(data) {
            var _this3 = this;

            var itemCount = this.selectbox.options.length;
            for (var i = 0; i <= itemCount; i++) {
                this.selectbox.remove(i);
            }
            data.result.forEach(function (e) {
                var opt = document.createElement("option");
                opt.value = e.id;
                opt.text = "Id: " + e.id + " - " + e.name;
                _this3.selectbox.add(opt);
            });
        }
    }]);

    return ForeignObjectSelector;
}();

module.exports = ForeignObjectSelector;
});

require.register("forms/j_textarea.js", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JTextarea = function () {
    function JTextarea() {
        _classCallCheck(this, JTextarea);
    }

    _createClass(JTextarea, [{
        key: 'init',
        value: function init(fieldHash) {
            var megamark = require('megamark');
            var domador = require('domador');
            var woofmark = require('woofmark');
            woofmark(document.querySelector("#editor-container" + fieldHash), {
                parseMarkdown: megamark,
                defaultMode: 'wysiwyg',
                parseHTML: domador
            });
        }
    }]);

    return JTextarea;
}();

;

module.exports = JTextarea;
});

require.register("test.js", function(exports, require, module) {
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // do your setup here
    console.log('kadasdaskdaks app');
});

var megamark = require('megamark');
var woofmark = require('woofmark');
var domador = require('domador');
});

require.register("utils/Ajax.js", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, null, [{
        key: 'post',
        value: function post(url, data) {
            return fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer' // *client, no-referrer
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            });
        }
    }, {
        key: 'get',
        value: function get(url, data) {}
    }]);

    return Ajax;
}();

module.exports = Ajax;
});

require.alias("process/browser.js", "process");
require.alias("punycode/punycode.js", "punycode");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.jQuery = require("jquery");
window["$"] = require("jquery");


});})();require('___globals___');


//# sourceMappingURL=jakon.js.map