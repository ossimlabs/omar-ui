<!-- partial-home.html -->
<div ng-controller="HomeController as home">
  <div class="jumbotron text-center" style="margin-top: -15px;">
    <div class="col-md-8 col-md-offset-2">
      <h1>{{home.title}}</h1>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row" style="margin-top: -20px;" ng-show="home.showMotd">
      <div class="col-md-8 col-md-offset-2">
        <div class="alert alert-info motd-banner text-center" style="margin-bottom: 10px;"><h4><strong><i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;Info:</strong>&nbsp;&nbsp;{{home.motd}}</h4></div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3" ui-sref="map">
        <div class="text-center well well-home" style="padding-bottom: 24px">
          <h2>Map</a></h2>
          <div><span class="fa fa-search fa-3x text-info"></span></div>
          <br>
          <p>Search and discover various types of imagery. Use this as a starting
            point for filtering, sorting, and assembling imagery into a collection</p>
          <a type="button" class="btn btn-success" ui-sref="map">View</a>
        </div>
      </div>
      <div ng-show="{{home.tlvAppEnabled}}" class="col-md-3" ng-click="home.go(home.tlvAppLink);">
        <div class="text-center well well-home" style="padding-bottom: 24px" ng-href="{{home.tlvAppLink}}" target="_blank">
          <h2>Time Lapse Viewer</h2>
          <div><span class="fa fa-history fa-3x text-info"></span></div>
          <br>
          <br>
          <p>An on-demand imagery flipbook</p>
          <br><br>
          <a type="button" class="btn btn-success" target="_blank">View</a>
        </div>
      </div>
      <div ng-init="max=10" ng-show="{{home.kmlAppEnabled}}" class="col-md-3">
        <div class="text-center well">
          <h2>KML</h2>
          <div><span class="fa fa-map fa-3x text-info"></span></div>
          <br>
          <p>Download a KML of the last &nbsp; <input style="width:35px" type="number" ng-model="max"> &nbsp; images acquired</p>
          <br>
          <br>
          <a type="button" class="btn btn-success" ng-href="{{home.kmlAppLink}}?max={{max}}" target="_blank">Download</a>
        </div>
      </div>

      <div class="col-md-3">
        <div class="well">
          <div class="text-center">
            <h2>GeoRSS</h2>
            <div><span class="fa fa-rss fa-3x text-info"></span></div>
            <br>
            <p>Create a GeoRSS feed of the images</p>
          </div>
          <form class="form-inline">
            <!-- <div class="form-group">
              <label>Country Code</label>
              <input style="width:35px" ng-model="rssCc">
            </div>
              <a
                type="button"
                class="btn btn-xs btn-success"
                ng-href="{{home.geoRssCcAppLink}}{{rssCc}}"
                target="_blank">Submit
              </a>
            <br>
            <div class="form-group">
              <label>BE Number</label>
              <input style="width:35px" ng-model="rssBe">
            </div>
            <a
              type="button"
              class="btn btn-xs btn-success"
              ng-href="{{home.geoRssBeNumbAppLink}}{{rssBe}}"
              target="_blank">Submit
            </a> -->

            <div class="text-center">

              <div class="form-group">
                <select ng-change="home.handleGeoRssPlaceholderChange()" class="form-control input-sm" ng-model="home.geoRssType">
                  <option value="countryCode">Country Code</option>
                  <option value="beNumber">BE Number</option>
                </select>
                <input
                  class="form-control input-sm"
                  style="width: 120px;"
                  ng-model="home.geoRssInput"
                  placeholder="{{home.geoRssPlaceHolder}}">
              </div>
              <br>
              <br>
              <a
                type="button"
                class="btn btn-success"
                ng-click="home.handleSelectedGeoRssType()"
                target="_blank">Create</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
