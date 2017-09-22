<div class="modal-header" id="modal-image-space">
  <div class="row">
    <div class="col-sm-4">
    <div class="list-card-modal-header-links">
      <div class="text-primary list-card-image-modal-links" style="margin-top:.2em;">
        <a href="{{vm.o2baseUrlModal}}/#/mapImage?filename={{vm.selectedImage.properties.filename}}&entry_id={{vm.selectedImage.properties.entry_id}}&width={{vm.selectedImage.properties.width}}&height={{vm.selectedImage.properties.height}}&bands={{vm.imageSpaceDefaults.bands}}&numOfBands={{vm.selectedImage.properties.number_of_bands}}&imageId={{vm.selectedImage.properties.id}}&brightness={{vm.imageSpaceDefaults.brightness}}&contrast={{vm.imageSpaceDefaults.contrast}}&histOp={{vm.imageSpaceDefaults.histOp}}&histCenterTile={{vm.imageSpaceDefaults.histCenterTile}}&resamplerFilter={{vm.imageSpaceDefaults.resamplerFilter}}&sharpenMode={{vm.imageSpaceDefaults.sharpenMode}}&imageSpaceRequestUrl={{vm.imageSpaceRequestUrl}}&uiRequestUrl={{vm.uiRequestUrl}}&mensaRequestUrl={{vm.mensaRequestUrl}}&wfsRequestUrl={{vm.wfsRequestUrl}}&showModalSplash=false" target="_blank">
          <i class="fa fa-desktop fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="View raw image"></i>&nbsp;&nbsp;
        </a>
        <a href="" ng-click="vm.viewOrtho(vm.selectedImage)" target="_blank">
          <i class="fa fa-history fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="View rectified image in TLV"></i>&nbsp;&nbsp;
        </a>
        <a ng-show="{{vm.kmlSuperOverlayAppEnabled}}" href="{{vm.kmlRequestUrl}}{{vm.selectedImage.properties.id}}">
          <i class="fa fa-map fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="Download KML"></i>&nbsp;&nbsp;
        </a>
        <a ng-href="" target="_blank" ng-click="vm.shareModal(vm.getImageSpaceUrl(vm.selectedImage))">
          <i class="fa fa-share-alt fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="Share link"></i>
        </a>&nbsp;&nbsp;
        <a ng-href="" target="_blank" ng-click="vm.archiveDownload(vm.selectedImage.properties.id)">
          <i class="fa fa-download fa-border text-primary"
            style="cursor: pointer;"
            tooltip-placement="top"
            uib-tooltip="Download"></i>&nbsp;&nbsp;
        </a>
        <a ng-show="{{vm.jpipAppEnabled}}" href="" ng-click="vm.getJpipStream($event, vm.selectedImage.properties.filename, vm.selectedImage.properties.entry_id, 'chip', $index, 'stream');">
          <i class="fa fa-file-image-o fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="JPIP image"></i>
        </a>&nbsp;
        <a ng-show="{{vm.jpipAppEnabled}}" href="" ng-click="vm.getJpipStream($event, vm.selectedImage.properties.filename, vm.selectedImage.properties.entry_id, '4326', $index, 'ortho');">
          <i class="fa fa-image fa-border text-primary"
           style="cursor: pointer;"
           tooltip-placement="top"
           uib-tooltip="JPIP ortho"></i>
        </a>
      </div>
    </div>
    </div>
    <div class="col-sm-4 text-center">
      <h3 class="list-card-modal-header-title">Metadata</h3>
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
      <uib-tabset>
        <uib-tab heading="Image">
          <br>
          <div class="col-md-6">
            <p>Acquisition Date:&nbsp;&nbsp;<span class="text-success">
              <span ng-show="!vm.selectedImage.properties.acquisition_date">Unknown</span>
              {{vm.selectedImage.properties.acquisition_date | date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}</span>
              <span ng-show="vm.selectedImage.properties.acquisition_date">z</span>
            </p>
            <h4>Source</h4>
            <div class="panel panel-primary">
              <ul>
                <li>DB ID:&nbsp; &nbsp; <span class="text-success">{{vm.selectedImage.properties.id}}</span></li>
                <li>Mission:&nbsp; &nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.mission_id">Unknown</span>
                    {{vm.selectedImage.properties.mission_id}}
                  </span>
                </li>
                <li>Sensor:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.sensor_id">Unknown</span>
                    {{vm.selectedImage.properties.sensor_id}}
                  </span>
                </li>
                <li>Organization:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.organization">Unknown</span>
                    {{vm.selectedImage.properties.organization}}
                  </span>
                </li>
                <li>Country Code:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.country_code">Unknown</span>
                    {{vm.selectedImage.properties.country_code}}
                  </span>
                </li>
                <li>WAC Code:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.wac_code">Unknown</span>
                    {{vm.selectedImage.properties.wac_code}}
                  </span>
                </li>
                <li>Image Representation:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.image_representation">Unknown</span>
                    {{vm.selectedImage.properties.image_representation}}
                  </span>
                </li>
              </ul>
            </div>
            <h4>File</h4>
            <div class="panel panel-primary">
              <ul>
                <li>Type:&nbsp;&nbsp;<span class="text-success">
                  <span ng-show="!vm.selectedImage.properties.file_type">Unknown</span>
                    {{vm.selectedImage.properties.file_type}}
                  </span>
                </li>
                <li class="dont-break-out">Name:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.filename">Unknown</span>
                    {{vm.selectedImage.properties.filename}}
                  </span>
                </li>
                <li class="dont-break-out">Entry ID:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.entry_id">Unknown</span>
                    {{vm.selectedImage.properties.entry_id}}
                  </span>
                </li>
              </ul>
            </div>
            <h4>General</h4>
            <div class="panel panel-primary">
              <ul>
                <li>Description:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.description">Unknown</span>
                    {{vm.selectedImage.properties.description}}
                  </span>
                </li>
                <li class="dont-break-out">Title:&nbsp;&nbsp;
                  <span class="text-success"><span ng-show="!vm.selectedImage.properties.title">Unknown</span>
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
              <span ng-show="!vm.selectedImage.properties.ingest_date">Unknown</span>
              {{vm.selectedImage.properties.ingest_date| date:'MM/dd/yyyy HH:mm:ss' : 'UTC'}}</span>
              <span ng-show="vm.selectedImage.properties.ingest_date">z</span>
            </p>
            <h4>Metrics</h4>
            <div class="panel panel-primary">
              <ul>
                <li>NIIRS:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.niirs">Unknown</span>
                    {{vm.selectedImage.properties.niirs}}
                  </span>
                </li>
                <li>Azimuth Angle:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.azimuth_angle">Unknown</span>
                    {{vm.selectedImage.properties.azimuth_angle}}
                  </span>
                </li>
                <li>Grazing Angle:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.grazing_angle">Unknown</span>
                    {{vm.selectedImage.properties.grazing_angle}}
                  </span>
                </li>
                <li>Sun Azimuth:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.sun_azimuth">Unknown</span>
                    {{vm.selectedImage.properties.sun_azimuth}}
                  </span>
                </li>
                <li>Sun Elevation:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.sun_elevation">Unknown</span>
                    {{vm.selectedImage.properties.sun_elevation}}
                  </span>
                </li>
                <li>Cloud Cover:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.cloud_cover">Unknown</span>
                    {{vm.selectedImage.properties.cloud_cover}}
                    </span>
                </li>
                <li>Number of Bands:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.number_of_bands">Unknown</span>
                    {{vm.selectedImage.properties.number_of_bands}}
                  </span>
                </li>
                <li>Number of Resolution Levels:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.number_of_res_levels">Unknown</span>
                    {{vm.selectedImage.properties.number_of_res_levels}}
                  </span>
                </li>
                <li>Bit Depth:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.bit_depth">Unknown</span>
                    {{vm.selectedImage.properties.bit_depth}}
                  </span>
                </li>
              </ul>
            </div>
            <h4>Dimensions</h4>
            <div class="panel panel-primary">
              <ul>
                <li>Image Height:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.height">Unknown</span>
                    {{vm.selectedImage.properties.height}}
                  </span>
                </li>
                <li>Image Width:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.width">Unknown</span>
                    {{vm.selectedImage.properties.width}}
                  </span>
                </li>
              </ul>
            </div>
            <h4>Geometry</h4>
            <div class="panel panel-primary">
              <ul>
                <li>GSD Unit:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.gsd_unit">Unknown</span>
                    {{vm.selectedImage.properties.gsd_unit}}
                  </span>
                </li>
                <li>GSD X:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.gsdx">Unknown</span>
                    {{vm.selectedImage.properties.gsdx}}
                  </span>
                </li>
                <li>GSD Y:&nbsp;&nbsp;
                  <span class="text-success">
                    <span ng-show="!vm.selectedImage.properties.gsdx">Unknown</span>
                    {{vm.selectedImage.properties.gsdy}}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </uib-tab>
        <uib-tab heading="Avro" ng-click="vm.loadAvroMetadata()">
          <br>
          <div ng-show="vm.showAvroMetadata">
            <div class="col-md-6">
              <div class="panel panel-primary small">
                <ul>
                  <li>Abstract: <span class="text-success">{{vm.avroMetadata.abstract}}</span></li>
                  <li>Actual Bit Count Per Pixel: <span class="text-success">{{vm.avroMetadata.actualBitCountPerPixel}}</span></li>
                  <li>Area Target Id: <span class="text-success">{{vm.avroMetadata.areaTargetId}}</span></li>
                  <li>BE Number: <span class="text-success">{{vm.avroMetadata.bENumber}}</span></li>
                  <li>Band Count Quantity: <span class="text-success">{{vm.avroMetadata.bandCountQuantity}}</span></li>
                  <li>Bounding Polygon Type Code: <span class="text-success">{{vm.avroMetadata.boundingPolygonTypeCode}}</span></li>
                  <li>Centroid Coordinates: <span class="text-success">{{vm.avroMetadata.centroidCoordinates}}</span></li>
                  <li>Circular Error: <span class="text-success">{{vm.avroMetadata.circularError}}</span></li>
                  <li>Cloud Cover Percentage: <span class="text-success">{{vm.avroMetadata.cloudCoverPercentage}}</span></li>
                  <li>Collection Mode Code: <span class="text-success">{{vm.avroMetadata.collectionModeCode}}</span></li>
                  <li>Country Code: <span class="text-success">{{vm.avroMetadata.countryCode}}</span></li>
                  <li>EDH DataSet: <span class="text-success">{{vm.avroMetadata.eDHDataSet}}</span></li>
                  <li>File Format Name: <span class="text-success">{{vm.avroMetadata.fileFormatName}}</span></li>
                  <li>File Name: <span class="text-success">{{vm.avroMetadata.fileName}}</span></li>
                  <li>Footprint Coordinates: <span class="text-success">{{vm.avroMetadata.footprintCoordinates}}</span></li>
                  <li>Footprint Geometry: <span class="text-success">{{vm.avroMetadata.footprintGeometry}}</span></li>
                  <li>ICEDH Authorization Reference: <span class="text-success">{{vm.avroMetadata.iCEDHAuthorizationReference}}</span></li>
                  <li>ICEDH Classification: <span class="text-success">{{vm.avroMetadata.iCEDHClassification}}</span></li>
                  <li>ICEDH Classification Reason: <span class="text-success">{{vm.avroMetadata.iCEDHClassificationReason}}</span></li>
                  <li>ICEDH Classified By: <span class="text-success">{{vm.avroMetadata.iCEDHClassifiedBy}}</span></li>
                  <li>ICEDH DES Version: <span class="text-success">{{vm.avroMetadata.iCEDHDESVersion}}</span></li>
                  <li>ICEDH Data Item Create Date Time: <span class="text-success">{{vm.avroMetadata.iCEDHDataItemCreateDateTime}}</span></li>
                  <li>ICEDH Declass Exceptions: <span class="text-success">{{vm.avroMetadata.iCEDHDeclassExceptions}}</span></li>
                  <li>ICEDH DerivedFrom: <span class="text-success">{{vm.avroMetadata.iCEDHDerivedFrom}}</span></li>
                  <li>ICEDH Dissemination Controls: <span class="text-success">{{vm.avroMetadata.iCEDHDisseminationControls}}</span></li>
                  <li>ICEDH Identifier: <span class="text-success">{{vm.avroMetadata.iCEDHIdentifier}}</span></li>
                  <li>ICEDHLAC: <span class="text-success">{{vm.avroMetadata.iCEDHLAC}}</span></li>
                  <li>iCEDHMAF: <span class="text-success">{{vm.avroMetadata.iCEDHMAF}}</span></li>
                  <li>ICEDH Owner Producer: <span class="text-success">{{vm.avroMetadata.iCEDHOwnerProducer}}</span></li>
                </ul>
              </div>
            </div>
            <div class="col-md-6">
              <div class="panel panel-primary small">
                <ul>
                  <li>ICEDH Releasable To: <span class="text-success">{{vm.avroMetadata.iCEDHReleasableTo}}</span></li>
                  <li>ICEDH Responsible Entity Country: <span class="text-success">{{vm.avroMetadata.iCEDHResponsibleEntityCountry}}</span></li>
                  <li>ICEDH Responsible Entity Organization: <span class="text-success">{{vm.avroMetadata.iCEDHResponsibleEntityOrganization}}</span></li>
                  <li>ICEDH Responsible Entity Suborganization: <span class="text-success">{{vm.avroMetadata.iCEDHResponsibleEntitySuborganization}}</span></li>
                  <li>ICEDH  Sci Controls: <span class="text-success">{{vm.avroMetadata.iCEDHSciControls}}</span></li>
                  <li>Image Polarization: <span class="text-success">{{vm.avroMetadata.imagePolarization}}</span></li>
                  <li>Image Representation: <span class="text-success">{{vm.avroMetadata.imageRepresentation}}</span></li>
                  <li>Image Type Code: <span class="text-success">{{vm.avroMetadata.imageTypeCode}}</span></li>
                  <li>JPEG Reduced Resolution: <span class="text-success">{{vm.avroMetadata.jpegReducedResolution}}</span></li>
                  <li>LIMDISCODE: <span class="text-success">{{vm.avroMetadata.lIMDISCODE}}</span></li>
                  <li>MBR East: <span class="text-success">{{vm.avroMetadata.mBREAST}}</span></li>
                  <li>MBR North: <span class="text-success">{{vm.avroMetadata.mBRNORTH}}</span></li>
                  <li>MBR South: <span class="text-success">{{vm.avroMetadata.mBRSOUTH}}</span></li>
                  <li>MBR West: <span class="text-success">{{vm.avroMetadata.mBRWEST}}</span></li>
                  <li>Mission ID: <span class="text-success">{{vm.avroMetadata.missionID}}</span></li>
                  <li>Observation Date Time: <span class="text-success">{{vm.avroMetadata.observationDateTime}}</span></li>
                  <li>Origination Station Id: <span class="text-success">{{vm.avroMetadata.originationStationId}}</span></li>
                  <li>Platform Name: <span class="text-success">{{vm.avroMetadata.platformName}}</span></li>
                  <li>Product Creation Date: <span class="text-success">{{vm.avroMetadata.productCreationDate}}</span></li>
                  <li>Reference Image Type Text: <span class="text-success">{{vm.avroMetadata.referenceImageTypeText}}</span></li>
                  <li>Replay Designator: <span class="text-success">{{vm.avroMetadata.replayDesignator}}</span></li>
                  <li>Resource Category Name: <span class="text-success">{{vm.avroMetadata.resourceCategoryName}}</span></li>
                  <li>Sensor Name: <span class="text-success">{{vm.avroMetadata.sensorName}}</span></li>
                  <li>Size Quantity: <span class="text-success">{{vm.avroMetadata.sizeQuantity}}</span></li>
                  <li>Target Alternate ID: <span class="text-success">{{vm.avroMetadata.targetAlternateID}}</span></li>
                  <li>Title Text: <span class="text-success">{{vm.avroMetadata.titleText}}</span></li>
                  <li>Type Text: <span class="text-success">{{vm.avroMetadata.typeText}}</span></li>
                  <li>X Axis Dimension: <span class="text-success">{{vm.avroMetadata.xAxisDimension}}</span></li>
                  <li>Y Axis Dimension: <span class="text-success">{{vm.avroMetadata.yAxisDimension}}</span></li>
              </ul>
              </div>
            </div>
            <div class="col-md-12" >
              URL: <span class="text-success avro-metadata-url">{{vm.avroMetadata.uRL}}</span>
            </div>
          </div>
          <div class="col-md-12" ng-show="!vm.showAvroMetadata">
            <div class="alert alert-warning">
              <p>Could not find Avro metadata for the selected image.</p>
            </div>
          </div>
        </uib-tab>
        <uib-tab ng-show="vm.beLookupEnabled" heading="BE" ng-click="vm.loadBeData()">
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
                    <a href="" ng-click="vm.viewOrtho(vm.selectedImage, be.geometry.coordinates)" target="_blank">
                    {{be.properties[vm.placemarkConfig.columnName]}}
                  </a>
                  </td>
                  <td>{{be.geometry.coordinates[1]}}</td>
                  <td>{{be.geometry.coordinates[0]}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </uib-tab>
      </uib-tabset>
    </div>

  </div>
</div>
<div class="modal-footer" id="modal-image-space-footer">
    <button class="btn btn-warning" type="button" ng-click="vm.cancel()">Close</button>
</div>
