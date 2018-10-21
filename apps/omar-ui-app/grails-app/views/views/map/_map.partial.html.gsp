<div ng-controller="FilterController as filter">
  <div class="container-fluid" ng-show="filter.showCurrentFilter">
    <div class="row"
    style="
      margin-top: -16px;
      margin-bottom: 18px;">
      <div class="col-sm-12">
        <button class="btn btn-default btn btn-xs" ng-click="filter.clearFilters()">Clear Filters</button>
        <span class="tag label label-info cursor-default">{{filter.currentSpatialFilter}}</span>
        <span ng-repeat="filter in filter.currentAttrFilterArray">
          <span class="tag label label-primary cursor-default">
            {{filter}}
            <!-- <a><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a> -->
          </span>
        </span>
      </div>
    </div>
  </div>
  <nav style="margin-top: -15px; margin-bottom: 5px;" class="navbar yamm navbar-default">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
        data-target="#map-navbar-collapse" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="collapse navbar-collapse" id="map-navbar-collapse">
          <div class="col-sm-9">
            <ul class="nav navbar-nav">
              <p class="navbar-text">Filters:</p>
              <li class="dropdown mega-dropdown">
                <a class="dropdown-toggle keyword-filter-dropdown" data-toggle="dropdown" role="button" aria-haspopup="true"
                  aria-expanded="false"><span class="fa fa-key" aria-hidden="true"></span>
                  &nbsp;Keyword
                  <span
                    class="text-info filter-indicator"
                    ng-show="filter.filterKeywordIndicator"
                    uib-tooltip="Indicates a keyword filter is being applied"
                    tooltip-placement="right">&#9679;</span>
                <span class="caret"></span></a>
                <ul class="dropdown-menu mega-dropdown-menu row" ng-click="$event.stopPropagation();">
                  <li class="col-sm-12">
                    <ul>
                      <li class="dropdown-header text-center">Keyword Filters</li>
                      <li class="text-center">
                        <p>Click in the input boxes or use the checkboxes next to the keyword parameters to use them
                        as filters</p>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-12">
                    <table style="border-spacing: 0 5" width = "100%">
                      <tr>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.beNumberCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">BE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input
                              focus-input
                              ng-model="filter.beNumber"
                              class="form-control"
                              ng-enter="filter.updateFilterString()"
                              ng-blur="filter.updateFilterString()"
                              ng-change="filter.beNumberCheck = filter.beNumber === '' ? false: true;"
                              id="beNumberInput"
                              placeholder="Basic Encyclopedia Number"
                              value="filter.beNumber">
                          </div>
                        </td>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.missionIdCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">Mission</span>
                            <ui-select
                              multiple
                              focus-input
                              close-on-select="true"
                              id="missionIdInput"
                              ng-change="filter.missionIdCheck = filter.missionId === '' ? false : true; filter.updateFilterString()"
                              ng-click="filter.getDistinctValues('missionId');"
                              ng-model="filter.missionId"
                              theme="bootstrap">
                              <ui-select-match placeholder="Mission ID">
                                  {{$item}}
                              </ui-select-match>
                              <ui-select-choices repeat="val in missionIdTypes | filter: $select.search">
                                  {{val}}
                              </ui-select-choices>
                            </ui-select>
                          </div>
                        </td class="filter-row">
                      </tr>
                      <tr>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.countryCodeCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">CC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <ui-select
                              multiple
                              focus-input
                              close-on-select="true"
                              id="countryCodeInput"
                              ng-change="filter.countryCodeCheck = filter.countryCode === '' ? false : true; filter.updateFilterString()"
                              ng-click="filter.getDistinctValues('countryCode');"
                              ng-model="filter.countryCode"
                              theme="bootstrap">
                              <ui-select-match placeholder="Country Code">
                                {{$item}}
                              </ui-select-match>
                              <ui-select-choices repeat="val in countryCodeTypes | filter: $select.search">
                                {{val}}
                              </ui-select-choices>
                            </ui-select>
                          </div>
                        </td>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.sensorIdCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">Sensor&nbsp;</span>
                            <ui-select
                              multiple
                              focus-input
                              close-on-select="true"
                              id="sensorIdInput"
                              ng-change="filter.sensorIdCheck = filter.sensorId === '' ? false : true; filter.updateFilterString()"
                              ng-click="filter.getDistinctValues('sensorId');"
                              ng-model="filter.sensorId"
                              theme="bootstrap">
                              <ui-select-match placeholder="Sensor ID">
                                {{$item}}
                              </ui-select-match>
                              <ui-select-choices repeat="val in sensorIdTypes | filter: $select.search">
                                {{val}}
                              </ui-select-choices>
                            </ui-select>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.filenameCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">File&nbsp;&nbsp;&nbsp;</span>
                            <input
                              focus-input
                              ng-model="filter.filename"
                              ng-enter="filter.updateFilterString()"
                              ng-blur="filter.updateFilterString()"
                              ng-change="filter.filenameCheck = filter.filename === '' ? false: true;"
                              class="form-control"
                              id="filenameInput"
                              placeholder="File name"
                              value="filter.filename">
                          </div>
                        </td>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.targetIdCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">Target&nbsp;</span>
                            <input
                              focus-input
                              ng-model="filter.targetId"
                              ng-enter="filter.updateFilterString()"
                              ng-blur="filter.updateFilterString()"
                              ng-change="filter.targetIdCheck = filter.targetId === '' ? false: true;"
                              class="form-control"
                              id="targetIdInput"
                              placeholder="Target ID"
                              value="filter.targetId">
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.imageIdCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">Image&nbsp;&nbsp;&nbsp;</span>
                            <input
                            focus-input
                              ng-model="filter.imageId"
                              ng-enter="filter.updateFilterString()"
                              ng-blur="filter.updateFilterString()"
                              ng-change="filter.imageIdCheck = filter.imageId === '' ? false: true;"
                              class="form-control"
                              id="imageIdInput"
                              placeholder="Image ID"
                              value="filter.imageId">
                          </div>
                        </td>
                        <td class="filter-row">
                          <div class="input-group input-group-sm">
                            <span class="input-group-addon">
                              <input
                                type="checkbox"
                                ng-model="filter.wacNumberCheck"
                                ng-change="filter.updateFilterString()">
                            </span>
                            <span class="input-group-addon name">WAC&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input
                              focus-input
                              ng-model="filter.wacNumber"
                              ng-enter="filter.updateFilterString()"
                              ng-blur="filter.updateFilterString()"
                              ng-change="filter.wacNumberCheck = filter.wacNumber === '' ? false: true;"
                              class="form-control"
                              id="wacNumberInput"
                              placeholder="World Area Code"
                              value="filter.wacNumber">
                          </div>
                        </td>
                      </tr>
                    </table>
                    <br>
                  </li>
                  <li class="col-sm-12">
                    <ul>
                      <li class="filter-row text-center">
                        <button class="btn btn-primary btn-xs" type="button"
                          ng-click="filter.initKeywords(true);">Reset Keyword Filters
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown mega-dropdown">
                <a class="dropdown-toggle range-filter-dropdown" data-toggle="dropdown" role="button" aria-haspopup="true"
                  aria-expanded="false"><span class="fa fa-sliders" aria-hidden="true"></span>
                  &nbsp;Ranges
                  <span
                    ng-show="filter.filterRangeIndicator"
                    class="text-info filter-indicator"
                    uib-tooltip="Indicates a range filter is being applied"
                    tooltip-placement="right">&#9679;</span>
                  <span class="caret"></span></a>
                <ul class="dropdown-menu mega-dropdown-menu row" ng-click="$event.stopPropagation();">
                  <li class="col-sm-12">
                    <ul>
                      <li class="dropdown-header text-center">
                        <p class="text-center">Range Filters</p>
                      </li>
                      <li class="text-center">
                        <p>Click the checkbox next to the range parameter below to use it as a filter</p>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.predNiirsCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">NIIRS</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.predNiirsMin"
                          class="form-control input-sm"
                          id="niirsMin"
                          value="{{filter.predNiirsMin}}"
                          step="0.1"
                          min="0"
                          max="8.9"
                          focus-input
                          ng-change="filter.predNiirsCheck = (filter.predNiirsMin === 0 && filter.predNiirsMax === 9) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                    </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="9"
                          ng-model="filter.predNiirsMax"
                          class="form-control input-sm"
                          id="niirsMin"
                          value="{{filter.predNiirsMax}}"
                          step="0.1"
                          min="0.1"
                          max="9"
                          focus-input
                          ng-change="filter.predNiirsCheck = (filter.predNiirsMin === 0 && filter.predNiirsMax === 9) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Valid range 0 to 9"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ng-disabled="!filter.predNiirsCheck"
                            ng-model="filter.predNiirsCheckNull"
                            ng-click="filter.updateFilterString()">
                          <label
                            class="form-check-label range-include-unknown-label"
                            for="predNiirsCheckNull">
                            Include Unknown
                          </label>
                          <i
                            class="fa fa-info-circle text-info"
                            aria-hidden="true"
                            uib-tooltip="Checking this box will allow results for images with null or unknown values ih the NIIRS metadata field"></i>
                        </div>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.azimuthCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">Azimuth</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.azimuthMin"
                          class="form-control input-sm"
                          id="azimuthMin"
                          value="{{filter.azimuthMin}}"
                          step="1"
                          min="0"
                          max="359"
                          focus-input
                          ng-change="filter.azimuthCheck = (filter.azimuthMin === 0 && filter.azimuthMax === 360) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="360"
                          ng-model="filter.azimuthMax"
                          class="form-control input-sm"
                          id="azimuthMax"
                          value="{{filter.azimuthMax}}"
                          step="1"
                          min="1"
                          max="360"
                          focus-input
                          ng-change="filter.azimuthCheck = (filter.azimuthMin === 0 && filter.azimuthMax === 360) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Valid range 0 to 360"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ng-disabled="!filter.azimuthCheck"
                          ng-model="filter.azimuthCheckNull"
                          ng-click="filter.updateFilterString()">
                        <label
                          class="form-check-label range-include-unknown-label"
                          for="azimuthCheckNull">
                          Include Unknown
                        </label>
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Checking this box will allow results for images with null or unknown values ih the Azimuth metadata field"></i>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.grazeElevCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">Graze/Elev</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.grazeElevMin"
                          class="form-control input-sm"
                          id="grazeElevMin"
                          value="{{filter.grazeElevMin}}"
                          step="0.1"
                          min="0"
                          max="89.9"
                          focus-input
                          ng-change="filter.grazeElevCheck = (filter.grazeElevMin === 0 && filter.grazeElevMax === 90) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li
                        class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="90"
                          ng-model="filter.grazeElevMax"
                          class="form-control input-sm"
                          id="grazeElevMax"
                          value="{{filter.grazeElevMax}}"
                          step="0.1"
                          min="0.1"
                          max="90"
                          focus-input
                          ng-change="filter.grazeElevCheck = (filter.grazeElevMin === 0 && filter.grazeElevMax === 90) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Valid range  0 to 90"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ng-disabled="!filter.grazeElevCheck"
                          ng-model="filter.grazeElevCheckNull"
                          ng-click="filter.updateFilterString()">
                        <label
                          class="form-check-label range-include-unknown-label"
                          for="grazeElevCheckNull">
                          Include Unknown
                        </label>
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Checking this box will allow results for images with null or unknown values ih the Graze/Elev metadata field"></i>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.sunAzimuthCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">Sun Azimuth</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.sunAzimuthMin"
                          class="form-control input-sm"
                          id="sunAzimuthMin"
                          value="{{filter.sunAzimuthMin}}"
                          step="1"
                          min="0"
                          max="359"
                          focus-input
                          ng-change="filter.sunAzimuthCheck = (filter.sunAzimuthMin === 0 && filter.sunAzimuthMax === 360) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li
                        class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="360"
                          ng-model="filter.sunAzimuthMax"
                          class="form-control input-sm"
                          id="sunAzimuthMax"
                          value="{{filter.sunAzimuthMax}}"
                          step="1"
                          min="1"
                          max="360"
                          focus-input
                          ng-change="filter.sunAzimuthCheck = (filter.sunAzimuthMin === 0 && filter.sunAzimuthMax === 360) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                        class="fa fa-info-circle text-info"
                        aria-hidden="true"
                        uib-tooltip="Valid range 0 to 360"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ng-disabled="!filter.sunAzimuthCheck"
                          ng-model="filter.sunAzimuthCheckNull"
                          ng-click="filter.updateFilterString()">
                        <label
                          class="form-check-label range-include-unknown-label"
                          for="sunAzimuthCheckNull">
                          Include Unknown
                        </label>
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Checking this box will allow results for images with null or unknown values ih the Sun Azimuth metadata field"></i>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.sunElevationCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">Sun Elevation</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.sunElevationMin"
                          class="form-control input-sm"
                          id="sunElevationMin"
                          value="{{filter.sunElevationMin}}"
                          step="1"
                          min="-90"
                          max="89"
                          focus-input
                          ng-change="filter.sunElevationCheck = (filter.sunElevationMin === -90 && filter.sunElevationMax === 90) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li
                        class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.sunElevationMax"
                          class="form-control input-sm"
                          id="sunElevationMax"
                          value="{{filter.sunElevationMax}}"
                          step="1"
                          min="-89"
                          max="90"
                          focus-input
                          ng-change="filter.sunElevationCheck = (filter.sunElevationMin === -90 && filter.sunElevationMax === 90) ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                        class="fa fa-info-circle text-info"
                        aria-hidden="true"
                        uib-tooltip="Valid range -90 to 90"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ng-disabled="!filter.sunElevationCheck"
                          ng-model="filter.sunElevationCheckNull"
                          ng-click="filter.updateFilterString()">
                        <label
                          class="form-check-label range-include-unknown-label"
                          for="sunElevationCheckNull">
                          Include Unknown
                        </label>
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Checking this box will allow results for images with null or unknown values ih the Sun Elevation metadata field"></i>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-lg-1"></li>
                      <li class="col-sm-6 col-md-4 col-lg-3 range-input-group filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input
                              type="checkbox"
                              ng-model="filter.cloudCoverCheck"
                              ng-click="filter.updateFilterString()">
                          </span>
                          <span class="input-group-addon range-name">Cloud Cover</span>
                        </div>
                      </li>
                      <li class="col-sm-3 col-lg-2">
                      </li>
                      <li class="col-sm-3 col-lg-2">
                        <input
                          type="number"
                          placeholder="0"
                          ng-model="filter.cloudCover"
                          class="form-control input-sm"
                          id="cloudCover"
                          value="{{filter.cloudCover}}"
                          step="1"
                          min="0"
                          max="100"
                          focus-input
                          ng-change="filter.cloudCoverCheck = filter.cloudCover === 20 ? false: true;"
                          ng-enter="filter.updateFilterString()"
                          ng-blur="filter.updateFilterString()">
                      </li>
                      </li>
                      <li class="col-sm-2 col-md-1 range-info">
                        <i
                        class="fa fa-info-circle text-info"
                        aria-hidden="true"
                        uib-tooltip="Valid range 0 to 100"></i>
                      </li>
                      <li class="col-sm-5 col-md-6 col-lg-3 range-include-unknown">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ng-disabled="!filter.cloudCoverCheck"
                          ng-model="filter.cloudCoverCheckNull"
                          ng-click="filter.updateFilterString()">
                        <label
                          class="form-check-label range-include-unknown-label"
                          for="cloudCoverCheckNull">
                          Include Unknown
                        </label>
                        <i
                          class="fa fa-info-circle text-info"
                          aria-hidden="true"
                          uib-tooltip="Checking this box will allow results for images with null or unknown values ih the Cloud Cover metadata field"></i>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-sm-12 text-center">
                        <button class="btn btn-primary btn-xs" type="button"
                          ng-click="filter.initRanges(true);">Reset Range Filters
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li><!-- End menu -->

              <li class="dropdown mega-dropdown">
                  <a  class="dropdown-toggle temporal-filter-dropdown" data-toggle="dropdown" role="button" aria-haspopup="true"
                  aria-expanded="false"><span class="fa fa-clock-o" aria-hidden="true"></span>
                  &nbsp;Temporal
                  <span
                  ng-show="filter.filterTemporalIndicator"
                  class="text-info filter-indicator"
                  uib-tooltip="Indicates a temporal filter is being applied"
                  tooltip-placement="right">&#9679;</span>
                <span class="caret"></span></a>
                <ul class="dropdown-menu mega-dropdown-menu row temporal-row" ng-click="$event.stopPropagation();">
                  <li class="col-sm-12">
                    <ul>
                      <li class="dropdown-header text-center">Temporal Filters</li>
                      <li class="text-center">
                        <p>Select a date type and duration filter from the select boxes below.  Changes will be reflected immediately</p>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-6">
                    <ul>
                      <li class="filter-row">
                        <div class="form-group form-group-sm">
                          <label for="temporalTypeFilter">Date Type</label>
                          <select
                            ng-model="filter.currentDateType"
                            ng-options="type.label for type in filter.dateTypes"
                            id="temporalTypeFilter"
                            class="form-control"
                            ng-change="filter.updateFilterString()"
                            ng-enter="filter.updateFilterString()">
                          </select>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-6">
                    <ul>
                      <li class="filter-row">
                        <div class="form-group form-group-sm">
                          <label for="temporalDuration">Duration</label>
                          <select ng-model="filter.currentTemporalDuration"
                            ng-options="duration.label for duration in filter.temporalDurations"
                            ng-change="filter.updateFilterString()"
                            id="temporalDuration"
                            class="form-control">
                          </select>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-6" ng-show="filter.customDateRangeVisible">
                    <ul>
                      <li>
                        <label>Start Time & Date</label>
                      </li>
                    </ul>
                    <ul>
                      <li class="text-center">
                        <div class="form-group form-group-sm">
                          <input type="text" class="form-control"
                            ng-model="filter.startDate"
                            data-time-format="HH:mm:ss"
                            data-autoclose="false"
                            data-minute-step="1"
                            data-second-step="1"
                            placeholder="Time"
                            bs-timepicker
                            ng-blur="filter.updateFilterString()">
                        </div>
                        <div style="display:inline-block;">
                          <uib-datepicker
                            ng-model="filter.startDate"
                            max-date="filter.endDate"
                            show-weeks="false"
                            class="well well-sm"
                            ng-change="filter.updateFilterString()">
                          </uib-datepicker>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-6" ng-show="filter.customDateRangeVisible">
                    <ul>
                      <li>
                        <label>End Time & Date</label>
                      </li>
                    </ul>
                    <ul>
                      <li class="text-center">
                        <div class="form-group form-group-sm">
                          <input
                            type="text"
                            size="8"
                            class="form-control"
                            ng-model="filter.endDate"
                            data-time-format="HH:mm:ss"
                            data-autoclose="0"
                            data-minute-step="1"
                            data-second-step="1"
                            placeholder="Time"
                            bs-timepicker
                            ng-change="filter.updateFilterString()">
                        </div>
                        <div style="display:inline-block;">
                          <uib-datepicker
                            ng-model="filter.endDate"
                            min-date="filter.startDate"
                            max-date="filter.maxEndDate"
                            show-weeks="false"
                            class="well well-sm"
                            ng-change="filter.updateFilterString()">
                          </uib-datepicker>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="col-sm-12 text-center">
                    <button
                      class="btn btn-primary btn-xs"
                      type="button"
                      ng-click="filter.initTemporal(true)">Reset Temporal Filters
                    </button>
                    <!-- <button class="btn btn-warning btn-xs" type="button"
                      ng-click="filter.closeFilterDropdown('temporal-filter-dropdown')">Close
                    </button> -->
                  </li>
                </ul><!-- end menu -->
              </li>
              <li class="dropdown mega-dropdown">
                <a class="dropdown-toggle spatial-filter-dropdown" data-toggle="dropdown" role="button" aria-haspopup="true"
                  aria-expanded="false"><span class="fa fa-map" aria-hidden="true"></span>
                  &nbsp;Spatial
                  <span
                    ng-show="filter.filterSpatialIndicator"
                    class="text-info filter-indicator"
                    uib-tooltip="Indicates a spatial filter is being applied"
                    tooltip-placement="right">&#9679;</span>
                  <span class="caret"></span></a>
                <ul class="dropdown-menu mega-dropdown-menu row" ng-click="$event.stopPropagation();">
                  <li class="col-sm-12">
                    <ul>
                      <li class="dropdown-header text-center">
                        <p class="text-center">Spatial Filters</p>
                      </li>
                      <li class="col-sm-2 filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input type="checkbox"
                            ng-model="filter.viewPortSpatial"
                            ng-change="filter.byViewPort(filter.viewPortSpatial)">
                          </span>
                          <span class="input-group-addon spatial-name">Map View</span>
                        </div>
                      </li>
                      <li class="col-sm-2">&nbsp;</li>
                      <li class="col-sm-8">
                        <p>This filter is on by default.  It constrains the
                          query to the boundaries of the current map extent</p>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-sm-2 filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input type="checkbox"
                            ng-model="filter.pointSpatial"
                            ng-change="filter.byPointer(filter.pointSpatial)">
                          </span>
                          <span class="input-group-addon spatial-name">Point</span>
                        </<div>
                      </li>
                      <li class="col-sm-2">&nbsp;</li>
                      <li class="col-sm-8">
                        <p>Single clicking on the map
                          will return a potential list of images at that location</p>
                      </li>
                      <li class="col-sm-12">
                        <hr>
                      </li>
                      <li class="col-sm-2 filter-row">
                        <div class="input-group input-group-sm">
                          <span class="input-group-addon">
                            <input type="checkbox"
                            ng-model="filter.polygonSpatial"
                            ng-change="filter.byPolygon(filter.polygonSpatial)">
                          </span>
                          <span class="input-group-addon spatial-name">Polygon</span>
                        </div>
                      </li>
                      <li class="col-sm-2">&nbsp;</li>
                      <li class="col-sm-8 filter-row">
                        <p>Left-click and hold with the
                          ALT key to create a box that will return a potential list of images
                        </p>
                      </li>
                      <li class="col-sm-12 text-center">
                        <!-- <button class="btn btn-warning btn-xs" type="button"
                          ng-click="filter.closeFilterDropdown('spatial-filter-dropdown')">Close
                        </button> -->
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="col-sm-2" style="padding-right: 0px">
            <p class="navbar-text navbar-sort-list-number pull-right">
              <span class="label label-default cursor-default">Total images</span>
              <span
                class="label label-primary cursor-default"
                ng-class="{'label-info': filter.refreshSpin}"
                tooltip-placement="left"
                uib-tooltip="Number of Search Result Images">{{filter.totalWfsFeatures}}</span>
            </p>
          </div>
          <div class="col-sm-1">
            <button class="btn btn-default button-sort-refresh"
              ng-click="filter.refreshList()"
              tooltip-placement="bottom"
              uib-tooltip="Refresh the image list data">
              <span class="fa fa-refresh" ng-class="{'fa-spin fa-pulse': filter.refreshSpin}"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="row">
    <div class="col-md-8" ng-controller="MapController as map">
      <div id="map" class="map" params="map.mapParams" map>
        <form id="searchForm" class="searchForm">
          <div class="input-group input-group-sm" ng-controller="SearchController as search">
            <input
              id="searchInput"
              type="text"
              ng-model="search.searchInput"
              class="form-control"
              placeholder="BE, Coordinate, Image ID or Placename">
            <span class="input-group-btn">
              <button
                id="searchButton"
                class="btn btn-info"
                type="button"
                ng-click="search.executeSearch()" ng-disabled="search.searchButtonDisabled">
                <span class="glyphicon glyphicon-search"></span>
              </button>
              <button
                id="searchClearButton"
                class="btn btn-default"
                type="button"
                ng-click="search.resetSearchInput()">
                <span class="glyphicon glyphicon-remove"></span>
              </button>
            </span>
          </div>
        </form>
        <div
          id="legend"
          style="
            color: black;
            background-color: white;
            border: 1px solid white;
            border-radius: 5px;">
            <div class="text-center"><b>{{map.legendTitle}}</b></div>
            <img
              src="{{map.legendUrl}}"
              alt="{{map.legendTitle}}">
        </div>
      </div>
      <div id="mouseCoords" class="map-cord-div" tooltip-placement="top"
        uib-tooltip="Click on the coordinates to change units." tooltip-popup-delay="300">
      </div>
      <div id="popup" class="ol-popup">
        <div id="popup-content"></div>
      </div>
      <div id="progress" class="text-info">
        <i class="fa fa-spinner fa-spin fa-4x"></i>
      </div>
    </div>
    <div class="col-md-4" ng-controller="ListController as list">
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
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
              data-target="#sort-navbar-collapse" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
          </div>
          <div class="collapse navbar-collapse" id="sort-navbar-collapse">
            <ul class="nav navbar-nav">
              <li class="dropdown">
                <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" role="button"
                aria-haspopup="true" aria-expanded="false">
                {{list.currentSortText}}<span class="caret"></span></a>
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
              <li class="dropdown nav-download">
                <a class="dropdown-toggle navbar-sort-dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Export
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" ng-controller="WFSOutputDlController as wfsOutputDownload">
                  <li class="dropdown-header">Export the images in the following formats   <i
                      class="fa fa-info-circle text-info"
                      aria-hidden="true"
                      tooltip-placement="left-bottom"
                      uib-tooltip="(A maximum of 1000 of the most recently acquired
                      images will be exported)"></i>
                  </li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('CSV')">CSV</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('GML2')">GML2</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('GML3')">GML3</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('GML32')">GML32</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('JSON')">JSON</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.getDownloadURL('KML')">KML</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">Create a GeoRSS feed of the images
                      <i
                        class="fa fa-info-circle text-info"
                        aria-hidden="true"
                        tooltip-placement="left-bottom"
                        uib-tooltip="A browser
                        extension is required for Internet Explorer and
                          Chrome.  Firefox has built in support
                          for RSS feeds."></i>
                    </li>
                  <li>
                    <a ng-href="" target="_blank" ng-click="wfsOutputDownload.getGeoRss()">GeoRSS</a>
                  </li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">View the images in the following applications
                    <i
                      class="fa fa-info-circle text-info"
                      aria-hidden="true"
                      tooltip-placement="left-bottom"
                      uib-tooltip="(A maximum of 100 of the most recently acquired
                      images can be viewed)"></i>
                  </li>
                  <li ng-show="{{wfsOutputDownload.isaAppEnabled}}"><a ng-href="" target="_blank" ng-click="wfsOutputDownload.goToISA()">ISA</a></li>
                  <li><a ng-href="" target="_blank" ng-click="wfsOutputDownload.goToTLV()">TLV</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a class="dropdown-toggle navbar-sort-dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false">Selected ({{list.selectedCards.length}})
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li class="dropdown-header">Use the checkboxes on the image cards to </li>
                  <li class="dropdown-header">select individual images. They can then be</li>
                  <li class="dropdown-header"> downloaded, exported, or viewed in</li>
                  <li class="dropdown-header">applications</li>
                  <li class="divider"></li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.downloadSelectedImages()">
                    <a href="">Download
                      <i
                        class="fa fa-info-circle text-info"
                        style="font-size: 12px;"
                        aria-hidden="true"
                        tooltip-placement="left-bottom"
                        uib-tooltip="A maximum of 10 can be downloaded at one time"></i>
                    </a>
                  </li>
                  <li class="divider"></li>
                  <li class="dropdown-header">
                    Exports
                    <i
                      class="fa fa-info-circle text-info"
                      aria-hidden="true"
                      tooltip-placement="left-bottom"
                      uib-tooltip="Export the selected images into the following formats"></i>
                  </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('CSV')">
                    <a href="">CSV</a>
                  </li><li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('GML2')">
                    <a href="">GML2</a>
                  </li>
                  </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('GML3')">
                    <a href="">GML3</a>
                  </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('GML32')">
                    <a href="">GML32</a>
                  </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('JSON')">
                    <a href="">JSON</a>
                  </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.exportSelectedImages('KML')">
                    <a href="">KML</a>
                  </li>
                  <li class="divider"></li>
                  <li class="dropdown-header">Applications
                    <i
                      class="fa fa-info-circle text-info"
                      aria-hidden="true"
                      tooltip-placement="left-bottom"
                      uib-tooltip="A maximum of 100 can be viewed per application"></i>
                    </li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.viewSelectedImagesApp('tlv')">
                    <a href="">TLV</a>
                  </li>
                  <li
                    ng-show="{{list.isaAppEnabled}}"
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.viewSelectedImagesApp('isa')">
                    <a href="">ISA</a>
                  </li>
                  <li class="divider"></li>
                  <li
                    role="menuitem"
                    ng-class="{'disabled': !list.showSelectedButton}"
                    ng-click="list.clearSelectedImages(); list.clearSelectedMosaicImages()">
                    <a href="">Clear Selected
                      <i
                        class="fa fa-info-circle text-info"
                        aria-hidden="true"
                        tooltip-placement="left-bottom"
                        uib-tooltip="Remove all currently selected image cards"></i>
                      </li>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div id="list" style="border-style: solid; border-width: 1px; padding: 10px; border-radius: 4px;">
        <div ng-show="list.wfsData.length === 0">
          <div>
            <span class="text-default"><h4 class="text-center"><strong>We did not find any images that match your search filters</strong></h4></span>
            <span class="text-info"><h4 >Check the dates</h4></span>
            <p>Make sure you provide valid dates for the query.  Also, make sure you are searching for the
              appropriate date type (acquisition versus ingest).</p>
            <span class="text-info"><h4>Check the spelling</h4></span>
            <p>It is possible that one of the Keyword filters has a spelling error.</p>
            <span class="text-info"><h4>Check range values</h4></span>
            <p>Make sure that the range values you have submitted are valid for those attributes.</p>
            <span class="text-info"><h4 class="text-info">Check your map extent</h4></span>
            <p>The map extent is also a filter for the images.  Make sure the map is zoomed out to an
              appropriate extent for your search.</p>
          </div>
        </div>
        <div ng-show="list.wfsFeatures >= 1"
          ng-repeat="image in list.wfsData" ng-init="list.showProcessInfo=[]"
          ng-model="image">
          <div class="panel panel-default cursor-pointer" >
            <div class="panel-heading"
              ng-click="list.addRemoveCards(image.properties.id)"
              style="
                font-size: 11px;
                padding: 2px 7px;">
                <span>
                  <i class="fa fa-square-o cursor-pointer"
                    ng-class="{'fa-check-square text-success': list.checkSelectItem(image.properties.id)}"
                    aria-hidden="true"
                    style="padding-right: 5px;"
                    tooltip-placement="left-bottom"
                    uib-tooltip="Add image to selected list">
                  </i>
                </span>
              <span
                class="text-default cursor-pointer">
                <span ng-show="!image.properties.title">Unknown</span>
                {{image.properties.title}}
              </span>
            </div>
            <div class="panel-body"
              ng-mouseenter="list.displayFootprint(image);"
              ng-mouseleave="list.removeFootprint();">
              <div class="media">
                <div class="media-left" style="position: relative">
                  <img
                    class="media-object"
                    ng-click="list.showImageModal(image, list.imageSpaceDefaults, list.imageSpaceRequestUrl, list.uiRequestUrl, list.mensaRequestUrl, list.wfsRequestUrl, list.tlvRequestUrl, list.kmlRequestUrl);"
                    tooltip-placement="right"
                    uib-tooltip="Click the thumbnail or the Image ID to view the metadata"
                    height="114"
                    width="114"
                    ng-src="{{list.thumbPath}}?{{list.thumbFilename}}{{image.properties.filename}}{{list.thumbId}}{{image.properties.id}}{{list.thumbEntry}}{{image.properties.entry_id}}&size={{list.thumbSize}}&outputFormat={{list.thumbFormat}}&transparent={{list.thumbTransparent}}&padThumbnail={{list.padThumbnail}}">&nbsp;
                  <div
                    class="well text-center jpip-loading-overlay"
                    ng-show="list.showProcessInfo[$index]">
                    <span style="font-size: .8em">{{list.processType}}</span><i class="fa fa-cog fa-spin text-info"></i>
                  </div>
                </div>
                <div class="media-body">
                  <div class="row">
                  </div>
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
                          <span class = "glyphicon glyphicon-ban-circle text-danger"></span>
                          <span class = "text-danger">Invalid Model</span>
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
                  <div
                    class="btn-group btn-group-sm"
                    role="group"
                    aria-label="card-buttons">
                    <a
                        type="button"
                        class="btn btn-default"
                        ng-click="list.zoomToSelectedImage(image.properties.id);">
                        <i class="fa fa-arrows text-default"
                          tooltip-placement="right"
                          uib-tooltip="Zoom to the image extent"></i>
                      </a>
                    <a
                        type="button"
                        class="btn btn-default"
                        href="{{list.o2baseUrl}}/#/mapImage?filename={{image.properties.filename}}&entry_id={{image.properties.entry_id}}&width={{image.properties.width}}&numResLevels={{image.properties.number_of_res_levels}}&height={{image.properties.height}}&bands={{list.imageSpaceDefaults.bands}}&numOfBands={{image.properties.number_of_bands}}&imageId={{image.properties.id}}&brightness={{list.imageSpaceDefaults.brightness}}&contrast={{list.imageSpaceDefaults.contrast}}&histOp={{list.imageSpaceDefaults.histOp}}&histCenterTile={{list.imageSpaceDefaults.histCenterTile}}&resamplerFilter={{list.imageSpaceDefaults.resamplerFilter}}&sharpenMode={{list.imageSpaceDefaults.sharpenMode}}&imageRenderType={{list.imageSpaceDefaults.imageRenderType}}&imageSpaceRequestUrl={{list.imageSpaceRequestUrl}}&uiRequestUrl={{list.uiRequestUrl}}&mensaRequestUrl={{list.mensaRequestUrl}}&wfsRequestUrl={{list.wfsRequestUrl}}&wmsRequestUrl={{list.wmsRequestUrl}}&showModalSplash=false"
                        target="_blank">
                        <i class="fa fa-desktop text-default"
                          tooltip-placement="pull-right"
                          uib-tooltip="View raw image"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-click="list.viewOrtho(image)">
                        <i class="fa fa-history text-default"
                          tooltip-placement="right"
                          uib-tooltip="View rectified image in TLV"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-show="{{list.kmlSuperOverlayAppEnabled}}"
                        href="{{list.kmlRequestUrl}}{{image.properties.id}}">
                        <i class="fa fa-map text-default cursor-pointer"
                          tooltip-placement="right"
                          uib-tooltip="Download KML"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-click="list.shareModal(list.getImageSpaceUrl(image))">
                        <i class="fa fa-share-alt text-default"
                        tooltip-placement="top"
                        uib-tooltip="Share link"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-click="list.archiveDownload(image.properties.id)">
                        <i class="fa fa-download text-default"
                          tooltip-placement="top"
                          uib-tooltip="Download"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-show="{{list.jpipAppEnabled}}"
                        ng-click="list.getJpipStream($event, image.properties.filename, image.properties.entry_id, 'chip', $index, 'stream');">
                        <i class="fa fa-file-image-o text-default"
                          tooltip-placement="top"
                          uib-tooltip="JPIP image"></i>
                      </a>
                      <a
                        type="button"
                        class="btn btn-default"
                        ng-show="{{list.jpipAppEnabled}}"
                        ng-click="list.getJpipStream($event, image.properties.filename, image.properties.entry_id, '4326', $index, 'ortho');">
                        <i class="fa fa-image text-default"
                          tooltip-placement="top"
                          uib-tooltip="JPIP ortho"></i>
                      </a>
                      <a 
                        type="button"
                        class="btn btn-default"
                        ng-click="copyToClipboard('Test')">
                        <i class="fa fa-clipboard text-default"
                          tooltip-placement="top"
                          uib-tooltip="Copy WMS to clipboard"></i>
                      </a>
                  </div>
                </div>
              </div>
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
      <div class="text-center">
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
</div>
