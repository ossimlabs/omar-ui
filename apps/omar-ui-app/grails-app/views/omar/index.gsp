<%@ page contentType="text/html;charset=UTF-8" %>
<html ng-app="omarApp">
<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>O2</title>

  <!-- Hide this line for IE (needed for Firefox and others) -->
  <![if !IE]>
      <asset:link rel="icon" href="favicon.png" type="image/x-icon"/>
  <![endif]>
  <!-- This is needed for IE -->
  <asset:link rel="icon" href="favicon.ico?v=2" type="image/icon"/>

  <asset:stylesheet src="app.manifest.css"/>

    <browser:isMsie>
        <asset:stylesheet src="element.visibility.css"/>
    </browser:isMsie>

</head>
  <body>
    <o2:classificationBanner/>
    <div class="container-fluid">
      <nav style="margin-top: -15px;" class="navbar navbar-inverse" role="navigation" ng-controller="NavController as nav">
        <div class="collapse navbar-collapse" id="main-navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href = javascript:void(0) class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <asset:image src="o2-logo.png" style="width: 20px; height: 20px;"/>
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a ui-sref="home">&nbsp;Home</a></li>
                <li><a title="Search and discover various types of imagery." ui-sref="map">&nbsp;Map</a></li>
                <li ng-show="{{nav.kmlAppEnabled}}"><a ng-href="{{nav.kmlAppLink}}" title="Download a KML of the last 10 images acquired." target="_blank">&nbsp;KML</a></li>
                <li ng-show="{{nav.piwikAppEnabled}}"><a ng-href="{{nav.piwikAppLink}}" title="View O2 web analytics." target="_blank">&nbsp;PIWIK</a></li>
                <li ng-show="{{nav.tlvAppEnabled}}"><a ng-href="{{nav.tlvAppLink}}" title="An on-demand imagery flipbook<" target="_blank">&nbsp;TLV</a></li>
                <li ng-show="{{nav.userGuideEnabled}}"><a ng-href="{{nav.userGuideLink}}" target="_blank">&nbsp;User Guide</a></li>
                <li ng-show="{{nav.apiAppEnabled}}"><a ng-href="{{nav.apiAppLink}}" target="_blank">&nbsp;API</a></li>
              </ul>
            </li>
            <li class="nav-title-left" ng-bind-html="nav.titleLeft" style="cursor:default"></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown mega-dropdown" ng-show="nav.metricsShow">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                aria-expanded="false"><span class="fa fa-dashboard" aria-hidden="true"></span>
                <span class="caret"></span></a>
              <ul class="dropdown-menu mega-dropdown-menu row" ng-click="$event.stopPropagation();">
                <li class="col-sm-12">
                  <ul>
                    <li class="dropdown-header text-center">
                      <p class="text-center">Metrics</p>
                    </li>
                    <li class="metrics-row">
                      <hr>
                      <div ng-href="" class="metrics-message text-center">User</div>
                      <label>Eureka</label>
                      <a ng-href="{{nav.metricsEurekaUrl}}" target="_blank" class="btn btn-info btn-block btn-metrics" role="button">Service Health & Status</a>
                      <hr class="metrics-hr">
                      <div class="metrics-message text-center">System</div>
                      <label>Hystrix/Turbine</label>
                      <a ng-href="{{nav.metricsHystrixTurbineUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Real-time Insight/System Behavior</a>
                      <label>Sleuth/Zipkin</label>
                      <a ng-href="{{nav.metricsSleuthZipkinUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Distributed Tracing</a>
                      <label>Kibana</label>
                      <a ng-href="{{nav.metricsKibanaUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Dashboard</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li class="dropdown mega-dropdown" ng-show="nav.aboutShow">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                aria-expanded="false"><span class="fa fa-question-circle" aria-hidden="true"></span>
                <span class="caret"></span></a>
              <ul class="dropdown-menu mega-dropdown-menu row about-menu" ng-click="$event.stopPropagation();">
                <li class="col-sm-12">
                  <ul>
                    <li class="dropdown-header text-center">
                      <p class="text-center">About</p>
                    </li>
                    <li class="about-row">
                      <div class="col-sm-12">
                        <span class="about-message">{{nav.aboutMessage}}</span>
                        <hr>
                        <p class="small"><span class="text-info">Release:</span>  {{nav.aboutReleaseName}}</p>
                        <p class="small"><span class="text-info">Release Number:</span>  {{nav.aboutReleaseNumber}}</p>
                        <hr>
                        <p class="small"><span class="text-info">UI Build Version:</span> <g:meta name="info.app.version"/></p>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div ui-view></div>
    </div>
    <o2:classificationBanner position="bottom" />
    <asset:script>

      var AppO2 = (function () {

        var APP_CONFIG = ${raw( clientConfig.encodeAsJSON() as String )};

        return {

            APP_CONFIG: APP_CONFIG

        }

      })();

    </asset:script>
    <asset:deferredScripts/>
    <asset:javascript src="app.manifest.js"/>

  </body>
</html>
