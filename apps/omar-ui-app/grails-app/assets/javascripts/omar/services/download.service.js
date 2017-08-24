(function() {
    'use strict';
    angular.module('omarApp').service('downloadService', ['stateService', '$stateParams', 'toastr', '$http', downloadService]);

    function downloadService(stateService, $stateParams, toastr, $http) {

        // Sets the initial url values for the mensa service
        var baseUrl,
            downloadContextPath,
            downloadRequestUrl,
            stagerContextPath,
            stagerRequestUrl,
            downloadManager,
            dataManager;

        this.setDownloadServiceUrlProps = function() {

            baseUrl = stateService.omarSitesState.url.base;

            downloadContextPath = stateService.omarSitesState.url.downloadContextPath;
            downloadRequestUrl = baseUrl + downloadContextPath;
            //console.log(downloadRequestUrl);

            stagerContextPath = stateService.omarSitesState.url.stagerContextPath;
            stagerRequestUrl = baseUrl + stagerContextPath;
            //console.log(stagerRequestUrl);

            //console.log('setDownloadServiceUrlProps firing in downloadService');

        }
        this.setDownloadServiceUrlProps();

        var imageLayerIds;
        //var downloadManager = AppO2.APP_CONFIG.params.downloadApp.baseUrl;
        //var downloadManager; // = downloadRequestUrl;
        //var dataManager = AppO2.APP_CONFIG.params.stagerApp.baseUrl;
        //var dataManager; // = stagerRequestUrl;

        var data = {
            'type': 'Download',
            'zipFileName': '',
            'archiveOptions': {
                'type': 'zip'
            },
            'fileGroups': [
                {
                    'rootDirectory': '',
                    'files': ['']
                }
            ]
        };

        this.downloadFiles = function(imageId) {

          downloadManager = downloadRequestUrl;
          dataManager = stagerRequestUrl;

            if (!imageId) {
                imageLayerIds = $stateParams.layers.split(',');
                imageId = imageLayerIds[0];
            }


            var url = dataManager + '/dataManager/getRasterFiles?id=' + imageId;
            var dm = downloadManager + '/archive/download';

            console.log('dataManager: ' + dataManager);
            console.log('downloadManager: ' + downloadManager);

            $http({method: 'GET', url: url}).then(function(response) {
                if (response.data.results.length > 0) {
                    data.fileGroups[0].files = response.data.results;

                    $.fileDownload(dm, {
                        httpMethod: 'POST',
                        dataType: 'text',
                        contentType: 'plain/text',
                        data: {
                            fileInfo: JSON.stringify(data)
                        },
                        successCallback: function(url) {
                            toastr.success('Files are being downloaded.', {
                                positionClass: 'toast-bottom-left',
                                closeButton: true,
                                timeOut: 10000,
                                extendedTimeOut: 5000,
                                target: 'body'
                            });
                        },
                        failCallback: function(responseHtml, url, error) {

                            //Error will occur if type and archiveOptions type is not specified

                            toastr.error('Unable to download with URL = ' + url, {
                                positionClass: 'toast-bottom-left',
                                closeButton: true,
                                timeOut: 10000,
                                extendedTimeOut: 5000,
                                target: 'body'
                            });
                        }
                    });
                } else {
                    toastr.error('No files available to download.');
                }
            }, function error(response) {
                toastr.error('Unable to download files.', {
                    positionClass: 'toast-bottom-left',
                    closeButton: true,
                    timeOut: 10000,
                    extendedTimeOut: 5000,
                    target: 'body'
                });
                console.log('failed', response); // Supposed to have: data, status, headers, config, statusText
            });
        };
    }
})();
