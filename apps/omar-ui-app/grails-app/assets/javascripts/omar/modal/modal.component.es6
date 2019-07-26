"use strict";
angular
    .module('omarApp')
    .component('modal', {
        // templateUrl: 'modal/modal.template.html',
        template: '<h1> it works!</h1>',
        controller: ModalController
    });

function ModalController() {
    this.user = 'world';
    console.log('modal is running!')
}