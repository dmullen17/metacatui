/* global define */
define(['jquery', 'underscore', 'backbone', 'models/filters/Filter'],
    function($, _, Backbone, Filter) {

	var ToggleFilter = Filter.extend({

    type: "ToggleFilter",

    defaults: function(){
      return _.extend(Filter.prototype.defaults(), {
        trueLabel: "On",
        trueValue: null,
        falseLabel: "Off",
        falseValue: null
      });
    },

    /*
    * Parses the ToggleFilter XML node into JSON
    *
    * @param {Element} xml - The XML Element that contains all the ToggleFilter elements
    * @return {JSON} - The JSON object literal to be set on the model
    */
    parse: function(xml){

      var modelJSON = Filter.prototype.parse(xml);

      //Parse the trueLabel and falseLabels
      modelJSON.trueLabel = this.parseTextNode(xml, "trueLabel");
      modelJSON.trueValue = this.parseTextNode(xml, "trueValue");
      modelJSON.falseLabel = this.parseTextNode(xml, "falseLabel");
      modelJSON.falseValue = this.parseTextNode(xml, "falseValue");

      //Delete any attributes from the JSON that don't exist in the XML
      if( !modelJSON.trueLabel ){
        delete modelJSON.trueLabel;
      }
      if( !modelJSON.falseLabel ){
        delete modelJSON.falseLabel;
      }
      if( !modelJSON.falseValue ){
        delete modelJSON.falseValue;
      }


      return modelJSON;
    }

  });

  return ToggleFilter;
});
