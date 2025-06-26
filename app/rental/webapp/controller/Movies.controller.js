sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
    "movierental/rental/util/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
  ],
  function (
    Controller,
    MessageToast,
    Dialog,
    Button,
    Label,
    Input,
    formatter,
    JSONModel,
    Filter
  ) {
    "use strict";

    return Controller.extend("movierental.rental.controller.Movies", {
      formatter: formatter,

      onInit: function () {
        sap.ui.getCore().applyTheme("sap_fiori_3_dark");

        // se que podría prescindir del fetch y la creacion de modelo con JSON pero no logré configurar el manifest
        fetch("/odata/v4/movierental/Movies")
          .then((response) => response.json())
          .then((data) => {

            const aGenres = data.value.map((movie) => movie.genre);
            const aUniqueGenres = [...new Set(aGenres)];
            const oGenreModel = new JSONModel(
              aUniqueGenres.map((genre) => ({ genre }))
            );
            this.getView().setModel(oGenreModel, "genres");
          })
          .catch((error) => {
            MessageToast.show("Error loading movies: " + error.message);
          });
      },

      onSwitchTheme: function () {
        const sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
        sap.ui
          .getCore()
          .applyTheme(
            sCurrentTheme === "sap_fiori_3_dark"
              ? "sap_fiori_3"
              : "sap_fiori_3_dark"
          );
      },

      onOpenRentalForm: function (oEvent) {
        const oContext = oEvent.getSource().getParent().getBindingContext();
        const oMovie = oContext.getObject();
        const oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();

        this._customerValue = "";
        this._quantityValue = 1;

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
                liveChange: (oEvent) => {
                  this._customerValue = oEvent.getParameter("value");
                },
              }),
              new Label({ text: oResourceBundle.getText("labelQuantity") }),
              new Input({
                type: "Number",
                value: 1,
                liveChange: (oEvent) => {
                  this._quantityValue = oEvent.getParameter("value");
                },
              }),
            ],
            beginButton: new Button({
              text: oResourceBundle.getText("buttonRent"),
              press: () => {
                const sCustomer = this._customerValue || "";
                const iQuantity = parseInt(this._quantityValue || 1, 10);

                if (!sCustomer || isNaN(iQuantity) || iQuantity < 1) {
                  MessageToast.show(oResourceBundle.getText("msgFillFields"));
                  return;
                }

                if (oMovie.stock < iQuantity) {
                  MessageToast.show(oResourceBundle.getText("msgNoStock"));
                  return;
                }

                const oModel = this.getOwnerComponent().getModel();
                const oListBinding = oModel.bindList("/Rentals");
                const oContext = oListBinding.create({
                  movie_ID: oMovie.ID,
                  customer: sCustomer,
                  quantity: iQuantity,
                  rentalDate: new Date().toISOString(),
                });

                oContext
                  .created()
                  .then(() => {
                    MessageToast.show(oResourceBundle.getText("msgSuccess"));
                    this._oDialog.close();
                    oModel.refresh();
                  })
                  .catch((oError) => {
                    console.error("Error registering rental:", oError);
                    MessageToast.show(
                      oResourceBundle.getText("msgError") + oError.message
                    );
                  });
              },
            }),
            endButton: new Button({
              text: oResourceBundle.getText("buttonCancel"),
              press: () => {
                this._oDialog.close();
              },
            }),
            afterClose: () => {
              this._oDialog.destroy();
              this._oDialog = null;
            },
          });
        }
        this._oDialog.open();
      },

      onNavToRentals: function () {
        this.getOwnerComponent().getRouter().navTo("RouteRentals");
      },

      onGenreFilterChange: function (oEvent) {
        const sGenre = oEvent.getSource().getSelectedKey();
        const oGrid = this.byId("moviesGrid");
        const oBinding = oGrid.getBinding("items");
        if (sGenre) {
          oBinding.filter([new Filter("genre", "EQ", sGenre)]);
        } else {
          oBinding.filter([]);
        }
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
    });
  }
);