(self["webpackChunkbrunch_app"] = self["webpackChunkbrunch_app"] || []).push([["/js/docs"],{

/***/ "./modules/backend/src/frontend/docs/js/doctools.js":
/*!**********************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/doctools.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/*
 * doctools.js
 * ~~~~~~~~~~~
 *
 * Sphinx JavaScript utilities for all documentation.
 *
 * :copyright: Copyright 2007-2018 by the Sphinx team, see AUTHORS.
 * :license: BSD, see LICENSE for details.
 *
 */

/**
 * make the code below compatible with browsers without
 * an installed firebug like debugger
if (!window.console || !console.firebug) {
  var names = ["log", "debug", "info", "warn", "error", "assert", "dir",
    "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace",
    "profile", "profileEnd"];
  window.console = {};
  for (var i = 0; i < names.length; ++i)
    window.console[names[i]] = function() {};
}
 */

/**
 * small helper function to urldecode strings
 */
jQuery.urldecode = function (x) {
  return decodeURIComponent(x).replace(/\+/g, ' ');
};

/**
 * small helper function to urlencode strings
 */
jQuery.urlencode = encodeURIComponent;

/**
 * This function returns the parsed url parameters of the
 * current request. Multiple values per key are supported,
 * it will always return arrays of strings for the value parts.
 */
jQuery.getQueryParameters = function (s) {
  if (typeof s === 'undefined') s = document.location.search;
  var parts = s.substr(s.indexOf('?') + 1).split('&');
  var result = {};
  for (var i = 0; i < parts.length; i++) {
    var tmp = parts[i].split('=', 2);
    var key = jQuery.urldecode(tmp[0]);
    var value = jQuery.urldecode(tmp[1]);
    if (key in result) result[key].push(value);else result[key] = [value];
  }
  return result;
};

/**
 * highlight a given string on a jquery object by wrapping it in
 * span elements with the given class name.
 */
jQuery.fn.highlightText = function (text, className) {
  function highlight(node, addItems) {
    if (node.nodeType === 3) {
      var val = node.nodeValue;
      var pos = val.toLowerCase().indexOf(text);
      if (pos >= 0 && !jQuery(node.parentNode).hasClass(className) && !jQuery(node.parentNode).hasClass("nohighlight")) {
        var span;
        var isInSVG = jQuery(node).closest("body, svg, foreignObject").is("svg");
        if (isInSVG) {
          span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        } else {
          span = document.createElement("span");
          span.className = className;
        }
        span.appendChild(document.createTextNode(val.substr(pos, text.length)));
        node.parentNode.insertBefore(span, node.parentNode.insertBefore(document.createTextNode(val.substr(pos + text.length)), node.nextSibling));
        node.nodeValue = val.substr(0, pos);
        if (isInSVG) {
          var bbox = span.getBBox();
          var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.x.baseVal.value = bbox.x;
          rect.y.baseVal.value = bbox.y;
          rect.width.baseVal.value = bbox.width;
          rect.height.baseVal.value = bbox.height;
          rect.setAttribute('class', className);
          var parentOfText = node.parentNode.parentNode;
          addItems.push({
            "parent": node.parentNode,
            "target": rect
          });
        }
      }
    } else if (!jQuery(node).is("button, select, textarea")) {
      jQuery.each(node.childNodes, function () {
        highlight(this, addItems);
      });
    }
  }
  var addItems = [];
  var result = this.each(function () {
    highlight(this, addItems);
  });
  for (var i = 0; i < addItems.length; ++i) {
    jQuery(addItems[i].parent).before(addItems[i].target);
  }
  return result;
};

/*
 * backward compatibility for jQuery.browser
 * This will be supported until firefox bug is fixed.
 */
if (!jQuery.browser) {
  jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  };
  jQuery.browser = {};
  jQuery.browser[jQuery.uaMatch(navigator.userAgent).browser] = true;
}

/**
 * Small JavaScript module for the documentation.
 */
var Documentation = {
  init: function init() {
    this.fixFirefoxAnchorBug();
    this.highlightSearchWords();
    this.initIndexTable();
  },
  /**
   * i18n support
   */
  TRANSLATIONS: {},
  PLURAL_EXPR: function PLURAL_EXPR(n) {
    return n === 1 ? 0 : 1;
  },
  LOCALE: 'unknown',
  // gettext and ngettext don't access this so that the functions
  // can safely bound to a different name (_ = Documentation.gettext)
  gettext: function gettext(string) {
    var translated = Documentation.TRANSLATIONS[string];
    if (typeof translated === 'undefined') return string;
    return typeof translated === 'string' ? translated : translated[0];
  },
  ngettext: function ngettext(singular, plural, n) {
    var translated = Documentation.TRANSLATIONS[singular];
    if (typeof translated === 'undefined') return n == 1 ? singular : plural;
    return translated[Documentation.PLURALEXPR(n)];
  },
  addTranslations: function addTranslations(catalog) {
    for (var key in catalog.messages) this.TRANSLATIONS[key] = catalog.messages[key];
    this.PLURAL_EXPR = new Function('n', 'return +(' + catalog.plural_expr + ')');
    this.LOCALE = catalog.locale;
  },
  /**
   * add context elements like header anchor links
   */
  addContextElements: function addContextElements() {
    $('div[id] > :header:first').each(function () {
      $("<a class=\"headerlink\">\xB6</a>").attr('href', '#' + this.id).attr('title', _('Permalink to this headline')).appendTo(this);
    });
    $('dt[id]').each(function () {
      $("<a class=\"headerlink\">\xB6</a>").attr('href', '#' + this.id).attr('title', _('Permalink to this definition')).appendTo(this);
    });
  },
  /**
   * workaround a firefox stupidity
   * see: https://bugzilla.mozilla.org/show_bug.cgi?id=645075
   */
  fixFirefoxAnchorBug: function fixFirefoxAnchorBug() {
    if (document.location.hash && $.browser.mozilla) window.setTimeout(function () {
      document.location.href += '';
    }, 10);
  },
  /**
   * highlight the search words provided in the url in the text
   */
  highlightSearchWords: function highlightSearchWords() {
    var params = $.getQueryParameters();
    var terms = params.highlight ? params.highlight[0].split(/\s+/) : [];
    if (terms.length) {
      var body = $('div.body');
      if (!body.length) {
        body = $('body');
      }
      window.setTimeout(function () {
        $.each(terms, function () {
          body.highlightText(this.toLowerCase(), 'highlighted');
        });
      }, 10);
      $('<p class="highlight-link"><a href="javascript:Documentation.' + 'hideSearchWords()">' + _('Hide Search Matches') + '</a></p>').appendTo($('#searchbox'));
    }
  },
  /**
   * init the domain index toggle buttons
   */
  initIndexTable: function initIndexTable() {
    var togglers = $('img.toggler').click(function () {
      var src = $(this).attr('src');
      var idnum = $(this).attr('id').substr(7);
      $('tr.cg-' + idnum).toggle();
      if (src.substr(-9) === 'minus.png') $(this).attr('src', src.substr(0, src.length - 9) + 'plus.png');else $(this).attr('src', src.substr(0, src.length - 8) + 'minus.png');
    }).css('display', '');
    if (DOCUMENTATION_OPTIONS.COLLAPSE_INDEX) {
      togglers.click();
    }
  },
  /**
   * helper function to hide the search marks again
   */
  hideSearchWords: function hideSearchWords() {
    $('#searchbox .highlight-link').fadeOut(300);
    $('span.highlighted').removeClass('highlighted');
  },
  /**
   * make the url absolute
   */
  makeURL: function makeURL(relativeURL) {
    return DOCUMENTATION_OPTIONS.URL_ROOT + '/' + relativeURL;
  },
  /**
   * get the current relative url
   */
  getCurrentURL: function getCurrentURL() {
    var path = document.location.pathname;
    var parts = path.split(/\//);
    $.each(DOCUMENTATION_OPTIONS.URL_ROOT.split(/\//), function () {
      if (this === '..') parts.pop();
    });
    var url = parts.join('/');
    return path.substring(url.lastIndexOf('/') + 1, path.length - 1);
  },
  initOnKeyListeners: function initOnKeyListeners() {
    $(document).keyup(function (event) {
      var activeElementType = document.activeElement.tagName;
      // don't navigate when in search box or textarea
      if (activeElementType !== 'TEXTAREA' && activeElementType !== 'INPUT' && activeElementType !== 'SELECT') {
        switch (event.keyCode) {
          case 37:
            // left
            var prevHref = $('link[rel="prev"]').prop('href');
            if (prevHref) {
              window.location.href = prevHref;
              return false;
            }
          case 39:
            // right
            var nextHref = $('link[rel="next"]').prop('href');
            if (nextHref) {
              window.location.href = nextHref;
              return false;
            }
        }
      }
    });
  }
};

// quick alias for translations
_ = Documentation.gettext;
$(document).ready(function () {
  Documentation.init();
});

/***/ }),

/***/ "./modules/backend/src/frontend/docs/js/jquery.js":
/*!********************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/jquery.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var __webpack_provided_window_dot_jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
window.$ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
window.$ = __webpack_provided_window_dot_jQuery = jQuery = $;

/***/ }),

