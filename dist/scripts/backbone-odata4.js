'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* global Backbone BackboneOData4 */

window.BackboneOData4 = window.BackboneOData4 || {};

////////////////////////////////////////////////////////////////////////////////

BackboneOData4.Model = Backbone.Model.extend({
  attributeTypes: {},

  set: function set(attrs, opts) {
    if (typeof attrs === 'string') {
      attrs = {};
      attrs[arguments[0]] = arguments[1];
      opts = arguments[2];
    }

    for (var k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] && attrs.hasOwnProperty(k) && attrs[k]) {

        if (typeof this.attributeTypes[k] === 'string') {
          if (_typeof(attrs[k]) !== this.attributeTypes) {
            switch (this.attributeTypes) {
              case 'boolean':
                attrs[k] = new Boolean(attrs[k]).valueOf();
                break;

              case 'number':
                attrs[k] = new Number(attrs[k]).valueOf();
                break;

              case 'string':
                attrs[k] = new String(attrs[k]).valueOf();
                break;
            }
          }
        } else if (typeof this.attributeTypes[k] === 'function') {
          if (!(attrs[k] instanceof this.attributeTypes[k])) {
            attrs[k] = Array.isArray(attrs[k]) ? attrs[k] : [attrs[k]];
            attrs[k] = new (Function.prototype.bind.apply(this.attributeTypes[k], [null].concat(_toConsumableArray(attrs[k]))))();
          }
        }
      }
    }

    return Backbone.Model.prototype.set.call(this, attrs, opts);
  },

  toJSON: function toJSON() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var json = Backbone.Model.prototype.toJSON.call(this, opts);

    if (opts.deep) {
      for (var k in this.attributeTypes) {
        if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] && json.hasOwnProperty(k) && json[k] && typeof this.attributeTypes[k] === 'function' && typeof json[k] !== 'string') {
          if (json[k] instanceof Backbone.Model || json[k] instanceof Backbone.Collection) {
            json[k] = json[k].toJSON(opts);
          } else if (json[k] instanceof Date) {
            json[k] = json[k].toISOString();
          } else if (json[k].toString) {
            json[k] = json[k].toString();
          }
        }
      }
    }

    return json;
  }
});

////////////////////////////////////////////////////////////////////////////////

BackboneOData4.Collection = Backbone.Collection.extend({
  model: BackboneOData4.Model,

  queryOptions: {},

  initialize: function initialize(mods) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.queryOptions = opts.queryOptions || {};
  },

  fetch: function fetch() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts.data = $.extend({}, opts.data, this.queryOptions, { $count: true });
    return Backbone.Collection.prototype.fetch.call(this, opts);
  },

  parse: function parse(resp) {
    return Backbone.Collection.prototype.parse.call(this, resp.value);
  }
});

////////////////////////////////////////////////////////////////////////////////

BackboneOData4.View = Backbone.View.extend({});