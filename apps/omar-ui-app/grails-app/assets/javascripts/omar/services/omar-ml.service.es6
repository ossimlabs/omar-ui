(function() {
    'use strict';
    angular.module('omarApp').service('omarMlService', ['stateService', '$uibModal', '$http', omarMlService]);

    function omarMlService(stateService, $uibModal, $http) {

        this.submitMlJobModal = function(imageId) {
            var modalInstance = $uibModal.open({
                templateUrl: AppO2.APP_CONFIG.serverURL + '/views/omarml/submit.job.partial.html',
                controller: [
                    '$uibModalInstance', 'imageId', '$http', SubmitMlJobModalController
                ],
                controllerAs: 'vm',
                resolve: {
                    imageId: function() {
                        return imageId;
                    },
                    models: function() {
                        return models;
                    }
                }
            });
        };

        var omarMlBaseUrl, omarMlContextPath, omarMlRequestUrl;

        this.setOmarMlUrlProps = function() {
          omarMlBaseUrl = stateService.omarSitesState.url.base;
          omarMlContextPath = stateService.omarSitesState.url.omarMlContextPath;
          omarMlRequestUrl = omarMlBaseUrl + omarMlContextPath;
        };
        this.setOmarMlUrlProps();

    }

    function SubmitMlJobModalController($uibModalInstance, imageId, $http) {

        this.imageId = imageId;

        $http({
          method: 'GET',
          url: omarMlRequestUrl + '/model/list'
        }).then(function(response) {
            this.models = response;
          });

        this.close = function() {
            $uibModalInstance.close();
        };

    }
}());
