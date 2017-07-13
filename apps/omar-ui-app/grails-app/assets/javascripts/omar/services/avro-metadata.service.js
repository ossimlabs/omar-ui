(function() {
  'use strict';
  angular
    .module('omarApp')
    .service('avroMetadataService', ['$rootScope', '$http', '$timeout', avroMetadataService]);

    function avroMetadataService($rootScope, $http, $timeout) {

      var avroData;

      this.getAvroMetadata = function() {

        var avroMetadataUrl = AppO2.APP_CONFIG.params.avroMetadataApp.baseUrl;

        $http({
          method: 'GET',
          url: avroMetadataUrl + '04APR16CS0207001_110646_SM0262R_29N081W_001X___SHH_0101_OBS_IMAG'
        }).then(function(response){
          var data;
          data = response.data;

          // $timeout needed: http://stackoverflow.com/a/18996042
          $timeout( function ()
          {
              $rootScope.$broadcast('avroMetadata: updated', data);
              //console.log( 'data object...', data );
              avroData = data;
          } );
        })

        // TODO: Need to catch errors here...

        return avroData;

      }
    }

}());
