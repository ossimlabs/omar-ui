(function() {
    'use strict';
    angular.module('omarApp').service('stateService', ['$rootScope', '$timeout', stateService]);

    function stateService($rootScope, $timeout) {

        // #################################################################################
        // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
        // provides access to various client params in application.yml
        // #################################################################################
        //console.log('AppO2.APP_CONFIG in stateService: ', AppO2.APP_CONFIG);

        var _this = this;

        /**
     * Description: Holds the current state of the application's urls
     * and their context paths.
     *
     * @type {Object}
     */
        var omarSitesState = {
            info: {
                name: AppO2.APP_CONFIG.params.sites[0].info.name,
                description: AppO2.APP_CONFIG.params.sites[0].info.description
            },
            url: {
                base: AppO2.APP_CONFIG.params.sites[0].url.base,
                uiContextPath: '/omar-ui',
                wfsContextPath: '/omar-wfs',
                wmsContextPath: '/omar-wms',
                omsContextPath: '/omar-oms',
                geoscriptContextPath: '/omar-geoscript',
                avroMetadataContextPath: '/omar-avro-metadata',
                mensaContextPath: '/omar-mensa',
                stagerContextPath: '/omar-stager',
                downloadContextPath: '/omar-download',
                kmlContextPath: '/omar-superoverlay',
                jpipContextPath: '/omar-jpip',
                wmtsContextPath: '/omar-wmts',
                tlvContextPath: '/tlv',
                isaContextPath: '/isa-ui'
            }
        }

        _this.omarSitesState = omarSitesState;

        /**
     * Description: Gets the current state of the omarSitesState
     *
     * @return {[type]} [description]
     */
        _this.getOmarSitesState = function() {

            return _this.omarSitesState;

        }

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

            _this.omarSitesState.info.name = checkForValidObjProp(_this.omarSitesState.info.name, objParams.infoName)
                ? objParams.infoName
                : _this.omarSitesState.info.name;

            _this.omarSitesState.info.description = checkForValidObjProp(_this.omarSitesState.info.description, objParams.infoDescription)
                ? objParams.infoDescription
                : _this.omarSitesState.info.description;

            _this.omarSitesState.url.uiContextPath = checkForValidObjProp(_this.omarSitesState.url.uiContextPath, objParams.urlUiContextPath)
                ? objParams.urlUiContextPath
                : _this.omarSitesState.url.uiContextPath;

            _this.omarSitesState.url.base = checkForValidObjProp(_this.omarSitesState.url.base, objParams.urlBase)
                ? objParams.urlBase
                : _this.omarSitesState.url.base;

            _this.omarSitesState.url.wfsContextPath = checkForValidObjProp(_this.omarSitesState.url.wfsContextPath, objParams.urlWfsContextPath)
                ? objParams.urlWfsContextPath
                : _this.omarSitesState.url.wfsContextPath;

            _this.omarSitesState.url.wmsContextPath = checkForValidObjProp(_this.omarSitesState.url.wmsContextPath, objParams.urlWmsContextPath)
                ? objParams.urlWmsContextPath
                : _this.omarSitesState.url.wmsContextPath;

            _this.omarSitesState.url.omsContextPath = checkForValidObjProp(_this.omarSitesState.url.omsContextPath, objParams.urlOmsContextPath)
                ? objParams.urlOmsContextPath
                : _this.omarSitesState.url.omsContextPath;

            _this.omarSitesState.url.geoscriptContextPath = checkForValidObjProp(_this.omarSitesState.url.geoscriptContextPath, objParams.urlGeoscriptContextPath)
                ? objParams.urlGeoscriptContextPath
                : _this.omarSitesState.url.geoscriptContextPath;

            _this.omarSitesState.url.avroMetadataContextPath = checkForValidObjProp(_this.omarSitesState.url.avroMetadataContextPath, objParams.urlAvroMetadataContextPath)
                ? objParams.urlAvroMetadataContextPath
                : _this.omarSitesState.url.avroMetadataContextPath;

            _this.omarSitesState.url.mensaContextPath = checkForValidObjProp(_this.omarSitesState.url.mensaContextPath, objParams.urlMensaContextPath)
                ? objParams.urlMensaContextPath
                : _this.omarSitesState.url.mensaContextPath;

            _this.omarSitesState.url.stagerContextPath = checkForValidObjProp(_this.omarSitesState.url.stagerContextPath, objParams.urlStagerContextPath)
                ? objParams.urlStagerContextPath
                : _this.omarSitesState.url.stagerContextPath;

            _this.omarSitesState.url.downloadContextPath = checkForValidObjProp(_this.omarSitesState.url.downloadContextPath, objParams.urlDownloadContextPath)
                ? objParams.urlDownloadContextPath
                : _this.omarSitesState.url.downloadContextPath;

            _this.omarSitesState.url.kmlContextPath = checkForValidObjProp(_this.omarSitesState.url.kmlContextPath, objParams.urlKmlContextPath)
                ? objParams.urlKmlContextPath
                : _this.omarSitesState.url.kmlContextPath;

            _this.omarSitesState.url.jpipContextPath = checkForValidObjProp(_this.omarSitesState.url.jpipContextPath, objParams.urlJpipContextPath)
                ? objParams.urlJpipContextPath
                : _this.omarSitesState.url.jpipContextPath;

            _this.omarSitesState.url.wmtsContextPath = checkForValidObjProp(_this.omarSitesState.url.wmtsContextPath, objParams.urlWmtsContextPath)
                ? objParams.urlWmtsContextPath
                : _this.omarSitesState.url.wmtsContextPath;

            _this.omarSitesState.url.tlvContextPath = checkForValidObjProp(_this.omarSitesState.url.tlvContextPath, objParams.urlTlvContextPath)
                ? objParams.urlTlvContextPath
                : '/tlv';

            _this.omarSitesState.url.isaContextPath = checkForValidObjProp(_this.omarSitesState.url.isaContextPath, objParams.urlIsaContextPath)
                ? objParams.IsaContextPath
                : '/isa-ui';

            // $timeout needed: http://stackoverflow.com/a/18996042
            $timeout(function() {
                $rootScope.$broadcast('omarSitesState.updated', _this.omarSitesState);
            });
            //console.log('updateSitesAppState triggered.');

        }

        /**
     * Description: Checks to see if the incoming objParams property is undefined or an empty string
     * Does not update the incoming associated object property if this is the case.
     *
     * @param  {object} objProp         Object property that will be modified
     * @param  {object} objPropToAssign  Object property that will receive the new value assignment
     * @return {boolean}                 Boolean value used to determine if the property can be updated
     */
        function checkForValidObjProp(objProp, objPropToAssign) {

            if (objPropToAssign === undefined || objPropToAssign === '') {
                return false;
            }
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
            }
        }

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

            $rootScope.$broadcast('mapState.updated', _this.mapState);

        }

        _this.resetFeatureMapState = function() {

            _this.mapState.feature.lat = undefined;
            _this.mapState.feature.lng = undefined;
            _this.mapState.feature.wkt = undefined;
            _this.mapState.feature.bounds.ne.lat = undefined;
            _this.mapState.feature.bounds.ne.lng = undefined;
            _this.mapState.feature.bounds.sw.lat = undefined;
            _this.mapState.feature.bounds.sw.lng = undefined;

        }

        _this.navState = {};

        _this.navStateUpdate = function(object) {
            _this.navState.titleLeft = object.titleLeft || "";
            _this.navState.userGuideUrl = object.userGuideUrl || null;

            $rootScope.$broadcast('navState.updated', _this.navState);
        }

    }

}());
