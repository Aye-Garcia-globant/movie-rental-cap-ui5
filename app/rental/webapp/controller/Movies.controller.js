sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
  ],
  function (Controller, MessageToast, Dialog, Button, Label, Input) {
    "use strict";

    return Controller.extend("movierental.rental.controller.Movies", {
      onInit: function () {
      },

      onOpenRentalForm: function (oEvent) {
        var oContext = oEvent.getSource().getParent().getBindingContext();
        var oMovie = oContext.getObject();
        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        if (!this._oDialog) {
          this._oDialog = new Dialog({
            title: oResourceBundle.getText("dialogRentTitle"),
            content: [
              new Label({ text: oResourceBundle.getText("labelMovie") }),
              new Input({ value: oMovie.title, editable: false }),
              new Label({ text: oResourceBundle.getText("labelClient") }),
              new Input({
                value: "",
                editable: true,
                liveChange: function (oEvent) {
                  this._customerValue = oEvent.getParameter("value");
                }.bind(this),
              }),
              new Label({ text: oResourceBundle.getText("labelQuantity") }),
              new Input({
                type: "Number",
                value: 1,
                liveChange: function (oEvent) {
                  this._quantityValue = oEvent.getParameter("value");
                }.bind(this),
              }),
            ],
            beginButton: new Button({
              text: oResourceBundle.getText("buttonRent"),
              press: function () {
                var sCustomer = this._customerValue || "";
                var iQuantity = parseInt(this._quantityValue || 1, 10);
              
                if (!sCustomer || isNaN(iQuantity) || iQuantity < 1) {
                  MessageToast.show(oResourceBundle.getText("msgFillFields"));
                  return;
                }

                if (oMovie.stock < iQuantity) {
                  MessageToast.show(oResourceBundle.getText("msgNoStock"));
                  return;
                }
              
                var oModel = this.getOwnerComponent().getModel();
                var oListBinding = oModel.bindList("/Rentals");
                var oContext = oListBinding.create({
                  movie_ID: oMovie.ID,
                  customer: sCustomer,
                  quantity: iQuantity,
                  rentalDate: new Date().toISOString(),
                });
              
                oContext.created()
                  .then(function () {
                    MessageToast.show(oResourceBundle.getText("msgSuccess"));
                    this._oDialog.close();
                    oModel.refresh();
                  }.bind(this))
                  .catch(function (oError) {
                    console.error("Error registering rental:", oError);
                    MessageToast.show(oResourceBundle.getText("msgError") + oError.message);
                  });
              }.bind(this),
            }),
            endButton: new Button({
              text: oResourceBundle.getText("buttonCancel"),
              press: function () {
                this._oDialog.close();
              }.bind(this),
            }),
            afterClose: function () {
              this._oDialog.destroy();
              this._oDialog = null;
            }.bind(this),
          });
        }
        this._oDialog.open();
      },
      onNavToRentals: function () {
        this.getOwnerComponent().getRouter().navTo("RouteRentals");
      },
    });
  }
);