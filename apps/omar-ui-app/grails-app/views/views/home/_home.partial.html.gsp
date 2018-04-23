<!-- partial-home.html -->
<div ng-controller="HomeController as home">
  <div class="jumbotron text-center">
    <div class="col-md-8 col-md-offset-2">
      <h1>{{home.title}}</h1>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row" ng-show="home.showMotd">
      <div class="col-md-8 col-md-offset-2">
        <div class="alert alert-info motd-banner text-center"><h4><strong><i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;Info:</strong>&nbsp;&nbsp;{{home.motd}}</h4></div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3" ui-sref="map">
        <div class="text-center well well-home">
          <h2>Map</a></h2>
          <div><span class="fa fa-search fa-3x text-info"></span></div>
          <br>
          <p>Search and discover various types of imagery. Use this as a starting
            point for filtering, sorting, and assembling imagery into a collection</p>
          <a type="button" class="btn btn-success" ui-sref="map">View</a>
        </div>
      </div>
      <div ng-show="{{home.tlvAppEnabled}}" class="col-md-3" ng-click="home.go(home.tlvAppLink);">
        <div class="text-center well well-home" ng-href="{{home.tlvAppLink}}" target="_blank">
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
            <p>Download a GeoRSS feeds of the images</p>
          </div>
          <p>Country Code:  <input style="width:35px" ng-model="rssCc"> <a type="button" class="btn btn-xs btn-success" ng-href="{{home.geoRssCcAppLink}}{{rssCc}}" target="_blank">Download</a></p>
          <p>BE Number:  <input style="width:35px" ng-model="rssBe"> <a type="button" class="btn btn-xs btn-success" ng-href="{{home.geoRssBeNumbAppLink}}{{rssBe}}" target="_blank">Download</a></p>
          <br>
          <br>
        </div>
      </div>

    </div>
    <div class="row">
      <div ng-show="{{home.piwikAppEnabled}}" class="col-md-6" ng-click="home.go(home.piwikAppLink);">
        <div class="text-center well well-home" ng-href="{{home.piwikAppLink}}" target="_blank">
          <h2>PIWIK</h2>
          <div><span class="fa fa-bar-chart fa-3x text-info"></span></div>
          <br>
          <p>View O2 web analytics. Track Key Performance Indicators such as visits, goal conversions
            rates, downloads, keywords and more</p>
          <br>
          <a type="button" class="btn btn-success" ng-href="{{home.piwikAppLink}}" target="_blank">View</a>
        </div>
      </div>
    </div>
  </div>
</div>
