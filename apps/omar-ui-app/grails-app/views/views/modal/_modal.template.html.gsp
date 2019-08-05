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
            <uib-tab index="0" heading="MetaData">
                <div id="video-metadata" class="tab-pane">
                    <div class="row align-items-start">
                        <div class="col-md-6 meta-data-height" ng-repeat="(key, item) in $ctrl.metadata">
                            <h4 class="text-info">{{ key }}</h4>
                            <div class="panel panel-primary">
                                <ul class="list-unstyled metadata-list">
                                    <li ng-repeat="entry in item">
                                        <span class="text-capitalize">{{ entry }}:</span>
                                        <span class="text-success">
                                            {{ $ctrl.modalData.properties[entry] }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </uib-tab>

            <!-- AVRO -->
            <uib-tab index="1" heading="Avro">
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
            <uib-tab index="3" heading="BE">
                <div id="be" role="tabpanel" class="tab-pane" ng-click="vm.loadBeData()" index="2">
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

                <i class="fas fa-file-export"></i>
                <i class="fa fa-download"></i>
                <i class="fa fa-share-alt"></i>
                <i class="fa fa-search-plus"></i>
                <i class="fa fa-map-marked-alt"></i>
                <i class="fa fa-laptop-code"></i>
            </uib-tab>

        </uib-tabset>



        <div id="toolbox" role="tabpanel" class="tab-pane" index="3">
            <div>
                <div class="row">
                    <div class="col-md-6 text-center">
                        <h4 class="text-info">Tool</h4>
                    </div>
                    <div class="col-md-6 text-center">
                        <h4 class="text-info">Description</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class = "btn btn-default btn-block btn-metrics" href="{{vm.kmlRequestUrl}}{{vm.selectedImage.properties.id}}" role = "button" target = "_blank">KML Export</a>
                    </div>
                    <div class="col-md-6 toolbox-description-text">
                        Download KML document for this image
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class="btn btn-default btn-block btn-metrics"
                           ng-click="$ctrl.download( $ctrl.modalData.properties )"
                           role = "button">Download</a>
                    </div>
                    <div class="col-md-6 toolbox-description-text">
                        Download raw file
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class = "btn btn-default btn-block btn-metrics"
                           ng-click="$ctrl.share($ctrl.modalData.properties.videoUrl)"
                           role = "button">Share</a>
                    </div>
                    <div class="col-md-6 toolbox-description-text">
                        Share image link
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.copyWmsCaps(vm.selectedImage.properties.id)" role = "button" target = "_blank">WMS Get Capabilities</a>
                    </div>
                    <div class="col-md-6 toolbox-description-text">
                        Share a link to the GetCapabilities for image
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.shareWmsGetMap(vm.selectedImage.properties.id)" role = "button" target = "_blank">WMS Get Map</a>
                    </div>
                    <div class="col-md-6">
                        Share a link to the GetMap for image
                        <br>
                        <small>Include BBox:</small>
                        <input ng-model = "vm.bBoxCheck" type = "checkbox">
                        <i class = "fa fa-info-circle text-info" tooltip-placement = "bottom" uib-tooltip = "Check the box to include the BBox of the image (default behavior). Otherwise, a variable of {bbox} will be used (rMaps)"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.submitMlJob(vm.selectedImage.properties.id)" role = "button" target = "_blank">Run Detections</a>
                    </div>
                    <div class="col-md-6 toolbox-description-text">
                        Runs machine learning workflow on image
                    </div>
                </div>
                <br>
            </div>
        </div>

        </div>

    </div>
</div>
<div class="modal-footer" id="modal-image-space-footer">
    <button class="btn btn-warning" type="button" ng-click="$ctrl.cancel()">Close</button>
</div>
