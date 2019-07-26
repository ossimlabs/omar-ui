"use strict";
angular
    .module('omarApp')
    .component('modal', {
        templateUrl: AppO2.APP_CONFIG.serverURL + '/views/modal/modal.template.html',
        controller: ModalController,
        bindings: {
            modalData: '@',
            video: '<',
            onDelete: '&',
            onUpdate: '&'
        }
    });

function ModalController($scope) {
    this.openComponentModal = () => {
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'modalComponent',
            resolve: {
                items: function () {
                    return $ctrl.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    }
    console.log('this!', this)
}