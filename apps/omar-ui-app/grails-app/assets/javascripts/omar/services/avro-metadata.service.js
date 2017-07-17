(function() {
  'use strict';
  angular
    .module('omarApp')
    .service('avroMetadataService', ['$rootScope', '$http', '$timeout', avroMetadataService]);

    function avroMetadataService($rootScope, $http, $timeout, $scope) {

      var avroData;

      this.getAvroMetadata = function(imageId) {

        var avroMetadataUrl = AppO2.APP_CONFIG.params.avroMetadataApp.baseUrl;

        $http({
          method: 'GET',
          url: avroMetadataUrl + encodeURIComponent(imageId),

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
