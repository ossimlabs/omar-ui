(function() {
  "use strict";
  angular
    .module("omarApp")
    .service("stateService", ["$rootScope", "$timeout", "$log", stateService]);

  function stateService($rootScope, $timeout, $log) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################

    var _this = this;

    /**
         * Description: Holds the current state of the application's urls
         * and their context paths.
         *
         * @type {Object}
         */
    var omarSitesState = {
      info: {
        name: AppO2.APP_CONFIG.params.sites.o2.info.name,
        description: AppO2.APP_CONFIG.params.sites.o2.info.description
      },
      url: {
        base: AppO2.APP_CONFIG.params.sites.o2.url.base,
        uiContextPath: "/omar-ui",
        wfsContextPath: "/omar-wfs",
        wmsContextPath: "/omar-wms",
        omsContextPath: "/omar-oms",
        geoscriptContextPath: "/omar-geoscript",
        avroMetadataContextPath: "/omar-avro-metadata",
        mensaContextPath: "/omar-mensa",
        stagerContextPath: "/omar-stager",
        downloadContextPath: "/omar-download",
        kmlContextPath: "/omar-superoverlay",
        jpipContextPath: "/omar-jpip",
        wmtsContextPath: "/omar-wmts",
        tlvContextPath: "/tlv",
        uploadContextPath: "/omar-upload",
        isaContextPath: "/isa-ui",
        omarMlContextPath: "/omar-ml"
      }
    };

    _this.omarSitesState = omarSitesState;

    /**
         * Description: Gets the current state of the omarSitesState
         *
         * @return {[type]} [description]
         */
    _this.getOmarSitesState = function() {
      return _this.omarSitesState;
    };

    /**
     * Description: updates the omarSitesState object
     *
     * @param  {object} objParams An object that contains properties of the
     * omarSitesState state object that are to be updated.
     *
     * @return Conducts a $broadcast for $on listeners (subscribers) for
     * this update.
     */
    _this.updateSitesAppState = function(objParams) {
      _this.omarSitesState.info.name = checkForValidObjProp(
        _this.omarSitesState.info.name,
        objParams.infoName
      )
        ? objParams.infoName
        : _this.omarSitesState.info.name;

      _this.omarSitesState.info.description = checkForValidObjProp(
        _this.omarSitesState.info.description,
        objParams.infoDescription
      )
        ? objParams.infoDescription
        : _this.omarSitesState.info.description;

      _this.omarSitesState.url.uiContextPath = checkForValidObjProp(
        _this.omarSitesState.url.uiContextPath,
        objParams.urlUiContextPath
      )
        ? objParams.urlUiContextPath
        : "/omar-ui"

      _this.omarSitesState.url.base = checkForValidObjProp(
        _this.omarSitesState.url.base,
        objParams.urlBase
      )
        ? objParams.urlBase
        : _this.omarSitesState.url.base;

      _this.omarSitesState.url.wfsContextPath = checkForValidObjProp(
        _this.omarSitesState.url.wfsContextPath,
        objParams.urlWfsContextPath
      )
        ? objParams.urlWfsContextPath
        : "/omar-wfs"

      _this.omarSitesState.url.wmsContextPath = checkForValidObjProp(
        _this.omarSitesState.url.wmsContextPath,
        objParams.urlWmsContextPath
      )
        ? objParams.urlWmsContextPath
        : "/omar-wms"

      _this.omarSitesState.url.omsContextPath = checkForValidObjProp(
        _this.omarSitesState.url.omsContextPath,
        objParams.urlOmsContextPath
      )
        ? objParams.urlOmsContextPath
        : "/omar-oms"

      _this.omarSitesState.url.geoscriptContextPath = checkForValidObjProp(
        _this.omarSitesState.url.geoscriptContextPath,
        objParams.urlGeoscriptContextPath
      )
        ? objParams.urlGeoscriptContextPath
        : "/omar-geoscript"

      _this.omarSitesState.url.avroMetadataContextPath = checkForValidObjProp(
        _this.omarSitesState.url.avroMetadataContextPath,
        objParams.urlAvroMetadataContextPath
      )
        ? objParams.urlAvroMetadataContextPath
        : "/omar-avro-metadata"

      _this.omarSitesState.url.mensaContextPath = checkForValidObjProp(
        _this.omarSitesState.url.mensaContextPath,
        objParams.urlMensaContextPath
      )
        ? objParams.urlMensaContextPath
        : "/omar-mensa"

      _this.omarSitesState.url.stagerContextPath = checkForValidObjProp(
        _this.omarSitesState.url.stagerContextPath,
        objParams.urlStagerContextPath
      )
        ? objParams.urlStagerContextPath
        : "/omar-stager"

      _this.omarSitesState.url.downloadContextPath = checkForValidObjProp(
        _this.omarSitesState.url.downloadContextPath,
        objParams.urlDownloadContextPath
      )
        ? objParams.urlDownloadContextPath
        : "/omar-download"

      _this.omarSitesState.url.kmlContextPath = checkForValidObjProp(
        _this.omarSitesState.url.kmlContextPath,
        objParams.urlKmlContextPath
      )
        ? objParams.urlKmlContextPath
        : "/omar-superoverlay"

      _this.omarSitesState.url.jpipContextPath = checkForValidObjProp(
        _this.omarSitesState.url.jpipContextPath,
        objParams.urlJpipContextPath
      )
        ? objParams.urlJpipContextPath
        : "/omar-jpip"

      _this.omarSitesState.url.wmtsContextPath = checkForValidObjProp(
        _this.omarSitesState.url.wmtsContextPath,
        objParams.urlWmtsContextPath
      )
        ? objParams.urlWmtsContextPath
        : "/omar-wmts"

      _this.omarSitesState.url.tlvContextPath = checkForValidObjProp(
        _this.omarSitesState.url.tlvContextPath,
        objParams.urlTlvContextPath
      )
        ? objParams.urlTlvContextPath
        : "/tlv"

      _this.omarSitesState.url.uploadContextPath = checkForValidObjProp(
        _this.omarSitesState.url.uploadContextPath,
        objParams.urlUploadContextPath
      )
        ? objParams.urlUploadContextPath
        : "/omar-upload"

      _this.omarSitesState.url.isaContextPath = checkForValidObjProp(
        _this.omarSitesState.url.isaContextPath,
        objParams.urlIsaContextPath
      )
        ? objParams.IsaContextPath
        : "/isa-ui"

      _this.omarSitesState.url.omarMlContextPath = checkForValidObjProp(
        _this.omarSitesState.url.omarMlContextPath,
        objParams.urlOmarMlContextPath
      )
        ? objParams.OmarMlContextPath
        : "/omar-ml"

      // $timeout needed: http://stackoverflow.com/a/18996042
      $timeout(function() {
        $rootScope.$broadcast("omarSitesState.updated", _this.omarSitesState);
      });
    };

    /**
       * Description: Checks to see if the incoming objParams property is undefined or an empty string
       * Does not update the incoming associated object property if this is the case.
       *
       * @param  {object} objProp         Object property that will be modified
       * @param  {object} objPropToAssign  Object property that will receive the new value assignment
       * @return {boolean}                 Boolean value used to determine if the property can be updated
       */
    function checkForValidObjProp(objProp, objPropToAssign) {
      $log.debug(`objProp: ${objProp}  objPropToAssign: ${objPropToAssign}`);
      if (objPropToAssign === undefined || objPropToAssign === "") {
        $log.debug('checkForValidObjProp returning false');
        return false;
      }
      $log.debug('checkForValidObjProp returning true');
      return true;
    }

    var mapState = {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 3,
      feature: {
        lat: undefined,
        lng: undefined,
        wkt: undefined,
        bounds: {
          ne: {
            lat: undefined,
            lng: undefined
          },
          sw: {
            lat: undefined,
            lng: undefined
          }
        }
      },
      featureIds: []
    };

    _this.mapState = mapState;

    _this.updateMapState = function(objParams) {
      _this.mapState.center.lat = objParams.lat;
      _this.mapState.center.lng = objParams.lng;
      _this.mapState.feature.lat = objParams.lat;
      _this.mapState.feature.lng = objParams.lng;

      // Assign these values to the mapState object only if
      // twofishes has a wkt value that is defined.
      if (objParams.wkt !== undefined) {
        _this.mapState.feature.wkt = objParams.wkt;
        _this.mapState.feature.bounds.ne.lat = objParams.bounds.ne.lat;
        _this.mapState.feature.bounds.ne.lng = objParams.bounds.ne.lng;
        _this.mapState.feature.bounds.sw.lat = objParams.bounds.sw.lat;
        _this.mapState.feature.bounds.sw.lng = objParams.bounds.sw.lng;
      }

      $rootScope.$broadcast("mapState.updated", _this.mapState);
    };

    _this.resetFeatureMapState = function() {
      _this.mapState.feature.lat = undefined;
      _this.mapState.feature.lng = undefined;
      _this.mapState.feature.wkt = undefined;
      _this.mapState.feature.bounds.ne.lat = undefined;
      _this.mapState.feature.bounds.ne.lng = undefined;
      _this.mapState.feature.bounds.sw.lat = undefined;
      _this.mapState.feature.bounds.sw.lng = undefined;
    };

    _this.navState = {};

    _this.navStateUpdate = function(object) {
      _this.navState.userGuideUrl = object.userGuideUrl || null;

      $rootScope.$broadcast("navState.updated", _this.navState);
    };
  }
})();
