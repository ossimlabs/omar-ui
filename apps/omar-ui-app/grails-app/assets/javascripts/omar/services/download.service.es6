(function() {
  "use strict";
  angular
    .module("omarApp")
    .service("downloadService", [
      "stateService",
      "$stateParams",
      "toastr",
      "$http",
      "$log",
      downloadService
    ]);

  function downloadService(stateService, $stateParams, toastr, $http, $log) {
    // Sets the initial url values for the mensa service
    let baseUrl,
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

      stagerContextPath = stateService.omarSitesState.url.stagerContextPath;
      stagerRequestUrl = baseUrl + stagerContextPath;
    };
    this.setDownloadServiceUrlProps();

    let imageLayerIds;

    let data = {
      type: "Download",
      zipFileName: "",
      archiveOptions: {
        type: "zip"
      },
      ids: []
    };

    this.downloadFiles = function(imageId, zipFileName) {
      $log.debug("Download imageId:", imageId);
      let type = typeof imageId;
      $log.debug("imageId is typeof: ", type);

      let idList = [];

      // Convert the imageId to a number if it is being
      // passed to the function as a string.  The post
      // expects a number or array of numbers
      if (type === "string") {
        imageId = parseInt(imageId);
      }

      downloadManager = downloadRequestUrl;
      dataManager = stagerRequestUrl;

      if (!imageId) {
        imageLayerIds = $stateParams.layers.split(",");
        imageId = imageLayerIds[0];
        idList = imageLayerIds;
      } else {
        idList = imageId;
      }

      let dm = downloadManager + "/archive/download";

      data.ids = idList;
      $log.debug(`Download idList: `, idList);

      data.zipFileName = zipFileName;
      $.fileDownload(dm, {
        httpMethod: "POST",
        dataType: "text",
        contentType: "plain/text",
        data: {
          fileInfo: JSON.stringify(data)
        },
        successCallback: function(url) {
          toastr.success("Files are being downloaded.", {
            positionClass: "toast-bottom-left",
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            target: "body"
          });
        },
        failCallback: function(responseHtml, url, error) {
          //Error will occur if type and archiveOptions type is not specified

          toastr.error("Unable to download with URL = " + url, {
            positionClass: "toast-bottom-left",
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            target: "body"
          });
        }
      });
    };
    this.downloadVideo = (videoUrl) => {
      $.fileDownload(videoUrl, {
        httpMethod: "POST",
        dataType: "text",
        contentType: "plain/text",
        data: {
          fileInfo: JSON.stringify(data)
        },
        successCallback: function(url) {
          toastr.success("Files are being downloaded.", {
            positionClass: "toast-bottom-left",
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            target: "body"
          });
        },
        failCallback: function(responseHtml, url, error) {
          //Error will occur if type and archiveOptions type is not specified

          toastr.error("Unable to download with URL = " + url, {
            positionClass: "toast-bottom-left",
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            target: "body"
          });
        }
      });
    }
  }
})();
