<div class="modal-header" id="modal-image-space">
  <div class="row">
    <div class="col-sm-4">
    </div>
    <div class="col-sm-4 text-center">
      <h3 class="list-card-modal-header-title">Image Properties</h3>
    </div>
    <div class="col-sm-4">
      <div class="list-card-modal-close">
        <i class="fa fa-close fa-2x" ng-click="$close()" style="cursor: pointer;" tooltip-placement="bottom" uib-tooltip="Close image view"></i>
      </div>
    </div>
  </div>
</div>
<div class="modal-body" id="modal-image-space-body">
  <div class="container-fluid">
    <div class="row">
      <h5>ID:&nbsp;&nbsp;<span class="text-success">
        <span ng-show="!vm.selectedImage.properties.title">{{vm.selectedImage.properties.filename | fileNameTrim}}</span>{{vm.selectedImage.properties.title}}</span>
      </h5>
    </div>
    <div class="row">

      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a data-target="#metadata" aria-controls="metadata" role="tab" data-toggle="tab">Metadata</a></li>
        <li role="presentation"><a data-target="#avro" aria-controls="avro" role="tab" data-toggle="tab">Avro</a></li>
        <li role="presentation" ng-show="vm.beLookupEnabled"><a data-target="#be" aria-controls="be" role="tab" data-toggle="tab">BE</a></li>
        <li role="presentation"><a data-target="#toolbox" aria-controls="toolbox" role="tab" data-toggle="tab">Toolbox</a></li>
      </ul>

      <div class="tab-content">

        <div id="metadata" role="tabpanel" class="tab-pane active">
          <br>
          <div class="col-md-6 metadata-ul-list">
            <p>Acquisition Date:&nbsp;&nbsp;<span class="text-success">
              {{vm.selectedImage.properties.acquisition_date | date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}</span>
              <span ng-show="vm.selectedImage.properties.acquisition_date">z</span>
            </p>
            <h4 class="text-info">Source</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>DB ID:&nbsp; &nbsp; <span class="text-success">{{vm.selectedImage.properties.id}}</span></li>
                <li>Mission:&nbsp; &nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.mission_id}}
                  </span>
                </li>
                <li>Sensor:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.sensor_id}}
                  </span>
                </li>
                <li>Product ID:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.product_id}}
                  </span>
                </li>
                <li>Organization:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.organization}}
                  </span>
                </li>
                <li>Country Code:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.country_code}}
                  </span>
                </li>
                <li>WAC Code:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.wac_code}}
                  </span>
                </li>
                <li>Image Representation:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.image_representation}}
                  </span>
                </li>
              </ul>
            </div>
            <h4 class="text-info">File</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>Type:&nbsp;&nbsp;<span class="text-success">
                    {{vm.selectedImage.properties.file_type}}
                  </span>
                </li>
                <li class="dont-break-out">Name:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.filename}}
                  </span>
                </li>
                <li class="dont-break-out">Entry ID:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.entry_id}}
                  </span>
                </li>
              </ul>
            </div>
            <h4 class="text-info">General</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>Description:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.description}}
                  </span>
                </li>
                <li class="dont-break-out">Title:&nbsp;&nbsp;
                  {{vm.selectedImage.properties.title}}
                  </span>
                </li>
                <li>Security Classification:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.security_classification"></span>
                    {{vm.selectedImage.properties.security_classification}}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <p>Ingest Date:&nbsp;&nbsp;<span class="text-success">
              {{vm.selectedImage.properties.ingest_date| date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}</span>
              <span ng-show="vm.selectedImage.properties.ingest_date">z</span>
            </p>
            <h4 class="text-info">Metrics</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>NIIRS:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.niirs}}
                  </span>
                </li>
                <li>Azimuth Angle:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.azimuth_angle}}
                  </span>
                </li>
                <li>Grazing Angle:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.grazing_angle}}
                  </span>
                </li>
                <li>Sun Azimuth:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.sun_azimuth}}
                  </span>
                </li>
                <li>Sun Elevation:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.sun_elevation}}
                  </span>
                </li>
                <li>Cloud Cover:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.cloud_cover}}
                    </span>
                </li>
                <li>Number of Bands:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.number_of_bands}}
                  </span>
                </li>
                <li>Number of Resolution Levels:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.number_of_res_levels}}
                  </span>
                </li>
                <li>Bit Depth:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.bit_depth}}
                  </span>
                </li>
              </ul>
            </div>
            <h4 class="text-info">Dimensions</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>Image Height:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.height}}
                  </span>
                </li>
                <li>Image Width:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.width}}
                  </span>
                </li>
              </ul>
            </div>
            <h4 class="text-info">Geometry</h4>
            <div class="panel panel-primary">
              <ul class="list-unstyled metadata-list">
                <li>GSD Unit:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.gsd_unit}}
                  </span>
                </li>
                <li>GSD X:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.gsdx}}
                  </span>
                </li>
                <li>GSD Y:&nbsp;&nbsp;
                  <span class="text-success">
                    {{vm.selectedImage.properties.gsdy}}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="avro" role="tabpanel" class="tab-pane" ng-click="vm.loadAvroMetadata()">
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
        </li>
        </div>

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
                    <span ng-show="be.properties.be">{{be.properties.be}}&nbsp;</span>
                    <span ng-show="be.properties.suffix">{{be.properties.suffix}}&nbsp;</span>
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
              <div class="col-md-6">
                Download KML document for this image
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.archiveDownload(vm.selectedImage.properties.id)" role = "button" target = "_blank">Download</a>
              </div>
              <div class="col-md-6">
                Download raw image file
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.shareModal(vm.getImageSpaceUrl(vm.selectedImage))" role = "button" target = "_blank">Share</a>
              </div>
              <div class="col-md-6">
                Share image link
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.copyWmsCaps(vm.selectedImage.properties.id)" role = "button" target = "_blank">WMS Get Capabilities</a>
              </div>
              <div class="col-md-6">
                Share a link to the GetCapabilities for image
              </div>
            </div>
            <!-- <div class="row">
              <div class="col-md-6">
                  <a class = "btn btn-default btn-block btn-metrics" ng-click="vm.shareWms(vm.selectedImage.properties.id)" role = "button" target = "_blank">WMS Get Map</a>
              </div>
              <div class="col-md-6">
                  Share a link to the GetMap for image
              </div>
            </div> -->
            <br>
          </div>
        </div>

      </div>
      </div>

  </div>
</div>
<div class="modal-footer" id="modal-image-space-footer">
    <button class="btn btn-warning" type="button" ng-click="vm.cancel()">Close</button>
</div>
