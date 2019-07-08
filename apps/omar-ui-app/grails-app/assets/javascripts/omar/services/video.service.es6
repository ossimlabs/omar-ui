"use strict";
angular
.module("omarApp")
.service("videoService", [
    "$http",

function() { return {
    getData: function () {
        console.log('things')

    }
}}])