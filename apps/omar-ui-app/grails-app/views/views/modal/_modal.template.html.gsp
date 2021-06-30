<div class="modal-header" id="modal-image-space">
    <div class="row">
        <div class="col-sm-4">
        </div>
        <div class="col-sm-4 text-center">
            <h3 class="list-card-modal-header-title">Metadata</h3>
        </div>
        <div class="col-sm-4">
            <div class="list-card-modal-close">
                <i class="fa fa-close fa-2x" ng-click="$ctrl.cancel()" style="cursor: pointer;" tooltip-placement="bottom" uib-tooltip="Close image view"></i>
            </div>
        </div>
    </div>
</div>
<div class="modal-body" id="modal-image-space-body">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-1"><h4>ID:</h4></div>
            <div class="col-md-10"><h4 class="text-success">{{ $ctrl.modalData.id }}</h4></div>
        </div>
        <div class="row"></div>
        <uib-tabset active="0" justified="true">

            <!-- Meta Data -->
            <uib-tab index="0" heading="Metadata">
                <div class="col-xs-6" style="min-height: 181px" ng-repeat="(key, item) in $ctrl.metadata">
                    <h4 class="text-info">{{ key }}</h4>
                    <div class="meta-data-box">
                        <ul class="list-unstyled">
                            <li ng-repeat="entry in item">
                                <span class="text-capitalize">{{ entry }}:</span>
                                <span class="text-success ">
                                    {{ $ctrl.modalData.properties[entry] }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </uib-tab>

            <!-- AVRO -->
            <uib-tab index="1" heading="Avro" disable="true">
                <div id="avro" class="tab-pane" ng-click="vm.loadAvroMetadata()">
                    <div class="panel panel-default panel-avro-metadata" ng-show="vm.showAvroMetadata">
                        <div class="col-md-4">
                            <ul>
                                <li ng-repeat="item in vm.column1">
                                    {{item[0]}}: <span class="text-success">{{item[1]}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <ul>
                                <li ng-repeat="item in vm.column2">
                                    {{item[0]}}: <span class="text-success">{{item[1]}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <ul>
                                <li ng-repeat="item in vm.column3">
                                    {{item[0]}}: <span class="text-success">{{item[1]}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-12" ng-show="!vm.showAvroMetadata">
                        <div class="alert alert-warning">
                            <p>Could not find Avro metadata for the selected image.</p>
                        </div>
                    </div>
                </div>
            </uib-tab>

            <!-- BE -->
            <uib-tab index="3" heading="BE" disable="true">
                <div id="be" role="tabpanel" class="tab-pane"index="2">
                    <div>
                        <br>
                        <table class="table table-striped the-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr ng-repeat="be in vm.beData">
                                <td>
                                    <span ng-show="be.properties.be">{{be.properties.be}}</span>
                                    <span ng-show="be.properties.suffix">{{be.properties.suffix}}</span>
                                    <a href="" ng-click="vm.viewOrtho(vm.selectedImage, be.geometry.coordinates)" target="_blank">
                                        {{be.properties[vm.placemarkConfig.displayNameColumnName]}}
                                    </a>
                                </td>
                                <td>{{be.geometry.coordinates[1]}}</td>
                                <td>{{be.geometry.coordinates[0]}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </uib-tab>

            <!-- Toolbox -->
            <uib-tab index="4" heading="Toolbox">
                <div class="row text-center toolbox-button-row">
                    <a class="btn btn-default disabled"
                       type="button"
                       uib-tooltip="Export to KML">
                        <i class="fas fa-file-export fa-3x" ></i>
                        <h5>Export</h5>
                    </a>
                    <a ng-click="$ctrl.download( $ctrl.modalData.properties )"
                       class="btn btn-default"
                       type="button"
                       uib-tooltip="Download raw file">
                        <i class="fa fa-download fa-3x" ></i>
                        <h5>Download</h5>
                    </a>
                    <a ng-click="$ctrl.share($ctrl.modalData.properties.player_url)"
                       class="btn btn-default"
                       type="button"
                       uib-tooltip="Share url to video player">
                        <i class="fa fa-share-alt fa-3x" ></i>
                        <h5>Share</h5>
                    </a>
                    <a class="btn btn-default disabled" type="button">
                        <i class="fa fa-search-plus fa-3x" uib-tooltop="Share a link to the GetCapabilities for image"></i>
                        <h5>GetCapes</h5>
                    </a>
                    <a class="btn btn-default disabled" type="button">
                        <i class="fa fa-map-marked-alt fa-3x" uib-tooltop="Share a link to the GetMap for image"></i>
                        <h5>GetMap</h5>
                    </a>
                    <a class="btn btn-default disabled" type="button">
                        <i class="fa fa-laptop-code fa-3x" uib-tooltop="Runs machine learning workflow on image"></i>
                        <h5>Machine Learning</h5>
                    </a>
                </div>
            </uib-tab>
        </uib-tabset>

    </div>
</div>
<div class="modal-footer" id="modal-image-space-footer">
    <button class="btn btn-warning" type="button" ng-click="$ctrl.cancel()">Close</button>
</div>
