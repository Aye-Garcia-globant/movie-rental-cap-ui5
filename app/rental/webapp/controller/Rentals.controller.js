sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast",
    "movierental/rental/util/formatter"],
  function (Controller, MessageToast, formatter) {
    "use strict";
    return Controller.extend("movierental.rental.controller.Rentals", {
      formatter: formatter,
      onReturnRental: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var oRental = oContext.getObject();

        fetch("/odata/v4/movierental/returnRental", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID: oRental.ID }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Error returning the movie");
            if (response.status === 204) return null;
            return response.json();
          })
          .then(() => {
            MessageToast.show("Movie returned successfully");
            this.getOwnerComponent().getModel().refresh();
          })
          .catch((error) => {
            MessageToast.show(error.message || "Error returning the movie");
          });
      },
      
      onImageError: function (oEvent) {
        const oImage = oEvent.getSource();
        const sFallback =
          jQuery.sap.getModulePath("movierental.rental") + "/img/fallback.png";
        // Avoid infinite loop
        if (oImage.getSrc() !== sFallback) {
          oImage.setSrc(sFallback);
        }
      },

      onNavToMovies: function () {
        this.getOwnerComponent().getRouter().navTo("RouteMovies");
      },
    });
  }
);