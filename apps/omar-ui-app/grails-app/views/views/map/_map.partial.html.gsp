<div ng-controller = "FilterController as filter">
    <nav class = "navbar yamm navbar-default" style = "margin-top: -15px; margin-bottom: 5px;">
        <div class = "container-fluid">
            <div class = "navbar-header">
                <button type = "button" class = "navbar-toggle collapsed" data-toggle = "collapse" data-target = "#bs-example-navbar-collapse-1">
                    <span class = "sr-only">Toggle navigation</span>
                    <span class = "icon-bar"></span>
                    <span class = "icon-bar"></span>
                    <span class = "icon-bar"></span>
                </button>
            </div>
            <div class = "collapse navbar-collapse" id = "map-navbar-collapse">
                <ul class = "nav navbar-nav col-md-4">
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
                    <%-- Handle the filtersearch tab --%>
                    <li role = "presentation">
                        <a data-toggle = "tab" onclick = "javascript: $( '#mapSearch' ).hide(); $( '#reachbackSearch' ).hide(); $( '#filterSearch' ).show(); $( '#reachbackPanelContainer' ).hide(); $( '#imageCardsPanel' ).show()"  >Filters</a>
                    </li>
                    <%-- Handle the mapsearch tab --%>
                    <li class = "active" role = "presentation">
                        <a data-toggle = "tab" onclick = "javascript: $( '#filterSearch' ).hide(); $( '#reachbackSearch' ).hide(); $( '#mapSearch' ).show()">Map</a>
                    </li>
                    <%-- Handle the reachback tab --%>
                    <li role = "presentation">
                        <a data-toggle = "tab" onclick = "javascript: $( '#mapSearch' ).hide(); $( '#filterSearch' ).hide(); $( '#reachbackSearch' ).show(); $( '#reachbackPanelContainer' ).show(); $( '#imageCardsPanel' ).hide()"  >Reachback</a>
                    </li>
                </ul>

                <!--
                Videos Checkbox
                showVideos is bound to the ng-show for the tiles on the right
                If true, it displays the videos returned in the WFS query
                 -->
                <div class="videos-checkbox col-md-2">
                    <input
                        type="checkbox"
                        ng-model="filterVideosToggle"
                        ng-change="filter.getVideos(filterVideosToggle)"
                    > Videos Only
                </div>

                <%--
                <ul class = "nav navbar-nav col-md-4" style = "text-align: center">
                    <form class = "navbar-form navbar-center">
                        <div class = "input-group">
                            <div class = "input-group-addon">
                                <input
                                    ng-change = "filter.updateFilterString()"
                                    ng-model = "filter.imageryCheck"
                                    type = "checkbox">
                                <span>Imagery</span>
                            </div>
                        </div>
                        <div class = "input-group">
                            <div class = "input-group-addon">
                                <input
                                    ng-change = "filter.updateFilterString()"
                                    ng-model = "filter.videoCheck"
                                    type = "checkbox">
                                <span>Video</span>
                            </div>
                        </div>
                    </form>
                </ul>
                --%>
                <ul class = "nav navbar-nav navbar-right col-md-4">
                    <li class = "dropdown pull-right" ng-controller = "ListController as list" ng-show = "list.showSitesSelect">
                        <a class = "dropdown-toggle" data-toggle = "dropdown">
                            <span class = "fa fa-globe"></span>
                            &nbsp;
                            {{ list.selectedOmar.info.description }}
                            <span class = "caret"></span>
                        </a>
                        <ul class = "dropdown-menu">
                            <table class = "table table-hover table-striped">
                                <tr ng-repeat = "site in list.sites">
                                    <td ng-click = "list.selectedOmar = site; list.changeOmarSiteUrl()">
                                        <strong>{{ site.info.description }}</strong>
                                        <br>
                                        <i class = "fa fa-globe"></i>&nbsp;
                                        <small>{{ site.url.base }}</small>
                                    </td>
                                </tr>
                            </table>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="row">
        <!-- Filter / Map Area -->
        <div class = "col-md-8">
            <div class = "tab-content">

                <%-- FILTER SEARCH TAB --%>
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-checked = "!filter.imageryCheck ? false : filter.beNumberCheck"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.beNumberCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input focus-input
                                               ng-disabled = "!filter.imageryCheck"
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-checked = "!filter.imageryCheck ? false : filter.countryCodeCheck"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.countryCodeCheck"
                                                    type="checkbox">
                                        </span>
                                        <input
                                                class = "form-control"
                                                id = "countryCodeInput"
                                                list = "countryCodeList"
                                                ng-blur = "filter.countryCodeCheck = filter.countryCode === '' ? false : true; filter.updateFilterString()"
                                                ng-change = "filter.handleDataList( 'countryCodeInput' )"
                                                ng-disabled = "!filter.imageryCheck"
                                                ng-keyup = "filter.handleDataList( 'countryCodeInput' )"
                                                ng-model = "filter.countryCode"
                                                placeholder = "Country Code">
                                        <datalist id = "countryCodeList">
                                            <option ng-repeat = "val in countryCodeTypes" value="{{val}}">
                                        </datalist>
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-model = "filter.filenameCheck"
                                                    type="checkbox">
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-checked = "!filter.imageryCheck ? false : filter.imageIdCheck"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.imageIdCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input focus-input
                                               ng-disabled = "!filter.imageryCheck"
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
                                        <input
                                                class = "form-control"
                                                id = "missionIdInput"
                                                list = "missionIdList"
                                                ng-blur = "filter.missionIdCheck = filter.missionId === '' ? false : true; filter.updateFilterString()"
                                                ng-change = "filter.handleDataList( 'missionIdInput' )"
                                                ng-keyup = "filter.handleDataList( 'missionIdInput' )"
                                                ng-model = "filter.missionId"
                                                placeholder = "Mission ID">
                                        <datalist id = "missionIdList">
                                            <option ng-repeat = "val in missionIdTypes" value="{{val}}">
                                        </datalist>
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
                                            <input
                                                    ng-change="filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model="filter.productIdCheck"
                                                    type="checkbox">
                                        </span>
                                        <input
                                                class = "form-control"
                                                id = "productIdInput"
                                                list = "productIdList"
                                                ng-disabled = "!filter.imageryCheck"
                                                ng-blur = "filter.productIdCheck = filter.productId === '' ? false : true; filter.updateFilterString()"
                                                ng-change = "filter.handleDataList( 'productIdInput' )"
                                                ng-keyup = "filter.handleDataList( 'productIdInput' )"
                                                ng-model = "filter.productId"
                                                placeholder = "Product ID">
                                        <datalist id = "productIdList">
                                            <option ng-repeat = "val in productIdTypes" value="{{val}}">
                                        </datalist>
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-model = "filter.sensorIdCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input
                                                class = "form-control"
                                                id = "sensorIdInput"
                                                list = "sensorIdList"
                                                ng-blur = "filter.sensorIdCheck = filter.sensorId === '' ? false : true; filter.updateFilterString()"
                                                ng-change = "filter.handleDataList( 'sensorIdInput' )"
                                                ng-keyup = "filter.handleDataList( 'sensorIdInput' )"
                                                ng-model = "filter.sensorId"
                                                placeholder = "Sensor ID">
                                        <datalist id = "sensorIdList">
                                            <option ng-repeat = "val in sensorIdTypes" value="{{val}}">
                                        </datalist>
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-checked = "!filter.imageryCheck ? false : filter.targetIdCheck"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.targetIdCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input focus-input
                                               ng-disabled = "!filter.imageryCheck"
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
                                            <input
                                                    ng-change = "filter.updateFilterString()"
                                                    ng-checked = "!filter.imageryCheck ? false : filter.wacNumberCheck"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.wacNumberCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input focus-input
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.predNiirsCheckNull"
                                            ng-disabled = "!filter.predNiirsCheck || !filter.imageryCheck"
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
                                               ng-disabled = "!filter.imageryCheck"
                                               ng-model = "filter.predNiirsMin"
                                               class = "form-control input-sm"
                                               value = "{{filter.predNiirsMin}}"
                                               min = "0" max = "8.9" step = "0.1"
                                               ng-change = "filter.predNiirsCheck = (filter.predNiirsMin === 0 && filter.predNiirsMax === 9) ? false: true;"
                                               ng-enter = "filter.updateFilterString()"
                                               ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-checked = "!filter.imageryCheck ? false : filter.predNiirsCheck"
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.predNiirsCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "9"
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.azimuthCheckNull"
                                            ng-disabled = "!filter.azimuthCheck || !filter.imageryCheck"
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
                                               ng-checked = "!filter.imageryCheck ? false : filter.azimuthCheck"
                                               ng-disabled = "!filter.imageryCheck"
                                               ng-model = "filter.azimuthMin"
                                               class = "form-control input-sm"
                                               value = "{{filter.azimuthMin}}"
                                               min = "0" max = "359" step = "1"
                                               ng-change = "filter.azimuthCheck = (filter.azimuthMin === 0 && filter.azimuthMax === 360) ? false: true;"
                                               ng-enter = "filter.updateFilterString()"
                                               ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.azimuthCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "360"
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.grazeElevCheckNull"
                                            ng-disabled = "!filter.grazeElevCheck || !filter.imageryCheck"
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
                                               ng-disabled = "!filter.imageryCheck"
                                               ng-model = "filter.grazeElevMin"
                                               class = "form-control input-sm"
                                               value = "{{filter.grazeElevMin}}"
                                               min = "0" max = "89.9" step = "0.1"
                                               ng-change = "filter.grazeElevCheck = (filter.grazeElevMin === 0 && filter.grazeElevMax === 90) ? false: true;"
                                               ng-enter = "filter.updateFilterString()"
                                               ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-checked = "!filter.imageryCheck ? false : filter.grazeElevCheck"
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.grazeElevCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "90"
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.sunAzimuthCheckNull"
                                            ng-disabled = "!filter.sunAzimuthCheck || !filter.imageryCheck"
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
                                               ng-disabled = "!filter.imageryCheck"
                                               ng-model = "filter.sunAzimuthMin"
                                               class = "form-control input-sm"
                                               value = "{{filter.sunAzimuthMin}}"
                                               min = "0" max = "359" step = "1"
                                               ng-change = "filter.sunAzimuthCheck = (filter.sunAzimuthMin === 0 && filter.sunAzimuthMax === 360) ? false: true;"
                                               ng-enter = "filter.updateFilterString()"
                                               ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-checked = "!filter.imageryCheck ? false : filter.sunAzimuthCheck"
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.sunAzimuthCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "360"
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.sunElevationCheckNull"
                                            ng-disabled = "!filter.sunElevationCheck || !filter.imageryCheck"
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
                                               ng-disabled = "!filter.imageryCheck"
                                               ng-model = "filter.sunElevationMin"
                                               class = "form-control input-sm"
                                               value = "{{filter.sunElevationMin}}"
                                               min = "-90" max = "89" step = "1"
                                               ng-change = "filter.sunElevationCheck = (filter.sunElevationMin === -90 && filter.sunElevationMax === 90) ? false: true;"
                                               ng-enter = "filter.updateFilterString()"
                                               ng-blur = "filter.updateFilterString()">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-checked = "!filter.imageryCheck ? false : filter.sunElevationCheck"
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.sunElevationCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "0"
                                               ng-disabled = "!filter.imageryCheck"
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
                                            ng-checked = "!filter.imageryCheck ? false : filter.cloudCoverCheckNull"
                                            ng-disabled = "!filter.cloudCoverCheck || !filter.imageryCheck"
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
                                            <input
                                                    ng-checked = "!filter.imageryCheck ? false : filter.cloudCoverCheck"
                                                    ng-click = "filter.updateFilterString()"
                                                    ng-disabled = "!filter.imageryCheck"
                                                    ng-model = "filter.cloudCoverCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "0"
                                               ng-disabled = "!filter.imageryCheck"
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

                <%-- MAP SEARCH TAB --%>
                <div role = "tabpanel" class = "tab-pane active" id = "mapSearch">
                    <!-- Just activating the search controller -->
                    <div ng-controller = "SearchController as search" style = "display: none;"></div>
                    <div ng-controller = "MapController as map">
                        <div id = "map" class = "map" params = "map.mapParams" map>
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

                <%-- REACHBACK SEARCH TAB --%>
                <div ng-controller = "ReachbackController as reachback" role ="tabpanel" class = "tab-pane" id = "reachbackSearch">
                    <div class = "row">
                        <%-- KEYWORD FILTERS --%>
                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Keyword Filters</h4></div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">Sensor</div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <span class = "input-group-addon">
                                            <input
                                                    ng-change = "reachback.updateFilterString()"
                                                    ng-model = "reachback.sensorIdCheck"
                                                    type = "checkbox">
                                        </span>
                                        <input
                                                class = "form-control"
                                                id = "sensorIdInput"
                                                list = "sensorIdList"
                                                ng-blur = "reachback.sensorIdCheck = reachback.sensorId === '' ? false : true; reachback.updateFilterString()"
                                                ng-change = "reachback.handleDataList( 'sensorIdInput' )"
                                                ng-keyup = "reachback.handleDataList( 'sensorIdInput' )"
                                                ng-model = "reachback.sensorId"
                                                placeholder = "Sensor ID">
                                        <datalist id = "sensorIdList">
                                            <option ng-repeat = "val in sensorIdTypes" value="{{val}}">
                                        </datalist>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <%-- RANGE FILTERS --%>
                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Range Filters</h4></div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-6">
                                    NIIRS
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid value 0 to 9"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <input
                                                ng-checked = "!reachback.imageryCheck ? false : reachback.predNiirsCheck"
                                                ng-click = "reachback.updateFilterString()"
                                                ng-disabled = "!reachback.imageryCheck"
                                                ng-model = "reachback.predNiirsCheck"
                                                type = "checkbox">
                                        </div>
                                        <input focus-input
                                           style = "text-align: center;"
                                           type = "number"
                                           placeholder = "0"
                                           ng-disabled = "!reachback.imageryCheck"
                                           ng-model = "reachback.predNiirsMin"
                                           class = "form-control input-sm"
                                           value = "{{reachback.predNiirsMin}}"
                                           min = "0" max = "8.9" step = "0.1"
                                           ng-change = "reachback.predNiirsCheck = (reachback.predNiirsMin === 0) ? false: true;"
                                           ng-enter = "reachback.updateFilterString()"
                                           ng-blur = "reachback.updateFilterString()">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-6">
                                    Max Results
                                    <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Valid value 0 to 100"></i>
                                </div>
                            </div>
                            <div class = "row">
                                <div class = "col-md-12">
                                    <div class = "input-group input-group-sm">
                                        <div class = "input-group-addon">
                                            <input
                                                    ng-checked = "!reachback.imageryCheck ? false : reachback.predMaxCheck"
                                                    ng-click = "reachback.updateFilterString()"
                                                    ng-disabled = "!reachback.imageryCheck"
                                                    ng-model = "reachback.predMaxCheck"
                                                    type = "checkbox">
                                        </div>
                                        <input focus-input
                                               style = "text-align: center;"
                                               type = "number"
                                               placeholder = "0"
                                               ng-disabled = "!reachback.imageryCheck"
                                               ng-model = "reachback.predMaxFeatures"
                                               class = "form-control input-sm"
                                               value = "{{reachback.predMaxFeatures}}"
                                               min = "0" max = "100" step = "10"
                                               ng-change = "reachback.predMaxCheck = (reachback.predMaxFeatures === 0) ? false: true;"
                                               ng-enter = "reachback.updateFilterString()"
                                               ng-blur = "reachback.updateFilterString()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <%-- TEMPORAL FILTERS --%>
                        <div class = "col-md-4">
                            <div class = "row">
                                <div class = "col-md-12" style = "text-align: center"><h4>Temporal Filters</h4></div>
                            </div>
                            <div class = "row"><div class = "col-md-12">
                                <div>Duration (Acquisition Date)</div>
                                <div>
                                    <select
                                            ng-model="reachback.currentTemporalDuration"
                                            ng-options="duration.label for duration in reachback.temporalDurations"
                                            ng-change="reachback.updateFilterString()"
                                            class="form-control input-sm">
                                    </select>
                                </div>
                            </div></div>

                            <div class = "row" ng-show="reachback.customDateRangeVisible">
                                <div class = "col-md-12">Start Date & Time</div>
                                <div class = "col-md-6">
                                    <input uib-datepicker-popup
                                           type = "text"
                                           class = "form-control input-sm"
                                           ng-change="reachback.updateFilterString()"
                                           ng-click = "reachback.openStartDatePopup()"
                                           ng-model = "reachback.startDate"
                                           is-open="reachback.startDatePopupOpen"
                                           close-text = "Close">
                                </div>
                                <div class = "col-md-6">
                                    <input bs-timepicker
                                           type="text"
                                           class="form-control input-sm"
                                           ng-model="reachback.startDate"
                                           data-time-format="HH:mm:ss"
                                           data-autoclose="false"
                                           data-minute-step="1"
                                           data-second-step="1"
                                           placeholder="Time"
                                           ng-blur="reachback.updateFilterString()">
                                </div>
                            </div>

                            <div class = "row" ng-show="reachback.customDateRangeVisible">
                                <div class = "col-md-12">End Date & Time</div>
                                <div class = "col-md-6">
                                    <input uib-datepicker-popup
                                           type = "text"
                                           class = "form-control input-sm"
                                           ng-change="reachback.updateFilterString()"
                                           ng-click = "reachback.openEndDatePopup()"
                                           ng-model = "reachback.endDate"
                                           is-open="reachback.endDatePopupOpen"
                                           close-text = "Close">
                                </div>
                                <div class = "col-md-6">
                                    <input bs-timepicker
                                           type="text"
                                           size="8"
                                           class="form-control input-sm"
                                           ng-model="reachback.endDate"
                                           data-time-format="HH:mm:ss"
                                           data-autoclose="0"
                                           data-minute-step="1"
                                           data-second-step="1"
                                           placeholder="Time"
                                           ng-change="reachback.updateFilterString()">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "row">
                        <div class = "col-md-12" style = "text-align: center; padding: 12px">
                            <button class = "btn btn-default btn-sm" ng-click = "reachback.clearFilters()">Clear Filters</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class = "col-md-4">

            <!-- Video tiles -->
            <div ng-if="filterVideosToggle" ng-controller="ListController as list">
                <!-- Top Nav -->
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
                                    <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" ng-bind-html="list.currentSortText"><span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li ng-click="list.sortWfs('acquisition_date', '+D', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('acquisition_date', '+A', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('ingest_date', '+D', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('ingest_date', '+A', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('niirs', '+D', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('niirs', '+A', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('title', '+D', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('title', '+A', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('sensor_id', '+D', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('sensor_id', '+A', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider "></li>
                                        <li ng-click="list.sortWfs('mission_id', '+D', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('mission_id', '+A', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
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

                            <!-- Tile Header area -->
                            <ul class = "nav navbar-nav navbar-right">
                                <p class = "navbar-text cursor-default">
                                    <span class = "glyphicon glyphicon-film"></span>
                                    <span
                                            class = "label label-primary"
                                            ng-class = "{'label-info': filter.refreshSpin}"
                                            tooltip-placement = "left"
                                            uib-tooltip = "Number of Search Result Videos">
                                        {{ videoData.features.length }}
                                    </span>
                                </p>
                                <li class = "dropdown">
                                    <a class = "dropdown-toggle navbar-sort-dropdown-toggle"
                                       ng-click = "filter.refreshList()"
                                       tooltip-placement = "bottom"
                                       uib-tooltip = "Refresh the image list data">
                                        &nbsp;
                                        <span class = "fa fa-refresh"
                                              ng-class = "{'fa-spin fa-pulse': filter.refreshSpin}">
                                        </span>
                                        &nbsp;
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div id="video-list" style="border-style: solid; max-height: 65%; border-width: 1px; padding: 10px; border-radius: 4px;">
                    <!-- Error or empty response area -->
                    <div ng-show="videoData.features === 0">
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

                    <!-- Main tile list area -->
                    <!-- filter doesnt work right startFrom:list.videoPage*list.pageLimit -->
                    <div ng-show="slicedVideoData.length >= 1"
                         ng-repeat="video in slicedVideoData | limitTo:list.pageLimit">
                        <div class="panel panel-default cursor-pointer" >
                            <!-- Heading -->
                            <div class="panel-heading"
                                 ng-click="list.addToExportList(video.properties.id)"
                                 style="font-size: 11px; padding: 2px 7px;">
                                <span>
                                    <i class="fa fa-square-o cursor-pointer"
                                    %{--                                   ng-class="{'fa-check-square text-success': list.checkSelectItem(image.properties.id)}"--}%
                                       aria-hidden="true"
                                       style="padding-right: 5px;"
                                       tooltip-placement="left-bottom"
                                       uib-tooltip="Add video to export list">
                                    </i>
                                </span>
                                <span class="text-default cursor-pointer">
                                    <span ng-show="!video.id">Unknown</span>
                                    {{ video.id }}
                                </span>
                            </div>

                            <div class="panel-body">
                                <div class="media">
                                    <div class="media-left" style="position: relative">
                                        <!-- link to video player page -->
                                        <a href="https://omar-dev.ossim.io/omar-video-ui?filter=in({{video.properties.id}})"
                                           target="_blank">
                                            <video
                                                    ng-src="{{ video.properties.videoUrl }}"
                                                    width="175px"
                                                    autoplay loop
                                            ></video>
                                        </a>
                                    </div>

                                    <div class="media-body">
                                        <!-- empty row for alignment -->
                                        <div class="row"></div>

                                        <div class="row">
                                            <div class="col-md-12" style="font-size: 13px;">
                                                <span class = "text-info">
                                                    <span ng-show = "!video.properties.security_classification">
                                                        Security Classification Unknown
                                                    </span>
                                                    <span class = "{{list.getSecurityClassificationClass( image.properties.security_classification )}}">
                                                        {{ image.properties.security_classification }}
                                                    </span>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12" style="font-size: 13px;">
                                                Start Date:
                                                <span class="text-success">
                                                    <span ng-show="!video.properties.start_date">Unknown</span>
                                                    {{ video.properties.start_date | date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}
                                                    <span ng-show="video.properties.start_date">z</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12" style="font-size: 13px;">
                                                End Date:
                                                <span class="text-success">
                                                    <span ng-show="!video.properties.end_date">Unknown</span>
                                                    {{ video.properties.end_date | date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}
                                                    <span ng-show="video.properties.end_date">z</span>
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Video pagination -->
                <div class="text-center" id="pagination">
                    <uib-pagination
                            style="margin: 8px;"
                            total-items="videoData.features.length"
                            items-per-page="list.pageLimit"
                            ng-model="list.currentVideoPage"
                            ng-change="list.videoPageChange(list.currentVideoPage)"
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

            <!-- Imagery tiles -->
            <div id="imageCardsPanel" ng-hide="filterVideosToggle" ng-controller="ListController as list">
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
                                    <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" ng-bind-html="list.currentSortText"><span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li ng-click="list.sortWfs('acquisition_date', '+D', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('acquisition_date', '+A', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('ingest_date', '+D', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('ingest_date', '+A', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('niirs', '+D', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('niirs', '+A', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('title', '+D', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('title', '+A', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider"></li>
                                        <li ng-click="list.sortWfs('sensor_id', '+D', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('sensor_id', '+A', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                        <li role="separator" class="divider "></li>
                                        <li ng-click="list.sortWfs('mission_id', '+D', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                        <li ng-click="list.sortWfs('mission_id', '+A', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
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
                            <ul class = "nav navbar-nav navbar-right">
                                <p class = "navbar-text cursor-default">
                                    <span class = "glyphicon glyphicon-picture"></span>
                                    <span
                                            class = "label label-primary"
                                            ng-class = "{'label-info': filter.refreshSpin}"
                                            tooltip-placement = "left"
                                            uib-tooltip = "Number of Search Result Images">{{filter.totalWfsFeatures}}
                                    </span>
                                    <%--
                                    <span class = "glyphicon glyphicon-film"></span>
                                    <span
                                        class = "label label-primary"
                                        ng-class = "{'label-info': filter.refreshSpin}"
                                        tooltip-placement = "left"
                                        uib-tooltip = "Number of Search Result Videos">0
                                    </span>
                                    --%>
                                </p>
                                <li class = "dropdown">
                                    <a class = "dropdown-toggle navbar-sort-dropdown-toggle"
                                       ng-click = "filter.refreshList()"
                                       tooltip-placement = "bottom"
                                       uib-tooltip = "Refresh the image list data">
                                        &nbsp;
                                        <span class = "fa fa-refresh"
                                              ng-class = "{'fa-spin fa-pulse': filter.refreshSpin}">
                                        </span>
                                        &nbsp;
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div id="list" style="border-style: solid; border-width: 1px; max-height: 65%; padding: 10px; border-radius: 4px;">
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
                                                    class="media-object thumbnail-background"
                                                    tooltip-placement="right"
                                                    uib-tooltip="Click the thumbnail or the image ID to view the raw image"
                                                    height="114"
                                                    width="114"
                                                    style="border:1px solid black"
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

            <!-- Reachback Panel -->
            <div class = "ResultsPane" ng-hide="filterVideosToggle" id = "reachbackPanelContainer" >
                <div class = "Results-tab-heading">
                    <button id="button0" class = "reachbackTabButton" onclick="addClickClass(0,1); switchPanel(false, 0)"> Cards list </button>
                    <button id="button1" class = "reachbackTabButton" onclick="addClickClass(1,0); switchPanel(true, 1)"> JSON </button>
                    <script>
                        let tabButtons = document.querySelectorAll(".ResultsPane .Results-tab-heading button");
                        function addClickClass(index, index1) {
                            let button = '#button' + index.toString();
                            $( button ).removeClass();
                            $( button ).addClass("reachbackTabButtonClicked");
                            revert(index1);
                        }

                        function revert(index) {
                            let button = '#button' + index.toString();
                            $( button ).removeClass("reachbackTabButtonClicked");
                            $( button ).addClass("reachbackTabButton");
                        }

                        // Show either the reachback panel, or the cards list
                        function switchPanel(value, index) {
                            if (value) {
                                $('.cardsPanel').hide();
                                $('.JSONPanel').show();
                            } else {
                                $('.cardsPanel').show();
                                $('.JSONPanel').hide();
                            }
                        }
                    </script>
                </div>

                <!-- Imagery tiles for Reachback -->
                <div class = "cardsPanel" ng-controller="ListController as list">
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
                                        <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" ng-bind-html="list.currentSortText"><span class="caret"></span></a>
                                        <ul class="dropdown-menu">
                                            <li ng-click="list.sortWfs('acquisition_date', '+D', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('acquisition_date', '+A', 'Acquired');"><a>Acquired <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                            <li role="separator" class="divider"></li>
                                            <li ng-click="list.sortWfs('ingest_date', '+D', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('ingest_date', '+A', 'Ingest');"><a>Ingested <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                            <li role="separator" class="divider"></li>
                                            <li ng-click="list.sortWfs('niirs', '+D', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('niirs', '+A', 'NIIRS');"><a>NIIRS <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                            <li role="separator" class="divider"></li>
                                            <li ng-click="list.sortWfs('title', '+D', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('title', '+A', 'Image ID');"><a>Image ID <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                            <li role="separator" class="divider"></li>
                                            <li ng-click="list.sortWfs('sensor_id', '+D', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('sensor_id', '+A', 'Sensor');"><a>Sensor <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
                                            <li role="separator" class="divider "></li>
                                            <li ng-click="list.sortWfs('mission_id', '+D', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-down"></span></a></li>
                                            <li ng-click="list.sortWfs('mission_id', '+A', 'Mission');"><a>Misson <span class = "glyphicon glyphicon-arrow-up"></span></a></li>
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
                                <ul class = "nav navbar-nav navbar-right">
                                    <p class = "navbar-text cursor-default">
                                        <span class = "glyphicon glyphicon-picture"></span>
                                        <span
                                                class = "label label-primary"
                                                ng-class = "{'label-info': filter.refreshSpin}"
                                                tooltip-placement = "left"
                                                uib-tooltip = "Number of Search Result Images">{{filter.totalWfsFeatures}}
                                        </span>
                                        <%--
                                        <span class = "glyphicon glyphicon-film"></span>
                                        <span
                                            class = "label label-primary"
                                            ng-class = "{'label-info': filter.refreshSpin}"
                                            tooltip-placement = "left"
                                            uib-tooltip = "Number of Search Result Videos">0
                                        </span>
                                        --%>
                                    </p>
                                    <li class = "dropdown">
                                        <a class = "dropdown-toggle navbar-sort-dropdown-toggle"
                                           ng-click = "filter.refreshList()"
                                           tooltip-placement = "bottom"
                                           uib-tooltip = "Refresh the image list data">
                                            &nbsp;
                                            <span class = "fa fa-refresh"
                                                  ng-class = "{'fa-spin fa-pulse': filter.refreshSpin}">
                                            </span>
                                            &nbsp;
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>


                    <div id="list" style="border-style: solid; border-width: 1px; max-height: 60%; padding: 10px; border-radius: 4px;">
                        <div ng-show="true">
                            <div>
                                <span class="text-default"><h4 class="text-center"><strong>We did not find any images that match your reachback filters</strong></h4></span>
                                <span class="text-info"><h4 >Check the dates</h4></span>
                                <p>Make sure you provide valid dates for the query.</p>
                                <span class="text-info"><h4>Check the spelling</h4></span>
                                <p>It is possible that one of the Keyword filters has a spelling error.</p>
                                <span class="text-info"><h4>Check range values</h4></span>
                                <p>Make sure that the range values you have submitted are valid for those attributes.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class = "JSONPanel">
                    <div class="resultsInfo"><h4 id="JSONInfo">Showing results</h4></div>
                    <textarea id="reachbackJSON" class="reachbackPanel" ng-controller = "ReachbackController as reachback"/>
                </div>
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
</div>