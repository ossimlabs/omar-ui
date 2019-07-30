"use strict";
angular
    .module('omarApp')
    .component('modal', {
        templateUrl: AppO2.APP_CONFIG.serverURL + '/views/modal/modal.template.html',
        controller: ModalController,
        bindings: {
            modalInstance: '<',
            resolve: '<',
            close: '&',
            dismiss: '&'
        }
    });

function ModalController($scope) {
    // makes data available to ui/html/controller
    this.sourceItems = ['DB ID', 'Mission', 'Sensor', 'Product ID', 'Organization', 'Country Code', 'WAC Code', 'Image Representation']

    this.$onInit = function() {
        this.modalData = this.resolve.modalData;
    }

    this.ok = function () {
        this.close({$value: 'ok'});
    }

    this.cancel = function () {
        this.dismiss({$value: 'cancel'});
    }

    console.log('this!', this)
}