/***/ "./modules/backend/src/frontend/docs/js/prism.js":
/*!*******************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/prism.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* PrismJS 1.18.0
https://prismjs.com/download.html#themes=prism-coy&languages=markup+css+clike+javascript+java+json+scala+sql */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
  Prism = function (u) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      C = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function encode(e) {
            return e instanceof _ ? new _(e.type, C.util.encode(e.content), e.alias) : Array.isArray(e) ? e.map(C.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          type: function type(e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function objId(e) {
            return e.__id || Object.defineProperty(e, "__id", {
              value: ++n
            }), e.__id;
          },
          clone: function r(e, t) {
            var a,
              n,
              i = C.util.type(e);
            switch (t = t || {}, i) {
              case "Object":
                if (n = C.util.objId(e), t[n]) return t[n];
                for (var o in a = {}, t[n] = a, e) e.hasOwnProperty(o) && (a[o] = r(e[o], t));
                return a;
              case "Array":
                return n = C.util.objId(e), t[n] ? t[n] : (a = [], t[n] = a, e.forEach(function (e, n) {
                  a[n] = r(e, t);
                }), a);
              default:
                return e;
            }
          },
          getLanguage: function getLanguage(e) {
            for (; e && !c.test(e.className);) e = e.parentElement;
            return e ? (e.className.match(c) || [, "none"])[1].toLowerCase() : "none";
          },
          currentScript: function currentScript() {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];
              if (n) {
                var r = document.getElementsByTagName("script");
                for (var t in r) if (r[t].src == n) return r[t];
              }
              return null;
            }
          }
        },
        languages: {
          extend: function extend(e, n) {
            var r = C.util.clone(C.languages[e]);
            for (var t in n) r[t] = n[t];
            return r;
          },
          insertBefore: function insertBefore(r, e, n, t) {
            var a = (t = t || C.languages)[r],
              i = {};
            for (var o in a) if (a.hasOwnProperty(o)) {
              if (o == e) for (var l in n) n.hasOwnProperty(l) && (i[l] = n[l]);
              n.hasOwnProperty(o) || (i[o] = a[o]);
            }
            var s = t[r];
            return t[r] = i, C.languages.DFS(C.languages, function (e, n) {
              n === s && e != r && (this[e] = i);
            }), i;
          },
          DFS: function e(n, r, t, a) {
            a = a || {};
            var i = C.util.objId;
            for (var o in n) if (n.hasOwnProperty(o)) {
              r.call(n, o, n[o], t || o);
              var l = n[o],
                s = C.util.type(l);
              "Object" !== s || a[i(l)] ? "Array" !== s || a[i(l)] || (a[i(l)] = !0, e(l, r, o, a)) : (a[i(l)] = !0, e(l, r, null, a));
            }
          }
        },
        plugins: {},
        highlightAll: function highlightAll(e, n) {
          C.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function highlightAllUnder(e, n, r) {
          var t = {
            callback: r,
            container: e,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          C.hooks.run("before-highlightall", t), t.elements = Array.prototype.slice.apply(t.container.querySelectorAll(t.selector)), C.hooks.run("before-all-elements-highlight", t);
          for (var a, i = 0; a = t.elements[i++];) C.highlightElement(a, !0 === n, t.callback);
        },
        highlightElement: function highlightElement(e, n, r) {
          var t = C.util.getLanguage(e),
            a = C.languages[t];
          e.className = e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + t;
          var i = e.parentNode;
          i && "pre" === i.nodeName.toLowerCase() && (i.className = i.className.replace(c, "").replace(/\s+/g, " ") + " language-" + t);
          var o = {
            element: e,
            language: t,
            grammar: a,
            code: e.textContent
          };
          function l(e) {
            o.highlightedCode = e, C.hooks.run("before-insert", o), o.element.innerHTML = o.highlightedCode, C.hooks.run("after-highlight", o), C.hooks.run("complete", o), r && r.call(o.element);
          }
          if (C.hooks.run("before-sanity-check", o), !o.code) return C.hooks.run("complete", o), void (r && r.call(o.element));
          if (C.hooks.run("before-highlight", o), o.grammar) {
            if (n && u.Worker) {
              var s = new Worker(C.filename);
              s.onmessage = function (e) {
                l(e.data);
              }, s.postMessage(JSON.stringify({
                language: o.language,
                code: o.code,
                immediateClose: !0
              }));
            } else l(C.highlight(o.code, o.grammar, o.language));
          } else l(C.util.encode(o.code));
        },
        highlight: function highlight(e, n, r) {
          var t = {
            code: e,
            grammar: n,
            language: r
          };
          return C.hooks.run("before-tokenize", t), t.tokens = C.tokenize(t.code, t.grammar), C.hooks.run("after-tokenize", t), _.stringify(C.util.encode(t.tokens), t.language);
        },
        matchGrammar: function matchGrammar(e, n, r, t, a, i, o) {
          for (var l in r) if (r.hasOwnProperty(l) && r[l]) {
            var s = r[l];
            s = Array.isArray(s) ? s : [s];
            for (var u = 0; u < s.length; ++u) {
              if (o && o == l + "," + u) return;
              var c = s[u],
                g = c.inside,
                f = !!c.lookbehind,
                h = !!c.greedy,
                d = 0,
                m = c.alias;
              if (h && !c.pattern.global) {
                var p = c.pattern.toString().match(/[imsuy]*$/)[0];
                c.pattern = RegExp(c.pattern.source, p + "g");
              }
              c = c.pattern || c;
              for (var y = t, v = a; y < n.length; v += n[y].length, ++y) {
                var k = n[y];
                if (n.length > e.length) return;
                if (!(k instanceof _)) {
                  if (h && y != n.length - 1) {
                    if (c.lastIndex = v, !(O = c.exec(e))) break;
                    for (var b = O.index + (f && O[1] ? O[1].length : 0), w = O.index + O[0].length, A = y, P = v, x = n.length; A < x && (P < w || !n[A].type && !n[A - 1].greedy); ++A) (P += n[A].length) <= b && (++y, v = P);
                    if (n[y] instanceof _) continue;
                    S = A - y, k = e.slice(v, P), O.index -= v;
                  } else {
                    c.lastIndex = 0;
                    var O = c.exec(k),
                      S = 1;
                  }
                  if (O) {
                    f && (d = O[1] ? O[1].length : 0);
                    w = (b = O.index + d) + (O = O[0].slice(d)).length;
                    var j = k.slice(0, b),
                      N = k.slice(w),
                      E = [y, S];
                    j && (++y, v += j.length, E.push(j));
                    var L = new _(l, g ? C.tokenize(O, g) : O, m, O, h);
                    if (E.push(L), N && E.push(N), Array.prototype.splice.apply(n, E), 1 != S && C.matchGrammar(e, n, r, y, v, !0, l + "," + u), i) break;
                  } else if (i) break;
                }
              }
            }
          }
        },
        tokenize: function tokenize(e, n) {
          var r = [e],
            t = n.rest;
          if (t) {
            for (var a in t) n[a] = t[a];
            delete n.rest;
          }
          return C.matchGrammar(e, r, n, 0, 0, !1), r;
        },
        hooks: {
          all: {},
          add: function add(e, n) {
            var r = C.hooks.all;
            r[e] = r[e] || [], r[e].push(n);
          },
          run: function run(e, n) {
            var r = C.hooks.all[e];
            if (r && r.length) for (var t, a = 0; t = r[a++];) t(n);
          }
        },
        Token: _
      };
    function _(e, n, r, t, a) {
      this.type = e, this.content = n, this.alias = r, this.length = 0 | (t || "").length, this.greedy = !!a;
    }
    if (u.Prism = C, _.stringify = function (e, n) {
      if ("string" == typeof e) return e;
      if (Array.isArray(e)) return e.map(function (e) {
        return _.stringify(e, n);
      }).join("");
      var r = {
        type: e.type,
        content: _.stringify(e.content, n),
        tag: "span",
        classes: ["token", e.type],
        attributes: {},
        language: n
      };
      if (e.alias) {
        var t = Array.isArray(e.alias) ? e.alias : [e.alias];
        Array.prototype.push.apply(r.classes, t);
      }
      C.hooks.run("wrap", r);
      var a = Object.keys(r.attributes).map(function (e) {
        return e + '="' + (r.attributes[e] || "").replace(/"/g, "&quot;") + '"';
      }).join(" ");
      return "<" + r.tag + ' class="' + r.classes.join(" ") + '"' + (a ? " " + a : "") + ">" + r.content + "</" + r.tag + ">";
    }, !u.document) return u.addEventListener && (C.disableWorkerMessageHandler || u.addEventListener("message", function (e) {
      var n = JSON.parse(e.data),
        r = n.language,
        t = n.code,
        a = n.immediateClose;
      u.postMessage(C.highlight(t, C.languages[r], r)), a && u.close();
    }, !1)), C;
    var e = C.util.currentScript();
    if (e && (C.filename = e.src, e.hasAttribute("data-manual") && (C.manual = !0)), !C.manual) {
      var r = function r() {
        C.manual || C.highlightAll();
      };
      var t = document.readyState;
      "loading" === t || "interactive" === t && e && e.defer ? document.addEventListener("DOMContentLoaded", r) : window.requestAnimationFrame ? window.requestAnimationFrame(r) : window.setTimeout(r, 16);
    }
    return C;
  }(_self);
 true && module.exports && (module.exports = Prism), "undefined" != typeof __webpack_require__.g && (__webpack_require__.g.Prism = Prism);
Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
    greedy: !0
  },
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          punctuation: [/^=/, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: !0
          }]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: /&#?[\da-z]{1,8};/i
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function (a) {
  "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"));
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  value: function value(a, e) {
    var s = {};
    s["language-" + e] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[e]
    }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
    var n = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: s
      }
    };
    n["language-" + e] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[e]
    };
    var t = {};
    t[a] = {
      pattern: RegExp("(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(/__/g, a), "i"),
      lookbehind: !0,
      greedy: !0,
      inside: n
    }, Prism.languages.insertBefore("markup", "cdata", t);
  }
}), Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup;
!function (s) {
  var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
      inside: {
        rule: /@[\w-]+/
      }
    },
    url: {
      pattern: RegExp("url\\((?:" + t.source + "|[^\n\r()]*)\\)", "i"),
      inside: {
        "function": /^url/i,
        punctuation: /^\(|\)$/
      }
    },
    selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
    string: {
      pattern: t,
      greedy: !0
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    "function": /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/
  }, s.languages.css.atrule.inside.rest = s.languages.css;
  var e = s.languages.markup;
  e && (e.tag.addInlined("style", "css"), s.languages.insertBefore("inside", "attr-value", {
    "style-attr": {
      pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
      inside: {
        "attr-name": {
          pattern: /^\s*style/i,
          inside: e.tag.inside
        },
        punctuation: /^\s*=\s*['"]|['"]\s*$/,
        "attr-value": {
          pattern: /.+/i,
          inside: s.languages.css
        }
      },
      alias: "language-css"
    }
  }, e.tag));
}(Prism);
Prism.languages.clike = {
  comment: [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: !0
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: !0,
    greedy: !0
  }],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  "boolean": /\b(?:true|false)\b/,
  "function": /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [Prism.languages.clike["class-name"], {
    pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
    lookbehind: !0
  }],
  keyword: [{
    pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    lookbehind: !0
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: !0
  }],
  number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  "function": /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    lookbehind: !0,
    greedy: !0
  },
  "function-variable": {
    pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    alias: "function"
  },
  parameter: [{
    pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
  "template-string": {
    pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\${|}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  }
}), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript;
!function (e) {
  var t = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    a = /\b[A-Z](?:\w*[a-z]\w*)?\b/;
  e.languages.java = e.languages.extend("clike", {
    "class-name": [a, /\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/],
    keyword: t,
    "function": [e.languages.clike["function"], {
      pattern: /(\:\:)[a-z_]\w*/,
      lookbehind: !0
    }],
    number: /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0
    }
  }), e.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: !0,
      alias: "string"
    }
  }), e.languages.insertBefore("java", "class-name", {
    annotation: {
      alias: "punctuation",
      pattern: /(^|[^.])@\w+/,
      lookbehind: !0
    },
    namespace: {
      pattern: /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)[a-z]\w*(?:\.[a-z]\w*)+/,
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    },
    generics: {
      pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
      inside: {
        "class-name": a,
        keyword: t,
        punctuation: /[<>(),.:]/,
        operator: /[?&|]/
      }
    }
  });
}(Prism);
Prism.languages.json = {
  property: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    greedy: !0
  },
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    greedy: !0
  },
  comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
  number: /-?\d+\.?\d*(?:e[+-]?\d+)?/i,
  punctuation: /[{}[\],]/,
  operator: /:/,
  "boolean": /\b(?:true|false)\b/,
  "null": {
    pattern: /\bnull\b/,
    alias: "keyword"
  }
};
Prism.languages.scala = Prism.languages.extend("java", {
  keyword: /<-|=>|\b(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|self|super|this|throw|trait|try|type|val|var|while|with|yield)\b/,
  "triple-quoted-string": {
    pattern: /"""[\s\S]*?"""/,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  builtin: /\b(?:String|Int|Long|Short|Byte|Boolean|Double|Float|Char|Any|AnyRef|AnyVal|Unit|Nothing)\b/,
  number: /\b0x[\da-f]*\.?[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e\d+)?[dfl]?/i,
  symbol: /'[^\d\s\\]\w*/
}), delete Prism.languages.scala["class-name"], delete Prism.languages.scala["function"];
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: !0
  },
  variable: [{
    pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    greedy: !0
  }, /@[\w.$]+/],
  string: {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: !0,
    lookbehind: !0
  },
  "function": /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  "boolean": /\b(?:TRUE|FALSE|NULL)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
  operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/
};

