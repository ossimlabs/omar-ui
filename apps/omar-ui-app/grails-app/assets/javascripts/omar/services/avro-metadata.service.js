(function() {
  'use strict';
  angular
    .module('omarApp')
    .service('avroMetadataService', ['stateService', '$rootScope', '$http', '$timeout', avroMetadataService]);

    function avroMetadataService(stateService, $rootScope, $http, $timeout, $scope) {

      var avroMetadataBaseUrl,
          avroMetadataContextPath,
          avroMetadataRequestUrl;

      /**
       * Description: Called from the listController so that the $on. event that subscribes to the $broadcast
       * can update the avroMetadata url and context path.
       */
      this.setAvroMetadataUrlProps = function() {

        avroMetadataBaseUrl = stateService.omarSitesState.url.base;
        avroMetadataContextPath = stateService.omarSitesState.url.avroMetadataContextPath;
        avroMetadataRequestUrl = avroMetadataBaseUrl + avroMetadataContextPath + '/avroMetadata/get/';

      }

      var avroData;

      this.getAvroMetadata = function(imageId) {

        //var avroMetadataUrl = AppO2.APP_CONFIG.params.avroMetadataApp.baseUrl;

        $http({
          method: 'GET',
          url: avroMetadataRequestUrl + encodeURIComponent(imageId),

        }).then(function success (response){

          var data;
          var avroObj;
          data = response.data.data;

          // If there was no image found we will return false for the avroObj,
          // and send the response back to the list controller so that the
          // could not be found can be displayed
          if(data === 'AvroMetadata for imageId ' + imageId + ' not found') {

            avroObj = false;

          } else {

            // Send the found avro data back as the  avroObj to the
            // controller so that it can be displayed
            var firstMessageString = data.avroMetadata;
            var secondMessageString = JSON.parse(firstMessageString);
            avroObj = JSON.parse(secondMessageString.Message);

          }

          // $timeout needed: http://stackoverflow.com/a/18996042
          $timeout(function() {

              $rootScope.$broadcast('avroMetadata: updated', avroObj);
              avroData = avroObj;

          });


        }, function error (response){

          console.log('Error accessing data!', response);

        });

        return avroData;

      }
    }

}());
