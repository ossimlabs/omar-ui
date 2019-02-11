(function() {
    'use strict';
    angular.module('omarApp').service('omarMlService', ['stateService', '$uibModal', '$http', omarMlService]);

    function omarMlService(stateService, $uibModal, $http) {

        this.submitMlJobModal = function(imageId, models) {
            $http({
              method: 'GET',
              url: omarMlRequestUrl + '/model/list'
            }).then((response) => {
                models = response.data;
            });
            var modalInstance = $uibModal.open({
                templateUrl: AppO2.APP_CONFIG.serverURL + '/views/omarml/submit.job.partial.html',
                controller: [
                    '$uibModalInstance', 'imageId', 'models', SubmitMlJobModalController
                ],
                controllerAs: 'vm',
                resolve: {
                    imageId: function() {
                        return imageId;
                    },
                    models:  function() {
                      return $http({
                        method: 'GET',
                        url: omarMlRequestUrl + '/model/list'
                      });
                    }
                }
            });
        };

        this.getModels = function() {
            return $http({method:"GET", url:omarMlRequestUrl + '/model/list'}).then(function(result){
                return result.data;
            });
        };

        this.setOmarMlUrlProps = function() {
          omarMlBaseUrl = stateService.omarSitesState.url.base;
          omarMlContextPath = stateService.omarSitesState.url.omarMlContextPath;
          omarMlRequestUrl = omarMlBaseUrl + omarMlContextPath;
        };
        this.setOmarMlUrlProps();

    }

    var omarMlBaseUrl, omarMlContextPath, omarMlRequestUrl;

    function SubmitMlJobModalController($uibModalInstance, imageId, models) {

        this.imageId = imageId;
        this.model;
        this.models = models;
        this.confidence = 70;
        this.nms = 35;

        this.close = function() {
            $uibModalInstance.close();
        };

        this.runJob = function() {
          console.log(this.imageId);
          console.log(this.model);
          console.log(this.confidence);
          console.log(this.nms);
        }

    }
}());