/***/ }),

/***/ "./modules/backend/src/frontend/docs/js/readthedocs-data.js":
/*!******************************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/readthedocs-data.js ***!
  \******************************************************************/
/***/ (() => {

var READTHEDOCS_DATA = {
  project: "bootstrap-datepicker",
  version: "latest",
  language: "en",
  programming_language: "js",
  subprojects: {},
  canonical_url: "https://bootstrap-datepicker.readthedocs.io/en/latest/",
  theme: "sphinx_rtd_theme",
  builder: "sphinx",
  docroot: "/docs/",
  source_suffix: ".rst",
  api_host: "https://readthedocs.org",
  commit: "9252578f",
  ad_free: false,
  global_analytics_code: 'UA-17997319-1',
  user_analytics_code: 'UA-77474606-2'
};

/***/ }),

/***/ "./modules/backend/src/frontend/docs/js/theme.js":
/*!*******************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/theme.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var __webpack_provided_window_dot_jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var require;/* sphinx_rtd_theme version 0.4.2 | MIT license */
/* Built 20181005 13:10 */
require = function r(s, a, l) {
  function c(e, n) {
    if (!a[e]) {
      if (!s[e]) {
        var i = undefined;
        if (!n && i) return require(e, !0);
        if (u) return u(e, !0);
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t;
      }
      var o = a[e] = {
        exports: {}
      };
      s[e][0].call(o.exports, function (n) {
        return c(s[e][1][n] || n);
      }, o, o.exports, r, s, a, l);
    }
    return a[e].exports;
  }
  for (var u = undefined, n = 0; n < l.length; n++) c(l[n]);
  return c;
}({
  "sphinx-rtd-theme": [function (n, e, i) {
    var jQuery = "undefined" != typeof window ? __webpack_provided_window_dot_jQuery : n("jquery");
    e.exports.ThemeNav = {
      navBar: null,
      win: null,
      winScroll: !1,
      winResize: !1,
      linkScroll: !1,
      winPosition: 0,
      winHeight: null,
      docHeight: null,
      isRunning: !1,
      enable: function enable(e) {
        var i = this;
        void 0 === e && (e = !0), i.isRunning || (i.isRunning = !0, jQuery(function (n) {
          i.init(n), i.reset(), i.win.on("hashchange", i.reset), e && i.win.on("scroll", function () {
            i.linkScroll || i.winScroll || (i.winScroll = !0, requestAnimationFrame(function () {
              i.onScroll();
            }));
          }), i.win.on("resize", function () {
            i.winResize || (i.winResize = !0, requestAnimationFrame(function () {
              i.onResize();
            }));
          }), i.onResize();
        }));
      },
      enableSticky: function enableSticky() {
        this.enable(!0);
      },
      init: function init(i) {
        i(document);
        var t = this;
        this.navBar = i("div.wy-side-scroll:first"), this.win = i(window), i(document).on("click", "[data-toggle='wy-nav-top']", function () {
          i("[data-toggle='wy-nav-shift']").toggleClass("shift"), i("[data-toggle='rst-versions']").toggleClass("shift");
        }).on("click", ".wy-menu-vertical .current ul li a", function () {
          var n = i(this);
          i("[data-toggle='wy-nav-shift']").removeClass("shift"), i("[data-toggle='rst-versions']").toggleClass("shift"), t.toggleCurrent(n), t.hashChange();
        }).on("click", "[data-toggle='rst-current-version']", function () {
          i("[data-toggle='rst-versions']").toggleClass("shift-up");
        }), i("table.docutils:not(.field-list,.footnote,.citation)").wrap("<div class='wy-table-responsive'></div>"), i("table.docutils.footnote").wrap("<div class='wy-table-responsive footnote'></div>"), i("table.docutils.citation").wrap("<div class='wy-table-responsive citation'></div>"), i(".wy-menu-vertical ul").not(".simple").siblings("a").each(function () {
          var e = i(this);
          expand = i('<span class="toctree-expand"></span>'), expand.on("click", function (n) {
            return t.toggleCurrent(e), n.stopPropagation(), !1;
          }), e.prepend(expand);
        });
      },
      reset: function reset() {
        var n = encodeURI(window.location.hash) || "#";
        try {
          var e = $(".wy-menu-vertical"),
            i = e.find('[href="' + n + '"]');
          if (0 === i.length) {
            var t = $('.document [id="' + n.substring(1) + '"]').closest("div.section");
            0 === (i = e.find('[href="#' + t.attr("id") + '"]')).length && (i = e.find('[href="#"]'));
          }
          0 < i.length && ($(".wy-menu-vertical .current").removeClass("current"), i.addClass("current"), i.closest("li.toctree-l1").addClass("current"), i.closest("li.toctree-l1").parent().addClass("current"), i.closest("li.toctree-l1").addClass("current"), i.closest("li.toctree-l2").addClass("current"), i.closest("li.toctree-l3").addClass("current"), i.closest("li.toctree-l4").addClass("current"));
        } catch (o) {
          console.log("Error expanding nav for anchor", o);
        }
      },
      onScroll: function onScroll() {
        this.winScroll = !1;
        var n = this.win.scrollTop(),
          e = n + this.winHeight,
          i = this.navBar.scrollTop() + (n - this.winPosition);
        n < 0 || e > this.docHeight || (this.navBar.scrollTop(i), this.winPosition = n);
      },
      onResize: function onResize() {
        this.winResize = !1, this.winHeight = this.win.height(), this.docHeight = $(document).height();
      },
      hashChange: function hashChange() {
        this.linkScroll = !0, this.win.one("hashchange", function () {
          this.linkScroll = !1;
        });
      },
      toggleCurrent: function toggleCurrent(n) {
        var e = n.closest("li");
        e.siblings("li.current").removeClass("current"), e.siblings().find("li.current").removeClass("current"), e.find("> ul li.current").removeClass("current"), e.toggleClass("current");
      }
    }, "undefined" != typeof window && (window.SphinxRtdTheme = {
      Navigation: e.exports.ThemeNav,
      StickyNav: e.exports.ThemeNav
    }), function () {
      for (var r = 0, n = ["ms", "moz", "webkit", "o"], e = 0; e < n.length && !window.requestAnimationFrame; ++e) window.requestAnimationFrame = window[n[e] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n[e] + "CancelAnimationFrame"] || window[n[e] + "CancelRequestAnimationFrame"];
      window.requestAnimationFrame || (window.requestAnimationFrame = function (n, e) {
        var i = new Date().getTime(),
          t = Math.max(0, 16 - (i - r)),
          o = window.setTimeout(function () {
            n(i + t);
          }, t);
        return r = i + t, o;
      }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (n) {
        clearTimeout(n);
      });
    }();
  }, {
    jquery: "jquery"
  }]
}, {}, ["sphinx-rtd-theme"]);

