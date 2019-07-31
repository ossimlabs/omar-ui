"use strict";
angular
.module("omarApp")
.service("videoService", [
    "$http",

function($http) { return {
    videoQuery: function (startIndex = 0, maxFeatures = 100) {
        // console.log('executing query... params:', params)
        const baseUrl = AppO2.APP_CONFIG.params.sites.o2.url.base
        let urlParams = new URLSearchParams(window.location.search)
        // let filter = urlParams.get('filter')
        let filter = '';

        const wfsUrl = `${baseUrl}/omar-wfs/wfs?`
        const wfsParams = {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typeName: 'omar:video_data_set',
            filter: filter,
            resultType: 'results',
            outputFormat: 'JSON',
            startIndex: startIndex,
            maxFeatures: maxFeatures
        }

        const queryString = Object.keys(wfsParams).map(key => key + '=' + wfsParams[key]).join('&');

        return $http({
            method: "GET",
            url: wfsUrl + queryString
        })
    }
}}])