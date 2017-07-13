(function() {
  'use strict';
  angular
    .module('omarApp')
    .service('avroMetadataService', ['$rootScope', '$http', '$timeout', avroMetadataService]);

    function avroMetadataService($rootScope, $http, $timeout) {

      var avroData;

      this.getAvroMetadata = function() {

        console.log('Firing getAvroMetadata from the service...');

        var avroMetadataUrl = AppO2.APP_CONFIG.params.avroMetadataApp.baseUrl;
        console.log('avroMetadataUrl: ', avroMetadataUrl);

        $http({
          method: 'GET',
          //url: avroMetadataUrl
          url: 'https://jsonplaceholder.typicode.com/posts/1'
        }).then(function(response){
          var data;
          data = response.data;
          console.log(data)

          // $timeout needed: http://stackoverflow.com/a/18996042
          $timeout( function ()
          {
              $rootScope.$broadcast('avroMetadata: updated', data);
              console.log( 'data object...', data );
              avroData = data;
          } );
        })

        // TODO: Need to catch errors here...

        return avroData;

      }
    }

}());