/***/ }),

/***/ "./modules/backend/src/frontend/docs/js/underscore.js":
/*!************************************************************!*\
  !*** ./modules/backend/src/frontend/docs/js/underscore.js ***!
  \************************************************************/
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
// Underscore.js 1.3.1
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function () {
  function q(a, c, d) {
    if (a === c) return a !== 0 || 1 / a == 1 / c;
    if (a == null || c == null) return a === c;
    if (a._chain) a = a._wrapped;
    if (c._chain) c = c._wrapped;
    if (a.isEqual && b.isFunction(a.isEqual)) return a.isEqual(c);
    if (c.isEqual && b.isFunction(c.isEqual)) return c.isEqual(a);
    var e = l.call(a);
    if (e != l.call(c)) return false;
    switch (e) {
      case "[object String]":
        return a == String(c);
      case "[object Number]":
        return a != +a ? c != +c : a == 0 ? 1 / a == 1 / c : a == +c;
      case "[object Date]":
      case "[object Boolean]":
        return +a == +c;
      case "[object RegExp]":
        return a.source == c.source && a.global == c.global && a.multiline == c.multiline && a.ignoreCase == c.ignoreCase;
    }
    if (_typeof(a) != "object" || _typeof(c) != "object") return false;
    for (var f = d.length; f--;) if (d[f] == a) return true;
    d.push(a);
    var f = 0,
      g = true;
    if (e == "[object Array]") {
      if (f = a.length, g = f == c.length) for (; f--;) if (!(g = f in a == f in c && q(a[f], c[f], d))) break;
    } else {
      if ("constructor" in a != "constructor" in c || a.constructor != c.constructor) return false;
      for (var h in a) if (b.has(a, h) && (f++, !(g = b.has(c, h) && q(a[h], c[h], d)))) break;
      if (g) {
        for (h in c) if (b.has(c, h) && !f--) break;
        g = !f;
      }
    }
    d.pop();
    return g;
  }
  var r = this,
    G = r._,
    n = {},
    k = Array.prototype,
    o = Object.prototype,
    i = k.slice,
    H = k.unshift,
    l = o.toString,
    I = o.hasOwnProperty,
    w = k.forEach,
    x = k.map,
    y = k.reduce,
    z = k.reduceRight,
    A = k.filter,
    B = k.every,
    C = k.some,
    p = k.indexOf,
    D = k.lastIndexOf,
    o = Array.isArray,
    J = Object.keys,
    s = Function.prototype.bind,
    b = function b(a) {
      return new m(a);
    };
  if (true) {
    if ( true && module.exports) exports = module.exports = b;
    exports._ = b;
  } else // removed by dead control flow
{}
  b.VERSION = "1.3.1";
  var j = b.each = b.forEach = function (a, c, d) {
    if (a != null) if (w && a.forEach === w) a.forEach(c, d);else if (a.length === +a.length) for (var e = 0, f = a.length; e < f; e++) {
      if (e in a && c.call(d, a[e], e, a) === n) break;
    } else for (e in a) if (b.has(a, e) && c.call(d, a[e], e, a) === n) break;
  };
  b.map = b.collect = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    if (x && a.map === x) return a.map(c, b);
    j(a, function (a, g, h) {
      e[e.length] = c.call(b, a, g, h);
    });
    if (a.length === +a.length) e.length = a.length;
    return e;
  };
  b.reduce = b.foldl = b.inject = function (a, c, d, e) {
    var f = arguments.length > 2;
    a == null && (a = []);
    if (y && a.reduce === y) return e && (c = b.bind(c, e)), f ? a.reduce(c, d) : a.reduce(c);
    j(a, function (a, b, i) {
      f ? d = c.call(e, d, a, b, i) : (d = a, f = true);
    });
    if (!f) throw new TypeError("Reduce of empty array with no initial value");
    return d;
  };
  b.reduceRight = b.foldr = function (a, c, d, e) {
    var f = arguments.length > 2;
    a == null && (a = []);
    if (z && a.reduceRight === z) return e && (c = b.bind(c, e)), f ? a.reduceRight(c, d) : a.reduceRight(c);
    var g = b.toArray(a).reverse();
    e && !f && (c = b.bind(c, e));
    return f ? b.reduce(g, c, d, e) : b.reduce(g, c);
  };
  b.find = b.detect = function (a, c, b) {
    var e;
    E(a, function (a, g, h) {
      if (c.call(b, a, g, h)) return e = a, true;
    });
    return e;
  };
  b.filter = b.select = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    if (A && a.filter === A) return a.filter(c, b);
    j(a, function (a, g, h) {
      c.call(b, a, g, h) && (e[e.length] = a);
    });
    return e;
  };
  b.reject = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    j(a, function (a, g, h) {
      c.call(b, a, g, h) || (e[e.length] = a);
    });
    return e;
  };
  b.every = b.all = function (a, c, b) {
    var e = true;
    if (a == null) return e;
    if (B && a.every === B) return a.every(c, b);
    j(a, function (a, g, h) {
      if (!(e = e && c.call(b, a, g, h))) return n;
    });
    return e;
  };
  var E = b.some = b.any = function (a, c, d) {
    c || (c = b.identity);
    var e = false;
    if (a == null) return e;
    if (C && a.some === C) return a.some(c, d);
    j(a, function (a, b, h) {
      if (e || (e = c.call(d, a, b, h))) return n;
    });
    return !!e;
  };
  b.include = b.contains = function (a, c) {
    var b = false;
    if (a == null) return b;
    return p && a.indexOf === p ? a.indexOf(c) != -1 : b = E(a, function (a) {
      return a === c;
    });
  };
  b.invoke = function (a, c) {
    var d = i.call(arguments, 2);
    return b.map(a, function (a) {
      return (b.isFunction(c) ? c || a : a[c]).apply(a, d);
    });
  };
  b.pluck = function (a, c) {
    return b.map(a, function (a) {
      return a[c];
    });
  };
  b.max = function (a, c, d) {
    if (!c && b.isArray(a)) return Math.max.apply(Math, a);
    if (!c && b.isEmpty(a)) return -Infinity;
    var e = {
      computed: -Infinity
    };
    j(a, function (a, b, h) {
      b = c ? c.call(d, a, b, h) : a;
      b >= e.computed && (e = {
        value: a,
        computed: b
      });
    });
    return e.value;
  };
  b.min = function (a, c, d) {
    if (!c && b.isArray(a)) return Math.min.apply(Math, a);
    if (!c && b.isEmpty(a)) return Infinity;
    var e = {
      computed: Infinity
    };
    j(a, function (a, b, h) {
      b = c ? c.call(d, a, b, h) : a;
      b < e.computed && (e = {
        value: a,
        computed: b
      });
    });
    return e.value;
  };
  b.shuffle = function (a) {
    var b = [],
      d;
    j(a, function (a, f) {
      f == 0 ? b[0] = a : (d = Math.floor(Math.random() * (f + 1)), b[f] = b[d], b[d] = a);
    });
    return b;
  };
  b.sortBy = function (a, c, d) {
    return b.pluck(b.map(a, function (a, b, g) {
      return {
        value: a,
        criteria: c.call(d, a, b, g)
      };
    }).sort(function (a, b) {
      var c = a.criteria,
        d = b.criteria;
      return c < d ? -1 : c > d ? 1 : 0;
    }), "value");
  };
  b.groupBy = function (a, c) {
    var d = {},
      e = b.isFunction(c) ? c : function (a) {
        return a[c];
      };
    j(a, function (a, b) {
      var c = e(a, b);
      (d[c] || (d[c] = [])).push(a);
    });
    return d;
  };
  b.sortedIndex = function (a, c, d) {
    d || (d = b.identity);
    for (var e = 0, f = a.length; e < f;) {
      var g = e + f >> 1;
      d(a[g]) < d(c) ? e = g + 1 : f = g;
    }
    return e;
  };
  b.toArray = function (a) {
    return !a ? [] : a.toArray ? a.toArray() : b.isArray(a) ? i.call(a) : b.isArguments(a) ? i.call(a) : b.values(a);
  };
  b.size = function (a) {
    return b.toArray(a).length;
  };
  b.first = b.head = function (a, b, d) {
    return b != null && !d ? i.call(a, 0, b) : a[0];
  };
  b.initial = function (a, b, d) {
    return i.call(a, 0, a.length - (b == null || d ? 1 : b));
  };
  b.last = function (a, b, d) {
    return b != null && !d ? i.call(a, Math.max(a.length - b, 0)) : a[a.length - 1];
  };
  b.rest = b.tail = function (a, b, d) {
    return i.call(a, b == null || d ? 1 : b);
  };
  b.compact = function (a) {
    return b.filter(a, function (a) {
      return !!a;
    });
  };
  b.flatten = function (a, c) {
    return b.reduce(a, function (a, e) {
      if (b.isArray(e)) return a.concat(c ? e : b.flatten(e));
      a[a.length] = e;
      return a;
    }, []);
  };
  b.without = function (a) {
    return b.difference(a, i.call(arguments, 1));
  };
  b.uniq = b.unique = function (a, c, d) {
    var d = d ? b.map(a, d) : a,
      e = [];
    b.reduce(d, function (d, g, h) {
      if (0 == h || (c === true ? b.last(d) != g : !b.include(d, g))) d[d.length] = g, e[e.length] = a[h];
      return d;
    }, []);
    return e;
  };
  b.union = function () {
    return b.uniq(b.flatten(arguments, true));
  };
  b.intersection = b.intersect = function (a) {
    var c = i.call(arguments, 1);
    return b.filter(b.uniq(a), function (a) {
      return b.every(c, function (c) {
        return b.indexOf(c, a) >= 0;
      });
    });
  };
  b.difference = function (a) {
    var c = b.flatten(i.call(arguments, 1));
    return b.filter(a, function (a) {
      return !b.include(c, a);
    });
  };
  b.zip = function () {
    for (var a = i.call(arguments), c = b.max(b.pluck(a, "length")), d = Array(c), e = 0; e < c; e++) d[e] = b.pluck(a, "" + e);
    return d;
  };
  b.indexOf = function (a, c, d) {
    if (a == null) return -1;
    var e;
    if (d) return d = b.sortedIndex(a, c), a[d] === c ? d : -1;
    if (p && a.indexOf === p) return a.indexOf(c);
    for (d = 0, e = a.length; d < e; d++) if (d in a && a[d] === c) return d;
    return -1;
  };
  b.lastIndexOf = function (a, b) {
    if (a == null) return -1;
    if (D && a.lastIndexOf === D) return a.lastIndexOf(b);
    for (var d = a.length; d--;) if (d in a && a[d] === b) return d;
    return -1;
  };
  b.range = function (a, b, d) {
    arguments.length <= 1 && (b = a || 0, a = 0);
    for (var d = arguments[2] || 1, e = Math.max(Math.ceil((b - a) / d), 0), f = 0, g = Array(e); f < e;) g[f++] = a, a += d;
    return g;
  };
  var F = function F() {};
  b.bind = function (a, c) {
    var _d, e;
    if (a.bind === s && s) return s.apply(a, i.call(arguments, 1));
    if (!b.isFunction(a)) throw new TypeError();
    e = i.call(arguments, 2);
    return _d = function d() {
      if (!(this instanceof _d)) return a.apply(c, e.concat(i.call(arguments)));
      F.prototype = a.prototype;
      var b = new F(),
        g = a.apply(b, e.concat(i.call(arguments)));
      return Object(g) === g ? g : b;
    };
  };
  b.bindAll = function (a) {
    var c = i.call(arguments, 1);
    c.length == 0 && (c = b.functions(a));
    j(c, function (c) {
      a[c] = b.bind(a[c], a);
    });
    return a;
  };
  b.memoize = function (a, c) {
    var d = {};
    c || (c = b.identity);
    return function () {
      var e = c.apply(this, arguments);
      return b.has(d, e) ? d[e] : d[e] = a.apply(this, arguments);
    };
  };
  b.delay = function (a, b) {
    var d = i.call(arguments, 2);
    return setTimeout(function () {
      return a.apply(a, d);
    }, b);
  };
  b.defer = function (a) {
    return b.delay.apply(b, [a, 1].concat(i.call(arguments, 1)));
  };
  b.throttle = function (a, c) {
    var d,
      e,
      f,
      g,
      h,
      i = b.debounce(function () {
        h = g = false;
      }, c);
    return function () {
      d = this;
      e = arguments;
      var b;
      f || (f = setTimeout(function () {
        f = null;
        h && a.apply(d, e);
        i();
      }, c));
      g ? h = true : a.apply(d, e);
      i();
      g = true;
    };
  };
  b.debounce = function (a, b) {
    var d;
    return function () {
      var e = this,
        f = arguments;
      clearTimeout(d);
      d = setTimeout(function () {
        d = null;
        a.apply(e, f);
      }, b);
    };
  };
  b.once = function (a) {
    var b = false,
      d;
    return function () {
      if (b) return d;
      b = true;
      return d = a.apply(this, arguments);
    };
  };
  b.wrap = function (a, b) {
    return function () {
      var d = [a].concat(i.call(arguments, 0));
      return b.apply(this, d);
    };
  };
  b.compose = function () {
    var a = arguments;
    return function () {
      for (var b = arguments, d = a.length - 1; d >= 0; d--) b = [a[d].apply(this, b)];
      return b[0];
    };
  };
  b.after = function (a, b) {
    return a <= 0 ? b() : function () {
      if (--a < 1) return b.apply(this, arguments);
    };
  };
  b.keys = J || function (a) {
    if (a !== Object(a)) throw new TypeError("Invalid object");
    var c = [],
      d;
    for (d in a) b.has(a, d) && (c[c.length] = d);
    return c;
  };
  b.values = function (a) {
    return b.map(a, b.identity);
  };
  b.functions = b.methods = function (a) {
    var c = [],
      d;
    for (d in a) b.isFunction(a[d]) && c.push(d);
    return c.sort();
  };
  b.extend = function (a) {
    j(i.call(arguments, 1), function (b) {
      for (var d in b) a[d] = b[d];
    });
    return a;
  };
  b.defaults = function (a) {
    j(i.call(arguments, 1), function (b) {
      for (var d in b) a[d] == null && (a[d] = b[d]);
    });
    return a;
  };
  b.clone = function (a) {
    return !b.isObject(a) ? a : b.isArray(a) ? a.slice() : b.extend({}, a);
  };
  b.tap = function (a, b) {
    b(a);
    return a;
  };
  b.isEqual = function (a, b) {
    return q(a, b, []);
  };
  b.isEmpty = function (a) {
    if (b.isArray(a) || b.isString(a)) return a.length === 0;
    for (var c in a) if (b.has(a, c)) return false;
    return true;
  };
  b.isElement = function (a) {
    return !!(a && a.nodeType == 1);
  };
  b.isArray = o || function (a) {
    return l.call(a) == "[object Array]";
  };
  b.isObject = function (a) {
    return a === Object(a);
  };
  b.isArguments = function (a) {
    return l.call(a) == "[object Arguments]";
  };
  if (!b.isArguments(arguments)) b.isArguments = function (a) {
    return !(!a || !b.has(a, "callee"));
  };
  b.isFunction = function (a) {
    return l.call(a) == "[object Function]";
  };
  b.isString = function (a) {
    return l.call(a) == "[object String]";
  };
  b.isNumber = function (a) {
    return l.call(a) == "[object Number]";
  };
  b.isNaN = function (a) {
    return a !== a;
  };
  b.isBoolean = function (a) {
    return a === true || a === false || l.call(a) == "[object Boolean]";
  };
  b.isDate = function (a) {
    return l.call(a) == "[object Date]";
  };
  b.isRegExp = function (a) {
    return l.call(a) == "[object RegExp]";
  };
  b.isNull = function (a) {
    return a === null;
  };
  b.isUndefined = function (a) {
    return a === void 0;
  };
  b.has = function (a, b) {
    return I.call(a, b);
  };
  b.noConflict = function () {
    r._ = G;
    return this;
  };
  b.identity = function (a) {
    return a;
  };
  b.times = function (a, b, d) {
    for (var e = 0; e < a; e++) b.call(d, e);
  };
  b.escape = function (a) {
    return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
  };
  b.mixin = function (a) {
    j(b.functions(a), function (c) {
      K(c, b[c] = a[c]);
    });
  };
  var L = 0;
  b.uniqueId = function (a) {
    var b = L++;
    return a ? a + b : b;
  };
  b.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };
  var t = /.^/,
    u = function u(a) {
      return a.replace(/\\\\/g, "\\").replace(/\\'/g, "'");
    };
  b.template = function (a, c) {
    var d = b.templateSettings,
      d = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + a.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(d.escape || t, function (a, b) {
        return "',_.escape(" + u(b) + "),'";
      }).replace(d.interpolate || t, function (a, b) {
        return "'," + u(b) + ",'";
      }).replace(d.evaluate || t, function (a, b) {
        return "');" + u(b).replace(/[\r\n\t]/g, " ") + ";__p.push('";
      }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');",
      e = new Function("obj", "_", d);
    return c ? e(c, b) : function (a) {
      return e.call(this, a, b);
    };
  };
  b.chain = function (a) {
    return b(a).chain();
  };
  var m = function m(a) {
    this._wrapped = a;
  };
  b.prototype = m.prototype;
  var v = function v(a, c) {
      return c ? b(a).chain() : a;
    },
    K = function K(a, c) {
      m.prototype[a] = function () {
        var a = i.call(arguments);
        H.call(a, this._wrapped);
        return v(c.apply(b, a), this._chain);
      };
    };
  b.mixin(b);
  j("pop,push,reverse,shift,sort,splice,unshift".split(","), function (a) {
    var b = k[a];
    m.prototype[a] = function () {
      var d = this._wrapped;
      b.apply(d, arguments);
      var e = d.length;
      (a == "shift" || a == "splice") && e === 0 && delete d[0];
      return v(d, this._chain);
    };
  });
  j(["concat", "join", "slice"], function (a) {
    var b = k[a];
    m.prototype[a] = function () {
      return v(b.apply(this._wrapped, arguments), this._chain);
    };
  });
  m.prototype.chain = function () {
    this._chain = true;
    return this;
  };
  m.prototype.value = function () {
    return this._wrapped;
  };
}).call(this);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["/js/vendor"], () => (__webpack_exec__("./modules/backend/src/frontend/docs/js/doctools.js"), __webpack_exec__("./modules/backend/src/frontend/docs/js/jquery.js"), __webpack_exec__("./modules/backend/src/frontend/docs/js/prism.js"), __webpack_exec__("./modules/backend/src/frontend/docs/js/readthedocs-data.js"), __webpack_exec__("./modules/backend/src/frontend/docs/js/theme.js"), __webpack_exec__("./modules/backend/src/frontend/docs/js/underscore.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);