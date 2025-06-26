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
    "sap/ui/model/Filter"
  ],
  function (Controller, MessageToast, Dialog, Button, Label, Input, formatter, JSONModel, Filter) {
    "use strict";

    return Controller.extend("movierental.rental.controller.Movies", {
      formatter: formatter,

      onInit: function () {
        sap.ui.getCore().applyTheme("sap_fiori_3_dark");
        fetch("/odata/v4/movierental/Movies")
          .then((response) => response.json())
          .then(
            function (data) {
              // Set genres model
              var aGenres = data.value.map(function (movie) {
                return movie.genre;
              });
              var aUniqueGenres = [...new Set(aGenres)];
              var oGenreModel = new JSONModel(
                aUniqueGenres.map(function (genre) {
                  return { genre: genre };
                })
              );
              this.getView().setModel(oGenreModel, "genres");

              // Set main movies model (with Movies and TopMovies)
              var aMovies = data.value;
              var aTopMovies = aMovies
                .slice()
                .sort(function (a, b) {
                  return b.rentedCount - a.rentedCount;
                })
                .slice(0, 5);

              // Debug: mostrar en consola
              console.log("TopMovies:", aTopMovies);
              var oMoviesModel = new JSONModel({
                Movies: aMovies,
                TopMovies: aTopMovies
              });
              this.getView().setModel(oMoviesModel); 
              console.log("Modelo movies:", this.getView().getModel("movies").getData());
            }.bind(this)
          );
      },

      onSwitchTheme: function () {
        var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
        if (sCurrentTheme === "sap_fiori_3_dark") {
          sap.ui.getCore().applyTheme("sap_fiori_3");
        } else {
          sap.ui.getCore().applyTheme("sap_fiori_3_dark");
        }
      },

      onOpenRentalForm: function (oEvent) {
        var oContext = oEvent.getSource().getParent().getBindingContext();
        var oMovie = oContext.getObject();
        var oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();

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

                oContext
                  .created()
                  .then(
                    function () {
                      MessageToast.show(oResourceBundle.getText("msgSuccess"));
                      this._oDialog.close();
                      oModel.refresh();
                    }.bind(this)
                  )
                  .catch(function (oError) {
                    console.error("Error registering rental:", oError);
                    MessageToast.show(
                      oResourceBundle.getText("msgError") + oError.message
                    );
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

      onGenreFilterChange: function (oEvent) {
        var sGenre = oEvent.getSource().getSelectedKey();
        var oGrid = this.byId("moviesGrid");
        var oBinding = oGrid.getBinding("items");
        if (sGenre) {
          oBinding.filter([new Filter("genre", "EQ", sGenre)]);
        } else {
          oBinding.filter([]);
        }
      },

      onImageError: function (oEvent) {
        var oImage = oEvent.getSource();
        var sFallback =
          jQuery.sap.getModulePath("movierental.rental") + "/img/fallback.png";
        // Avoid infinite loop
        if (oImage.getSrc() !== sFallback) {
          oImage.setSrc(sFallback);
        }
      },
    });
  }
);