"use strict";
angular
    .module('omarApp')
    .component('modal', {
        templateUrl: AppO2.APP_CONFIG.serverURL + '/views/modal/modal.template.html',
        controller: ModalController
    });

function ModalController() {
    this.user = 'world';
    console.log('modal is running!')
}