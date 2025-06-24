sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
    function (Controller, MessageToast) {
      "use strict";
      return Controller.extend("movierental.rental.controller.Rentals", {
        onReturnRental: function (oEvent) {
          var oContext = oEvent.getSource().getBindingContext();
          var oRental = oContext.getObject();
          var oModel = this.getOwnerComponent().getModel();
  
          var oActionContext = oModel.bindContext(
            "/MovierentalService.returnRental(...)",
            undefined,
            { $$groupId: "actionGroup" }
          );
          oActionContext.setParameter("ID", oRental.ID);
  
          oActionContext
            .execute()
            .then(function () {
              MessageToast.show("Returned Movie Successfully");
              oModel.refresh();
            })
            .catch(function (oError) {
              MessageToast.show("Error returning: " + oError.message);
            });
        },
  
        onNavToMovies: function () {
          this.getOwnerComponent().getRouter().navTo("RouteMovies");
        }
      });
    }
  );