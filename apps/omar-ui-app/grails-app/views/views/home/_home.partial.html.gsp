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
      <div class="col-md-4">
        <div class="text-center well">
          <div>
            <h2>Search</h2>
            <span class="fa fa-search fa-3x text-info"></span>
          </div>

          <div style="padding-bottom: 24px; padding-top: 24px">
            <p>Search and discover various types of imagery. Use this as a starting
              point for filtering, sorting, and assembling imagery into a collection</p>
          </div>

          <a type="button" class="btn btn-success" ui-sref="map">View</a>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-center well">
          <div>
            <h2>Time Lapse Viewer</h2>
            <span class="fa fa-history fa-3x text-info"></span>
          </div>

          <div style="padding-bottom: 24px; padding-top: 24px">
            <p>An on-demand imagery flipbook</p>
          </div>

          <a type="button" class="btn btn-success" ng-href="{{home.tlvAppLink}}" target="_blank">View</a>
        </div>
      </div>
      <div ng-init="max=10" ng-show="{{home.kmlAppEnabled}}" class="col-md-4">
        <div class="text-center well">
          <div>
            <h2>KML</h2>
            <span class="fa fa-map fa-3x text-info"></span>
          </div>

          <div style="padding-bottom: 24px; padding-top: 24px">
            <p>Download a KML of the last &nbsp; <input style="width:35px" type="number" ng-model="max"> &nbsp; images acquired</p>
          </div>

          <a type="button" class="btn btn-success" ng-href="{{home.kmlAppLink}}?max={{max}}" target="_blank">Download</a>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="text-center well">
          <div>
            <h2>GeoRSS</h2>
            <span class="fa fa-rss fa-3x text-info"></span>
          </div>

          <div style="padding-bottom: 24px; padding-top: 24px">
            <p>
              <i
                      class="fa fa-info-circle text-info cursor-pointer"
                      style="font-size: 12px;"
                      aria-hidden="true"
                      popover-placement="top"
                      uib-popover="A browser
              extension is required for Internet Explorer and
                Chrome.  Firefox has built in support
                for RSS feeds."></i>
              Create a GeoRSS feed of the images
            </p>
            <form class="form-inline">
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
              </div>
            </form>
          </div>

          <a
                  type="button"
                  class="btn btn-success"
                  ng-click="home.handleSelectedGeoRssType()"
                  target="_blank">Create</a>
        </div>
      </div>
      <div ng-show="{{home.uploadAppEnabled}}" class="col-md-4">
        <div class="text-center well">
          <div>
            <h2>Image Upload</h2>
            <span class="fa fa-upload fa-3x text-info"></span>
          </div>

          <div style="padding-bottom: 24px; padding-top: 24px">
          <p>A place to upload images</p>
          </div>

          <a type="button" class="btn btn-success" ng-href="{{home.uploadAppLink}}" target="_blank">Go</a>
        </div>
      </div>
    </div>
  </div>
</div>
