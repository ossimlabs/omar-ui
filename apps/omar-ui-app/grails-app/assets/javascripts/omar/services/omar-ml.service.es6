(function() {
    'use strict';
    angular.module('omarApp').service('omarMlService', ['stateService', '$uibModal', omarMlService]);

    function omarMlService(stateService, $uibModal) {

        this.submitMlJobModal = function(imageId) {
            var http = new XMLHttpRequest();
            http.open("GET", omarMlRequestUrl + "/model/list");
            http.send();
            this.models = http.requestText;
            var modalInstance = $uibModal.open({
                templateUrl: AppO2.APP_CONFIG.serverURL + '/views/omarml/submit.job.partial.html',
                controller: [
                    '$uibModalInstance', 'imageId', SubmitMlJobModalController
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

    function SubmitMlJobModalController($uibModalInstance, imageId) {

        this.imageId = imageId;

        this.close = function() {
            $uibModalInstance.close();
        };

    }
}());
