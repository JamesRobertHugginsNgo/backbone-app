/* global Backbone BackboneOData4 */

window.BackboneOData4 = window.BackboneOData4 || {};

////////////////////////////////////////////////////////////////////////////////

BackboneOData4.Model = Backbone.Model.extend({
  attributeTypes: {},

  set: function(attrs, opts) {
    if (typeof attrs === 'string') {
      attrs = {};
      attrs[arguments[0]] = arguments[1];
      opts = arguments[2];
    }

    for (const k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] && attrs.hasOwnProperty(k) && attrs[k]) {

        if (typeof this.attributeTypes[k] === 'string') {
          if (typeof attrs[k] !== this.attributeTypes) {
            switch(this.attributeTypes) {
              case 'boolean':
              attrs[k] = (new Boolean(attrs[k])).valueOf();
              break;

              case 'number':
              attrs[k] = (new Number(attrs[k])).valueOf();
              break;

              case 'string':
              attrs[k] = (new String(attrs[k])).valueOf();
              break;
            }
          }
        } else if (typeof this.attributeTypes[k] === 'function') {
          if (!(attrs[k] instanceof this.attributeTypes[k])) {
            attrs[k] = Array.isArray(attrs[k]) ? attrs[k] : [attrs[k]];
            attrs[k] = new this.attributeTypes[k](...attrs[k]);
          }
        }
      }
    }

    return Backbone.Model.prototype.set.call(this, attrs, opts);
  },

  toJSON: function(opts = {}) {
    const json = Backbone.Model.prototype.toJSON.call(this, opts);

    if (opts.deep) {
      for (const k in this.attributeTypes) {
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

  initialize: function(mods, opts = {}) {
    this.queryOptions = opts.queryOptions || {};
  },

  fetch: function(opts = {}) {
    opts.data = $.extend({}, opts.data, this.queryOptions, { $count: true });
    return Backbone.Collection.prototype.fetch.call(this, opts);
  },

  parse: function(resp) {
    return Backbone.Collection.prototype.parse.call(this, resp.value);
  }
});

////////////////////////////////////////////////////////////////////////////////

BackboneOData4.View = Backbone.View.extend({});
