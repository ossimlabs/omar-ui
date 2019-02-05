<div ng-controller = "FilterController as filter">
    <nav style = "margin-top: -15px; margin-bottom: 5px;" class = "navbar yamm navbar-default">
        <div class = "navbar-header">
            <button type = "button" class = "navbar-toggle collapsed" data-toggle = "collapse" data-target = "#map-navbar-collapse" aria-expanded = "false">
                <span class = "sr-only">Toggle navigation</span>
                <span class = "icon-bar"></span>
                <span class = "icon-bar"></span>
                <span class = "icon-bar"></span>
            </button>
        </div>
        <div class = "container-fluid">
            <div class = "row">
                <div class = "collapse navbar-collapse" id = "map-navbar-collapse">
                    <div class = "col-sm-9">
                        <ul class = "nav navbar-nav nav-tabs">
                            <li class = "dropdown mega-dropdown" tooltip-placement = "bottom" uib-tooltip = "Save/Load Searches">
                                <a class = "dropdown-toggle" data-toggle = "dropdown" role = "button" aria-haspopup = "true" aria-expanded = "false">
                                    <span class = "glyphicon glyphicon-floppy-disk" aria-hidden = "true"></span>
                                    &nbsp;
                                    <span class = "caret"></span>
                                </a>
                                <ul class = "dropdown-menu mega-dropdown-menu row" ng-click = "$event.stopPropagation();">
                                    <li class = "col-sm-12">
                                        <ul>
                                            <li class = "dropdown-header text-center">
                                                <p class = "text-center">Save/Load Searches</p>
                                            </li>
                                            <li class = "metrics-row">
                                                <a class = "btn btn-success btn-block btn-metrics" ng-click = "filter.loadSearch()" role = "button" target = "_blank">Load</a>
                                            </li>
                                            <li class = "metrics-row">
                                                <a class = "btn btn-success btn-block btn-metrics" ng-click="filter.saveSearch()" role = "button" target = "_blank">Save</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li role = "presentation">
                                <a data-toggle = "tab" onclick = "javascript: $( '#mapSearch' ).hide(); $( '#filterSearch' ).show()"  >Filters</a>
                            </li>
                            <li class = "active" role = "presentation">
                                <a data-toggle = "tab" onclick = "javascript: $( '#filterSearch' ).hide(); $( '#mapSearch' ).show()">Map</a>
                            </li>
                        </ul>
                    </div>
                    <div class = "col-md-3">
                        <button class="btn btn-default button-sort-refresh pull-right"
                            ng-click="filter.refreshList()"
                            tooltip-placement="bottom"
                            uib-tooltip="Refresh the image list data">
                                <span class="fa fa-refresh" ng-class="{'fa-spin fa-pulse': filter.refreshSpin}"></span>
                        </button>
                        <span class = "pull-right">&nbsp;&nbsp;&nbsp;</span>
                        <p class="navbar-text navbar-sort-list-number pull-right">
                            <span class="label label-default cursor-default">Total images</span>
                            <span
                                class="label label-primary cursor-default"
                                ng-class="{'label-info': filter.refreshSpin}"
                                tooltip-placement="left"
                                uib-tooltip="Number of Search Result Images">{{filter.totalWfsFeatures}}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="row">
        <div class = "col-md-8">
            <div class = "tab-content">

                <div role ="tabpanel" class = "tab-pane" id = "filterSearch">
                    <div class = "row">
                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Keyword Filters</h4></div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">BE</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.beNumberCheck" type = "checkbox">
                                        </span>
                                        <input focus-input
                                            ng-model = "filter.beNumber"
                                            class = "form-control"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()"
                                            ng-change = "filter.beNumberCheck = filter.beNumber === '' ? false: true;"
                                            placeholder = "Basic Encyclopedia Number"
                                            value = "filter.beNumber">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">CC</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.countryCodeCheck" type="checkbox">
                                        </span>
                                        <ui-select multiple focus-input
                                            close-on-select = "true"
                                            ng-change = "filter.countryCodeCheck = filter.countryCode === '' ? false : true; filter.updateFilterString()"
                                            ng-click = "filter.getDistinctValues('countryCode');"
                                            ng-model = "filter.countryCode"
                                            theme="bootstrap">
                                            <ui-select-match placeholder = "Country Code">{{$item}}</ui-select-match>
                                            <ui-select-choices repeat = "val in countryCodeTypes | filter: $select.search">{{val}}</ui-select-choices>
                                        </ui-select>
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">File</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.filenameCheck" type="checkbox">
                                        </span>
                                        <input focus-input
                                            ng-model = "filter.filename"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()"
                                            ng-change = "filter.filenameCheck = filter.filename === '' ? false: true;"
                                            class = "form-control"
                                            placeholder = "File name"
                                            value = "filter.filename">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">Image</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.imageIdCheck" type = "checkbox">
                                        </span>
                                        <input focus-input
                                            ng-model = "filter.imageId"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()"
                                            ng-change = "filter.imageIdCheck = filter.imageId === '' ? false: true;"
                                            class = "form-control"
                                            placeholder = "Image ID"
                                            value = "filter.imageId">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">Mission</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.missionIdCheck" type="checkbox">
                                        </span>
                                        <ui-select multiple focus-input
                                            close-on-select = "true"
                                            ng-change = "filter.missionIdCheck = filter.missionId === '' ? false : true; filter.updateFilterString()"
                                            ng-click = "filter.getDistinctValues('missionId');"
                                            ng-model = "filter.missionId"
                                            theme = "bootstrap">
                                            <ui-select-match placeholder = "Mission ID">{{$item}}</ui-select-match>
                                            <ui-select-choices repeat = "val in missionIdTypes | filter: $select.search">{{val}}</ui-select-choices>
                                        </ui-select>
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">Product</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change="filter.updateFilterString()" ng-model="filter.productIdCheck" type="checkbox">
                                        </span>
                                        <ui-select multiple focus-input
                                            close-on-select="true"
                                            ng-change="filter.productIdCheck = filter.productId === '' ? false : true; filter.updateFilterString()"
                                            ng-click="filter.getDistinctValues('productId');"
                                            ng-model="filter.productId"
                                            theme="bootstrap">
                                            <ui-select-match placeholder="Product type">{{$item}}</ui-select-match>
                                            <ui-select-choices repeat="val in productIdTypes | filter: $select.search">{{val}}</ui-select-choices>
                                        </ui-select>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-12">Sensor</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.sensorIdCheck" type="checkbox">
                                        </span>
                                        <ui-select multiple focus-input
                                            close-on-select = "true"
                                            ng-change = "filter.sensorIdCheck = filter.sensorId === '' ? false : true; filter.updateFilterString()"
                                            ng-click = "filter.getDistinctValues('sensorId');"
                                            ng-model = "filter.sensorId"
                                            theme = "bootstrap">
                                            <ui-select-match placeholder = "Sensor ID">{{$item}}</ui-select-match>
                                            <ui-select-choices repeat = "val in sensorIdTypes | filter: $select.search">{{val}}</ui-select-choices>
                                        </ui-select>
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">Target</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.targetIdCheck" type = "checkbox">
                                        </span>
                                        <input focus-input
                                            ng-model = "filter.targetId"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()"
                                            ng-change = "filter.targetIdCheck = filter.targetId === '' ? false: true;"
                                            class = "form-control"
                                            placeholder="Target ID"
                                            value="filter.targetId">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">WAC</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input ng-change = "filter.updateFilterString()" ng-model = "filter.wacNumberCheck" type = "checkbox">
                                        </span>
                                        <input focus-input
                                            ng-model = "filter.wacNumber"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()"
                                            ng-change = "filter.wacNumberCheck = filter.wacNumber === '' ? false: true;"
                                            class = "form-control"
                                            placeholder = "World Area Code"
                                            value = "filter.wacNumber">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Range Filters</h4></div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-6">
                                    NIIRS
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range 0 to 9"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.predNiirsCheck"
                                        ng-model = "filter.predNiirsCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "predNiirsCheckNull">UNK</label>
                                    <i class =  "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values ih the NIIRS metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.predNiirsMin"
                                            class = "form-control input-sm"
                                            value = "{{filter.predNiirsMin}}"
                                            min = "0" max = "8.9" step = "0.1"
                                            ng-change = "filter.predNiirsCheck = (filter.predNiirsMin === 0 && filter.predNiirsMax === 9) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.predNiirsCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "9"
                                            ng-model = "filter.predNiirsMax"
                                            class = "form-control input-sm"
                                            value = "{{filter.predNiirsMax}}"
                                            min = "0.1" max = "9" step = "0.1"
                                            ng-change = "filter.predNiirsCheck = (filter.predNiirsMin === 0 && filter.predNiirsMax === 9) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-6">
                                    Azimuth
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range 0 to 360"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.azimuthCheck"
                                        ng-model = "filter.azimuthCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "azimuthCheckNull">UNK</label>
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values ih the Azimuth metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.azimuthMin"
                                            class = "form-control input-sm"
                                            value = "{{filter.azimuthMin}}"
                                            min = "0" max = "359" step = "1"
                                            ng-change = "filter.azimuthCheck = (filter.azimuthMin === 0 && filter.azimuthMax === 360) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.azimuthCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "360"
                                            ng-model = "filter.azimuthMax"
                                            class = "form-control input-sm"
                                            value = "{{filter.azimuthMax}}"
                                            min = "1" max = "360" step = "1"
                                            ng-change = "filter.azimuthCheck = (filter.azimuthMin === 0 && filter.azimuthMax === 360) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-6">
                                    Graze/Elev
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range  0 to 90"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.grazeElevCheck"
                                        ng-model = "filter.grazeElevCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "grazeElevCheckNull">UNK</label>
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values ih the Graze/Elev metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.grazeElevMin"
                                            class = "form-control input-sm"
                                            value = "{{filter.grazeElevMin}}"
                                            min = "0" max = "89.9" step = "0.1"
                                            ng-change = "filter.grazeElevCheck = (filter.grazeElevMin === 0 && filter.grazeElevMax === 90) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.grazeElevCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "90"
                                            ng-model = "filter.grazeElevMax"
                                            class = "form-control input-sm"
                                            value = "{{filter.grazeElevMax}}"
                                            min = "0.1" max = "90" step = "0.1"
                                            ng-change = "filter.grazeElevCheck = (filter.grazeElevMin === 0 && filter.grazeElevMax === 90) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-6">
                                    Sun Azimuth
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range 0 to 360"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.sunAzimuthCheck"
                                        ng-model = "filter.sunAzimuthCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "sunAzimuthCheckNull">UNK</label>
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values ih the Sun Azimuth metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.sunAzimuthMin"
                                            class = "form-control input-sm"
                                            value = "{{filter.sunAzimuthMin}}"
                                            min = "0" max = "359" step = "1"
                                            ng-change = "filter.sunAzimuthCheck = (filter.sunAzimuthMin === 0 && filter.sunAzimuthMax === 360) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.sunAzimuthCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "360"
                                            ng-model = "filter.sunAzimuthMax"
                                            class = "form-control input-sm"
                                            value = "{{filter.sunAzimuthMax}}"
                                            min = "1" max = "360" step = "1"
                                            ng-change = "filter.sunAzimuthCheck = (filter.sunAzimuthMin === 0 && filter.sunAzimuthMax === 360) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-6">
                                    Sun Elevation
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range -90 to 90"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.sunElevationCheck"
                                        ng-model = "filter.sunElevationCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "sunElevationCheckNull">UNK</label>
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values ih the Sun Elevation metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.sunElevationMin"
                                            class = "form-control input-sm"
                                            value = "{{filter.sunElevationMin}}"
                                            min = "-90" max = "89" step = "1"
                                            ng-change = "filter.sunElevationCheck = (filter.sunElevationMin === -90 && filter.sunElevationMax === 90) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.sunElevationCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.sunElevationMax"
                                            class = "form-control input-sm"
                                            value = "{{filter.sunElevationMax}}"
                                            min = "-89" max = "90" step = "1"
                                            ng-change = "filter.sunElevationCheck = (filter.sunElevationMin === -90 && filter.sunElevationMax === 90) ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-6">
                                    Cloud Cover
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid range 0 to 100"></i>
                                </div>
                                <div align = "right" class = "col-md-6">
                                    <input
                                        class = "form-check-input"
                                        type = "checkbox"
                                        ng-disabled = "!filter.cloudCoverCheck"
                                        ng-model = "filter.cloudCoverCheckNull"
                                        ng-click = "filter.updateFilterString()">
                                    <label class = "form-check-label range-include-unknown-label" for = "cloudCoverCheckNull">UNK</label>
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Checking this box will allow results for images with null or unknown values in the Cloud Cover metadata field"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Min</small></span>
                                        </div>
                                        <input readonly
                                        style = "text-align: center;"
                                            type = "number"
                                            class = "form-control input-sm"
                                            value = "0"
                                            min = "-89" max = "90">
                                        <div class = "input-group-addon">
                                            <input ng-click = "filter.updateFilterString()" ng-model = "filter.cloudCoverCheck" type = "checkbox">
                                        </div>
                                        <input focus-input
                                            style = "text-align: center;"
                                            type = "number"
                                            placeholder = "0"
                                            ng-model = "filter.cloudCover"
                                            class = "form-control input-sm"
                                            value = "{{filter.cloudCover}}"
                                            min = "0" max = "100" step = "1"
                                            ng-change = "filter.cloudCoverCheck = filter.cloudCover === 20 ? false: true;"
                                            ng-enter = "filter.updateFilterString()"
                                            ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <span style = "font-family: monospace;"><small>Max</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Temporal Filters</h4></div>
                            </div>

                            <div class = "row"><div class = "col-md-12">
                                <div>Date Type</div>
                                <div>
                                    <select
                                        ng-model="filter.currentDateType"
                                        ng-options="type.label for type in filter.dateTypes"
                                        class="form-control input-sm"
                                        ng-change="filter.updateFilterString()"
                                        ng-enter="filter.updateFilterString()">
                                    </select>
                                </div>
                            </div></div>

                            <div class = "row"><div class = "col-md-12">
                                <div>Duration</div>
                                <div>
                                    <select
                                        ng-model="filter.currentTemporalDuration"
                                        ng-options="duration.label for duration in filter.temporalDurations"
                                        ng-change="filter.updateFilterString()"
                                        class="form-control input-sm">
                                    </select>
                                </div>
                            </div></div>

                            <div class = "row" ng-show="filter.customDateRangeVisible">
                                <div class = "col-md-12">Start Date & Time</div>
                                <div class = "col-md-6">
                                    <input uib-datepicker-popup
                                        type = "text"
                                        class = "form-control input-sm"
                                        ng-change="filter.updateFilterString()"
                                        ng-click = "filter.openStartDatePopup()"
                                        ng-model = "filter.startDate"
                                        is-open="filter.startDatePopupOpen"
                                        close-text = "Close">
                                </div>
                                <div class = "col-md-6">
                                    <input bs-timepicker
                                        type="text"
                                        class="form-control input-sm"
                                        ng-model="filter.startDate"
                                        data-time-format="HH:mm:ss"
                                        data-autoclose="false"
                                        data-minute-step="1"
                                        data-second-step="1"
                                        placeholder="Time"
                                        ng-blur="filter.updateFilterString()">
                                </div>
                            </div>

                            <div class = "row" ng-show="filter.customDateRangeVisible">
                                <div class = "col-md-12">End Date & Time</div>
                                <div class = "col-md-6">
                                    <input uib-datepicker-popup
                                        type = "text"
                                        class = "form-control input-sm"
                                        ng-change="filter.updateFilterString()"
                                        ng-click = "filter.openEndDatePopup()"
                                        ng-model = "filter.endDate"
                                        is-open="filter.endDatePopupOpen"
                                        close-text = "Close">
                                </div>
                                <div class = "col-md-6">
                                    <input bs-timepicker
                                        type="text"
                                        size="8"
                                        class="form-control input-sm"
                                        ng-model="filter.endDate"
                                        data-time-format="HH:mm:ss"
                                        data-autoclose="0"
                                        data-minute-step="1"
                                        data-second-step="1"
                                        placeholder="Time"
                                        ng-change="filter.updateFilterString()">
                                </div>
                            </div>

                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Map Filters</h4></div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center">
                                    <input type="checkbox"
                                        ng-model="filter.viewPortSpatial"
                                        ng-change="filter.byViewPort(filter.viewPortSpatial)">
                                    Map View
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "This filter is on by default.  It constrains the query to the boundaries of the current map extent"></i>
                                    &nbsp;&nbsp;
                                    <input type="checkbox"
                                        ng-model="filter.pointSpatial"
                                        ng-change="filter.byPointer(filter.pointSpatial)">
                                    Point
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Single clicking on the map will return a potential list of images at that location"></i>
                                    &nbsp;&nbsp;
                                    <input type="checkbox"
                                        ng-model="filter.polygonSpatial"
                                        ng-change="filter.byPolygon(filter.polygonSpatial)">
                                    Polygon
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Left-click and hold with the ALT key to create a box that will return a potential list of images"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "row">
                        <div class = "col-md-12" style = "text-align: center">
                            <button class = "btn btn-default btn-sm" ng-click = "filter.clearFilters()">Clear Filters</button>
                        </div>
                    </div>
                </div>

                <div role = "tabpanel" class = "tab-pane active" id = "mapSearch">
                    <div ng-controller = "MapController as map">
                        <div id = "map" class = "map" params = "map.mapParams" map>
                            <form id = "searchForm" class="searchForm">
                                <div class = "input-group input-group-sm" ng-controller = "SearchController as search">
                                    <input class = "form-control" id = "searchInput" ng-model="search.searchInput" placeholder = "BE, Coordinate, Image ID or Placename" type = "text">
                                    <span class = "input-group-btn">
                                        <button class = "btn btn-info" ng-click = "search.executeSearch()" ng-disabled = "search.searchButtonDisabled" id = "searchButton" type = "button">
                                            <span class = "glyphicon glyphicon-search"></span>
                                        </button>
                                        <button class = "btn btn-default" id = "searchClearButton" ng-click = "search.resetSearchInput()" type = "button">
                                            <span class = "glyphicon glyphicon-remove"></span>
                                        </button>
                                    </span>
                                </div>
                            </form>
                            <div id = "legend" style = "background-color: white; border: 1px solid white; border-radius: 5px; color: black;">
                                <div class = "text-center"><b>{{map.legendTitle}}</b></div>
                                <img alt = "{{map.legendTitle}}" src = "{{map.legendUrl}}">
                            </div>
                        </div>
                        <div id = "mouseCoords" class = "map-cord-div" tooltip-popup-delay="300" tooltip-placement = "top" uib-tooltip = "Click on the coordinates to change units."></div>
                        <div id = "popup" class = "ol-popup">
                            <div id = "popup-content"></div>
                        </div>
                        <div id = "progress" class = "text-info">
                            <i class = "fa fa-spinner fa-spin fa-4x"></i>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class = "col-md-4" ng-controller="ListController as list">
            <ui-select
                class="form-control omar-sites-select"
                ng-model="list.selectedOmar"
                theme="bootstrap"
                on-select="list.changeOmarSiteUrl()"
                ng-show="list.showSitesSelect">
                <ui-select-match placeholder="{{list.selectedUrl}}">
                    <div>{{$select.selected.info.description}}</div>
                </ui-select-match>
                <ui-select-choices repeat="site in list.sites | filter: $select.search">
                    <div>
                        <strong ng-bind="site.info.description"></strong>
                    </div>
                    <div>
                        <i class="fa fa-globe text-muted" aria-hidden="true"></i>&nbsp;
                        <em><small class="text-muted" ng-bind="site.url.base"></small></em>
                    </div>
                </ui-select-choices>
            </ui-select>
            <div class="visible-xs-block visible-sm-block">
                <hr>
            </div>
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button
                            type="button"
                            class="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#sort-navbar-collapse"
                            aria-expanded="false">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                        </button>
                    </div>
                    <div class="collapse navbar-collapse" id="sort-navbar-collapse">
                        <ul class="nav navbar-nav">
                            <li class="dropdown">
                                <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{list.currentSortText}}<span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li ng-click="list.sortWfs('acquisition_date', '+D', 'Acquired (New)');"><a>Acquired (New)</a></li>
                                    <li ng-click="list.sortWfs('acquisition_date', '+A', 'Acquired (Old)');"><a>Acquired (Old)</a></li>
                                    <li role="separator" class="divider sort-menu-divider"></li>
                                    <li ng-click="list.sortWfs('ingest_date', '+D', 'Ingest (New)');"><a>Ingested (New)</a></li>
                                    <li ng-click="list.sortWfs('ingest_date', '+A', 'Ingest (Old)');"><a>Ingested (Old)</a></li>
                                    <li role="separator" class="divider sort-menu-divider"></li>
                                    <li ng-click="list.sortWfs('niirs', '+D', 'NIIRS (High Rating)');"><a>NIIRS (High Rating)</a></li>
                                    <li ng-click="list.sortWfs('niirs', '+A', 'NIIRS (Low Rating)');"><a>NIIRS (Low Rating)</a></li>
                                    <li role="separator" class="divider sort-menu-divider"></li>
                                    <li ng-click="list.sortWfs('title', '+D', 'Image ID (Desc)');"><a>Image ID (Desc)</a></li>
                                    <li ng-click="list.sortWfs('title', '+A', 'Image ID (Asc)');"><a>Image ID (Asc)</a></li>
                                    <li role="separator" class="divider sort-menu-divider"></li>
                                    <li ng-click="list.sortWfs('sensor_id', '+A', 'Sensor (Asc)');"><a>Sensor (Asc)</a></li>
                                    <li ng-click="list.sortWfs('sensor_id', '+D', 'Sensor (Desc)');"><a>Sensor (Desc)</a></li>
                                    <li role="separator" class="divider "></li>
                                    <li ng-click="list.sortWfs('mission_id', '+A', 'Mission (Asc)');"><a>Misson (Asc)</a></li>
                                    <li ng-click="list.sortWfs('mission_id', '+D', 'Mission (Desc)');"><a>Misson (Desc)</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a class="dropdown-toggle navbar-sort-dropdown-toggle"
                                    data-toggle="dropdown"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false">{{list.exportSelectedButtonText}}
                                    <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li class="dropdown-header">Use the checkboxes on the image cards to </li>
                                    <li class="dropdown-header">select individual images. They can then be</li>
                                    <li class="dropdown-header"> downloaded, exported, or viewed in</li>
                                    <li class="dropdown-header">applications</li>
                                    <li class="divider" ng-if="list.showSelectedButton"></li>
                                    <li role="menuitem" ng-click="list.downloadSelectedImages()" ng-if="list.showSelectedButton">
                                        <a href="">Download
                                            <i class="fa fa-info-circle text-info" style="font-size: 12px;" aria-hidden="true" tooltip-placement="left-bottom" uib-tooltip="A maximum of 10 can be downloaded at one time"></i>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    <li class="dropdown-header">
                                        Exports
                                        <i class="fa fa-info-circle text-info" tooltip-placement="left-bottom" uib-tooltip="Export the selected images into the following formats"></i>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('CSV')">
                                        <a href="">CSV</a>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('GML2')">
                                        <a href="">GML2</a>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('GML3')">
                                        <a href="">GML3</a>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('GML32')">
                                        <a href="">GML32</a>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('JSON')">
                                        <a href="">JSON</a>
                                    </li>
                                    <li role="menuitem" ng-click="list.exportSelectedImages('KML')">
                                        <a href="">KML</a>
                                    </li>
                                    <li role="separator" class="divider" ng-if="!list.showSelectedButton"></li>
                                    <li class="dropdown-header" ng-if="!list.showSelectedButton">
                                        Create a GeoRSS feed of the images
                                        <i class="fa fa-info-circle text-info" aria-hidden="true" tooltip-placement="left-bottom" uib-tooltip="A browser extension is required for Internet Explorer and Chrome.  Firefox has built in support for RSS feeds."></i>
                                    </li>
                                    <li>
                                        <a ng-href="" target="_blank" ng-click="list.getGeoRss()" ng-if="!list.showSelectedButton">GeoRSS</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li class="dropdown-header">Applications
                                        <i class="fa fa-info-circle text-info" aria-hidden="true" tooltip-placement="left-bottom" uib-tooltip="A maximum of 100 can be viewed per application"></i>
                                    </li>
                                    <li role="menuitem" ng-click="list.viewSelectedImagesApp('tlv')">
                                        <a href="">TLV</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li role="menuitem" ng-class="{'disabled': !list.showSelectedButton}" ng-click="list.clearSelectedImages(); list.clearSelectedMosaicImages()">
                                        <a href="">
                                            Clear Selected
                                            <i class="fa fa-info-circle text-info" aria-hidden="true" tooltip-placement="left-bottom" uib-tooltip="Remove all currently selected image cards"></i>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div id="list" style="border-style: solid; border-width: 1px; padding: 10px; border-radius: 4px;">
                <div ng-show="list.wfsData.length === 0">
                    <div>
                        <span class="text-default"><h4 class="text-center"><strong>We did not find any images that match your search filters</strong></h4></span>
                        <span class="text-info"><h4 >Check the dates</h4></span>
                        <p>Make sure you provide valid dates for the query.  Also, make sure you are searching for the appropriate date type (acquisition versus ingest).</p>
                        <span class="text-info"><h4>Check the spelling</h4></span>
                        <p>It is possible that one of the Keyword filters has a spelling error.</p>
                        <span class="text-info"><h4>Check range values</h4></span>
                        <p>Make sure that the range values you have submitted are valid for those attributes.</p>
                        <span class="text-info"><h4 class="text-info">Check your map extent</h4></span>
                        <p>The map extent is also a filter for the images.  Make sure the map is zoomed out to an appropriate extent for your search.</p>
                    </div>
                </div>
                <div ng-show="list.wfsFeatures >= 1"
                    ng-repeat="image in list.wfsData" ng-init="list.showProcessInfo=[]"
                    ng-model="image">
                    <div class="panel panel-default cursor-pointer" >
                        <div class="panel-heading"
                            ng-click="list.addRemoveCards(image.properties.id)"
                            style="font-size: 11px; padding: 2px 7px;">
                            <span>
                                <i class="fa fa-square-o cursor-pointer"
                                    ng-class="{'fa-check-square text-success': list.checkSelectItem(image.properties.id)}"
                                    aria-hidden="true"
                                    style="padding-right: 5px;"
                                    tooltip-placement="left-bottom"
                                    uib-tooltip="Add image to selected list">
                                </i>
                            </span>
                            <span class="text-default cursor-pointer">
                                <span ng-show="!image.properties.title">Unknown</span>
                                {{image.properties.title}}
                            </span>
                        </div>
                        <div class="panel-body"
                            ng-mouseenter="list.displayFootprint(image);"
                            ng-mouseleave="list.removeFootprint();">
                            <div class="media">
                                <div class="media-left" style="position: relative">
                                    <a
                                        href="{{list.o2baseUrl}}/#/mapImage?filename={{image.properties.filename}}&entry_id={{image.properties.entry_id}}&width={{image.properties.width}}&numResLevels={{image.properties.number_of_res_levels}}&height={{image.properties.height}}&bands={{list.imageSpaceDefaults.bands}}&numOfBands={{image.properties.number_of_bands}}&imageId={{image.properties.id}}&brightness={{list.imageSpaceDefaults.brightness}}&contrast={{list.imageSpaceDefaults.contrast}}&histOp={{list.imageSpaceDefaults.histOp}}&histCenterTile={{list.imageSpaceDefaults.histCenterTile}}&resamplerFilter={{list.imageSpaceDefaults.resamplerFilter}}&sharpenMode={{list.imageSpaceDefaults.sharpenMode}}&imageRenderType={{list.imageSpaceDefaults.imageRenderType}}&imageSpaceRequestUrl={{list.imageSpaceRequestUrl}}&uiRequestUrl={{list.uiRequestUrl}}&mensaRequestUrl={{list.mensaRequestUrl}}&wfsRequestUrl={{list.wfsRequestUrl}}&wmsRequestUrl={{list.wmsRequestUrl}}&showModalSplash=false"
                                        target="_blank">
                                        <img
                                            class="media-object"
                                            tooltip-placement="right"
                                            uib-tooltip="Click the thumbnail or the image ID to view the raw image"
                                            height="114"
                                            width="114"
                                            ng-src="{{list.thumbPath}}?{{list.thumbFilename}}{{image.properties.filename}}{{list.thumbId}}{{image.properties.id}}{{list.thumbEntry}}{{image.properties.entry_id}}&size={{list.thumbSize}}&outputFormat={{list.thumbFormat}}&transparent={{list.thumbTransparent}}&padThumbnail={{list.padThumbnail}}">&nbsp;
                                    </a>
                                    <div class="well text-center jpip-loading-overlay" ng-show="list.showProcessInfo[$index]">
                                        <span style="font-size: .8em">{{list.processType}}</span><i class="fa fa-cog fa-spin text-info"></i>
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="row"></div>
                                    <div class="row">
                                        <div class="col-md-12" style="font-size: 13px;">
                                            Acquisition Date:&nbsp;&nbsp;
                                            <span class="text-success">
                                                <span ng-show="!image.properties.acquisition_date">Unknown</span>
                                                {{image.properties.acquisition_date | date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}
                                                <span ng-show="image.properties.acquisition_date">z</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12" style="font-size: 13px;">
                                            <span class = "text-info">
                                                <span ng-show = "!image.properties.security_classification">
                                                    Security Classification Unknown
                                                </span>
                                                <span class = "{{list.getSecurityClassificationClass( image.properties.security_classification )}}">
                                                    {{ image.properties.security_classification }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12" style="font-size: 13px;">
                                                Sensor:&nbsp;&nbsp;
                                                <span class="text-success">
                                                    <span ng-show="!image.properties.sensor_id">Unknown</span>
                                                    {{image.properties.sensor_id}}
                                                </span>
                                                &nbsp;&nbsp;
                                                <span ng-show="image.properties.valid_model">
                                                    <span class = "glyphicon glyphicon-ok text-success"></span>
                                                    <span class = "text-success">Valid Model</span>
                                                </span>
                                                <span ng-show="!image.properties.valid_model">
                                                    <span class = "text-info">Model: N/A</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12" style="font-size: 13px;">
                                            Country Code:&nbsp;&nbsp;
                                            <span class="text-success">
                                                <span ng-show="!image.properties.country_code">Unknown</span>
                                                    {{image.properties.country_code}}
                                                </span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12" style="font-size: 13px;">
                                            NIIRS:&nbsp;&nbsp;
                                            <span class="text-success">
                                                <span ng-show="!image.properties.niirs">Unknown</span>
                                                {{image.properties.niirs}}
                                            </span>
                                            &nbsp;&nbsp;/&nbsp;&nbsp;
                                            GSD:&nbsp;&nbsp;
                                            <span class="text-success">
                                                <span ng-show="!image.properties.gsdy">Unknown</span>
                                                {{image.properties.gsdy | number:4}} m
                                            </span>
                                        </div>
                                    </div>
                                    <div class="btn-group btn-group-sm" role="group" aria-label="card-buttons">
                                        <a class="btn btn-default" type="button"
                                            ng-click="list.zoomToSelectedImage(image.properties.id);">
                                            <i class="fa fa-arrows text-default" tooltip-placement="right" uib-tooltip="Zoom to the image extent"></i>
                                        </a>
                                        <a class="btn btn-default" type="button"
                                            ng-click="list.showImageModal(image, list.imageSpaceDefaults, list.imageSpaceRequestUrl, list.uiRequestUrl, list.mensaRequestUrl, list.wfsRequestUrl, list.tlvRequestUrl, list.kmlRequestUrl);list.openTab('metadata');">
                                            <i class="fa fa-table text-default" tooltip-placement="pull-right" uib-tooltip="View image metadata"></i>
                                        </a>
                                        <a class="btn btn-default" type="button"
                                            ng-click="list.viewOrtho(image)">
                                            <i class="fa fa-history text-default" tooltip-placement="right" uib-tooltip="View rectified image in TLV"></i>
                                        </a>
                                        <a class="btn btn-default" type="button"
                                            ng-click="list.showImageModal(image, list.imageSpaceDefaults, list.imageSpaceRequestUrl, list.uiRequestUrl, list.mensaRequestUrl, list.wfsRequestUrl, list.tlvRequestUrl, list.kmlRequestUrl);list.openTab('toolbox');"
                                            >
                                            <i class="fa fa-wrench text-default" tooltip-placement="right" uib-tooltip="View image toolbox"></i>
                                        </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center" id = "pagination">
            <uib-pagination style="margin: 8px;"
                total-items="list.wfsFeaturesTotalPaginationCount"
                items-per-page="list.pageLimit"
                ng-model="list.currentStartIndex"
                ng-change="list.pagingChanged()"
                max-size="5"
                boundary-links="true"
                force-ellipses="true"
                rotate="false"
                first-text="First"
                last-text="Last"
                class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;">
            </uib-pagination>
        </div>
    </div>
</div>

<!-- right-click context menu -->
<div class="modal" id="contextMenuDialog" role="dialog" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4>You Clicked Here:</h4></div>
            <div align="center" class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
