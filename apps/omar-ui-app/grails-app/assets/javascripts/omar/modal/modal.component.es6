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

function ModalController(avroMetadataService, shareService) {
    // Source key list
    // These match up with the WFS response.  They are case sensitive but are rendered in sentence-case on the UI.
    // Adding any value here, will dynamically generate/remove it from the UI.  No other actions will need to be taken.
    // Additionally, these can be moved around and/or the title can be changed at will.
    // To get one to display on the UI, simply match find the KVP in the response you wish to display and add it
    // If it does not exist in the response, it will render the key in the UI with no value.
    this.metadata = {
        'Source': ['id', 'DB ID', 'Mission', 'Sensor', 'Product ID', 'Organization', 'Country Code', 'WAC Code', 'Image Representation'],
        'Metrics': ['NIIRS', 'Azimuth Angle', 'Grazing Angle', 'Sun Azimuth', 'Sun Elevation', 'Cloud Cover', 'Number of Bands', 'Number of Resolution Levels', 'Bit Depth'],
        'File': ['Type', 'filename', 'Entry ID'],
        'Dimensions': ['height', 'width'],
        'General': ['Description', 'Title', 'Security Classification'],
        'Geometry': ['GSD Unit', 'GSD X', 'GSD Y']
    }

    this.$onInit = function() {
        // When component loads, run resolve.modalData, which essentially brings the dataToBeRendered into this component
        // Assign that object/repsonse to this.modalData which gives the UI access to it
        this.modalData = this.resolve.modalData;
    }

    this.ok = function () {
        this.close({$value: 'ok'});
    }

    this.cancel = function () {
        this.dismiss({$value: 'cancel'});
    }

    this.share = (videoLink) => {
        shareService.imageLinkModal(videoLink)
    }
}