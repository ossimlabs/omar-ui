"use strict";
angular
.module("omarApp")
.service("videoService", [
    "$http",

function($http) { return {
    videoQuery: function () {
        let urlParams = new URLSearchParams(window.location.search)
        // let filter = urlParams.get('filter')
        let filter = '';

        const wfsUrl = 'https://omar-dev.ossim.io/omar-wfs/wfs?'
        const wfsParams = {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typeName: 'omar:video_data_set',
            filter: filter,
            resultType: 'results',
            outputFormat: 'JSON'
        }

        const queryString = Object.keys(wfsParams).map(key => key + '=' + wfsParams[key]).join('&');

        return $http({
            method: "GET",
            url: wfsUrl + queryString
        })
    }
}}])