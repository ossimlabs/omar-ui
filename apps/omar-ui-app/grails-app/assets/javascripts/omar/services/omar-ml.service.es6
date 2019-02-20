(function() {
    'use strict';
    angular.module('omarApp').service('omarMlService', ['stateService', '$uibModal', '$http', omarMlService]);

    function omarMlService(stateService, $uibModal, $http) {

        this.submitMlJobModal = function(imageId, imageFilename) {
          var modalInstance = $uibModal.open({
              templateUrl: AppO2.APP_CONFIG.serverURL + '/views/omarml/submit.job.partial.html',
              controller: [
                  '$uibModalInstance', 'imageId', 'imageFilename', 'models', 'omarMlService', '$http', SubmitMlJobModalController
              ],
              controllerAs: 'vm',
              resolve: {
                  omarMlService: () => {
                    return this;
                  },
                  imageId: function() {
                      return imageId;
                  },
                  imageFilename: function() {
                      return imageFilename;
                  },
                  models:  function() {
                    return $http({
                      method: 'GET',
                      url: omarMlRequestUrl + '/model/list'
                    });
                  }
              }
          });
        }; // this.submitMlJobModal

        this.viewJobsModal = function(imageId, imageFilename) {
          var modalInstance = $uibModal.open({
              templateUrl: AppO2.APP_CONFIG.serverURL + '/views/omarml/view.job.partial.html',
              controller: [
                  '$uibModalInstance', 'imageId', 'imageFilename', 'jobs', 'omarMlService', '$http', ViewJobsModalController
              ],
              controllerAs: 'vm',
              resolve: {
                  omarMlService: () => {
                    return this;
                  },
                  imageId: function() {
                      return imageId;
                  },
                  imageFilename: function() {
                      return imageFilename;
                  },
                  jobs:  function() {
                    return $http({
                      method: 'GET',
                      url: omarMlRequestUrl + '/job/query/' + imageId
                    });
                  }
              }
          });
        }; // this.viewJobsModal

        this.setOmarMlUrlProps = function() {
          omarMlBaseUrl = stateService.omarSitesState.url.base;
          omarMlContextPath = stateService.omarSitesState.url.omarMlContextPath;
          omarMlRequestUrl = omarMlBaseUrl + omarMlContextPath;
        }; // this.setOmarMlUrlProps
        this.setOmarMlUrlProps();

    } // omarMlService

    var omarMlBaseUrl, omarMlContextPath, omarMlRequestUrl;

    function SubmitMlJobModalController($uibModalInstance, imageId, imageFilename, models, omarMlService, $http) {

        this.imageId = imageId;
        this.imageFilename = imageFilename;
        this.model;
        this.models = models;
        this.confidence = 70;
        this.nms = 35;

        this.close = function() {
            $uibModalInstance.close();
        }; // this.close

        this.runJob = function() {
          if(typeof this.model !== 'undefined' &&
             typeof this.confidence !== 'undefined' &&
             typeof this.nms !== 'undefined') {
            $http({
              method: 'POST',
              url: omarMlRequestUrl + '/job',
              data: {
                imageFilename: this.imageFilename,
                imageDbid: this.imageId,
                confidence: this.confidence,
                nms: this.nms,
                model: this.model.name
              }
            });
          } // if block typeof this.model ...
        } // this.runJob

        this.viewJobs = function() {
          omarMlService.viewJobsModal(this.imageId, this.imageFilename);
          this.close();
        } // this.viewJobs
    } // SubmitMlJobModalController

    function ViewJobsModalController($uibModalInstance, imageId, imageFilename, jobs, omarMlService, $http) {

        this.imageId = imageId;
        this.imageFilename = imageFilename;
        this.jobs = jobs;

        this.close = function() {
            $uibModalInstance.close();
        }; // this.close

        this.backToSubmitJobs = function() {
          omarMlService.submitMlJobModal(this.imageId, this.imageFilename);
          this.close();
        } // this.backToSubmitJobs
    } // ViewJobsModalController

}());
