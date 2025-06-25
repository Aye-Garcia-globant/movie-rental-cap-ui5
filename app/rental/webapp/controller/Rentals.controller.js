sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("movierental.rental.controller.Rentals", {
      onReturnRental: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var oRental = oContext.getObject();
        var that = this;

        fetch("/odata/v4/movierental/returnRental", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ID: oRental.ID })
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Error al devolver la película");
            // Si la respuesta está vacía (204), no intentes parsear JSON
            if (response.status === 204) return null;
            return response.json();
          })
          .then(function () {
            MessageToast.show("Película devuelta correctamente");
            that.getOwnerComponent().getModel().refresh();
          })
          .catch(function (error) {
            MessageToast.show(error.message || "Error al devolver la película");
          });
      },

  
        onNavToMovies: function () {
          this.getOwnerComponent().getRouter().navTo("RouteMovies");
        }
      });
    }
  );