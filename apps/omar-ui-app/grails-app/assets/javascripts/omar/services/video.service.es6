"use strict";
angular
.module("omarApp")
.service("videoService", [
    "$http",
    "stateService",

function($http, stateService) { return {
    videoQuery: function (startIndex = 0, maxFeatures = 100) {
        // console.log('executing query... params:', params)
        const baseUrl = stateService.omarSitesState.url.base
        // console.log("mey baseUrl: " + stateService.omarSitesState.url.base);
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
        console.log("video query url: " + (wfsUrl + queryString));
        return $http({
            method: "GET",
            url: wfsUrl + queryString
        })
    }
}}])