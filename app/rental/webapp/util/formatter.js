sap.ui.define([], function () {
    "use strict";
    return {
      stockStatus: function (iStock) {
        return (iStock > 0) ? "In Stock" : "Out of Stock";
      },
      stockState: function (iStock) {
        return (iStock > 0) ? "Success" : "Error";
      },
      posterOrPlaceholder: function (sImg) {
        if (sImg) {
          return sImg;
        } else {
          return jQuery.sap.getModulePath("movierental.rental") + "/img/fallback.png";
        }
      },
        returnedState: function(returned) {
          return (returned === true || returned === "Sí" || returned === "true" || returned === "Yes" ) ? "Success" : "Error";
        }
    };
  });
  
