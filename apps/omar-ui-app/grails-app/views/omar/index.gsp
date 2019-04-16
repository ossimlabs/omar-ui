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

  <asset:stylesheet src = "webjars/bootswatch/3.3.5+4/${ clientConfig.userPreferences.pageTheme }/bootstrap.min.css"/>
  <asset:stylesheet src="app.manifest.css"/>

    <browser:isMsie>
        <asset:stylesheet src="element.visibility.css"/>
    </browser:isMsie>

</head>
  <body>
    <o2:securityClassificationBanner/>
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
                <li><a title="Search and discover various types of imagery." ui-sref="map">&nbsp;Search</a></li>
                <li ng-show="{{nav.kmlAppEnabled}}"><a ng-href="{{nav.kmlAppLink}}" title="Download a KML of the last 10 images acquired." target="_blank">&nbsp;KML</a></li>
                <li ng-show="{{nav.piwikAppEnabled}}"><a ng-href="{{nav.piwikAppLink}}" title="View O2 web analytics." target="_blank">&nbsp;PIWIK</a></li>
                <li ng-show="{{nav.tlvAppEnabled}}"><a ng-href="{{nav.tlvAppLink}}" title="An on-demand imagery flipbook<" target="_blank">&nbsp;TLV</a></li>
                <li ng-show="{{nav.userGuideEnabled}}"><a ng-href="{{nav.userGuideLink}}" target="_blank">&nbsp;User Guide</a></li>
                <li ng-show="{{nav.apiAppEnabled}}"><a ng-href="{{nav.apiAppLink}}" target="_blank">&nbsp;API</a></li>
              </ul>
            </li>
            <li class = "nav-title-left">
                <form id = "searchForm" class = "searchForm">
                    <div class = "input-group input-group-sm">
                        <input id = "magicSearchInput" type = "text" class = "form-control" placeholder = "BE, Coordinate, Image ID or Placename" autofocus>
                        <span class = "input-group-btn">
                            <button class = "btn btn-info" type = "button" ng-click = "nav.magicSearchFunction()">
                                <span class = "glyphicon glyphicon-search"></span>
                            </button>
                            <button class = "btn btn-default" type = "button" onclick = "javascript: $( '#magicSearchInput' ).val( '' )">
                                <span class = "glyphicon glyphicon-remove"></span>
                            </button>
                        </span>
                    </div>
                </form>
            </li>
          </ul>
          <ul class="nav navbar-nav" ng-show="${grailsApplication.config.banner.enabled}" style = "cursor: text;">
            <div class="release-field" uib-tooltip="${grailsApplication.config.banner.description}">${grailsApplication.config.banner.text}</div>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <!-- Current user -->

            <li class="dropdown mega-dropdown" ng-show="nav.metricsShow" tooltip-placement="bottom" uib-tooltip="User Preferences">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <span class="fa fa-user" aria-hidden="true"></span>
                &nbsp;
                <span ng-bind="nav.userName">Loading...</span>
                <span class="caret"></span></a>
              <ul class="dropdown-menu mega-dropdown-menu row" ng-click="$event.stopPropagation();">
                <li class="col-sm-12">
                  <ul>
                    <li class="dropdown-header text-center">
                      <p class="text-center">User</p>
                    </li>
                    <li class="metrics-row">
                      <!-- User area -->
                      <a class="btn btn-success btn-block btn-metrics" ng-href="{{nav.preferencesUrl}}" role="button" target = "_blank">Update Preferences</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <!-- Metrics dropdown menu -->
            <li class="dropdown mega-dropdown" ng-show="nav.metricsShow" tooltip-placement="bottom"
            uib-tooltip="Display various metrics about the O2 deployment">
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
                      <!-- Metrics User area -->
                      <div ng-show="nav.metricsUserShow">
                        <hr>
                        <div ng-href="" class="metrics-message text-center">User</div>
                        <a ng-href="{{nav.metricsEurekaUrl}}" target="_blank" class="btn btn-info btn-block btn-metrics" role="button">Service Health & Status</a>
                      </div>
                      <!-- Metrics Admin area -->
                      <div ng-show="nav.metricsAdminShow">
                        <hr class="metrics-hr">
                        <div class="metrics-message text-center">System</div>
                        <div ng-show="nav.metricsHystrixTurbineEnabled">
                          <!-- <label>Hystrix/Turbine</label> -->
                          <a ng-href="{{nav.metricsHystrixTurbineUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Real-time Insight/System Behavior</a>
                        </div>
                        <div ng-show="nav.metricsSleuthZipkinEnabled">
                          <!-- <label>Sleuth/Zipkin</label> -->
                          <a ng-href="{{nav.metricsSleuthZipkinUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Distributed Tracing</a>
                        </div>
                        <div ng-show="nav.metricsKibanaEnabled">
                          <!-- <label>Kibana</label> -->
                          <a ng-href="{{nav.metricsKibanaUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Kibana Dashboard</a>
                        </div>
                        <div ng-show="nav.metricsSpringBootAdminEnabled">
                          <!-- <label>Admin</label> -->
                          <a ng-href="{{nav.metricsSpringBootAdminUrl}}" target="_blank" class="btn btn-success btn-block btn-metrics" role="button">Administration</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <!-- About dropdown menu -->
            <li class="dropdown mega-dropdown" ng-show="nav.aboutShow" tooltip-placement="bottom"
            uib-tooltip="View installation information regarding the O2 deployment">
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
                        <p class="small"><span class="text-info">Contact: </span><a href = "mailto:{{nav.aboutContactEmail}}">{{nav.aboutContactEmail}}</a></p>
                        <p class="small"><span class="text-info">Release: </span><span>{{nav.aboutReleaseName}}</span></p>
                        <p class="small"><span class="text-info">Release Number: </span><span>{{nav.aboutReleaseNumber}}</span></p>
                        <p class="small"><span class="text-info">Deployment: </span><span>${System.getenv("DEPLOYMENT_TARGET")}</span></p>
                        <hr>
                        <p class="small"><span class="text-info">UI Build Version:</span><span> <g:meta name="info.app.version"/></span></p>
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

      <!-- Splash Modal -->
      <div ng-controller="SplashController as splash">
        <script type="text/ng-template" id="splashModalContent.html">
          <div class="modal-header">
            <div class="text-center">
              <div class="alert alert-info">
                <h3 class="modal-title" id="modal-title">{{vm.splashModalHeader}}</h3>
              </div>
            </div>
          </div>
          <div class="modal-body" id="modal-body">
            <p class="text-center">
              {{vm.splashModalMessage}}
            </p>
          </div>
          <div class="modal-footer">
            <div class="text-center">
              <button class="btn btn-success" type="button" ng-click="vm.ok()" autofocus> <i class="fa fa-check" aria-hidden="true"></i>&nbsp;&nbsp;OK</button>
            </div>
          </div>
        </script>
      </div>

    </div>
    <asset:script>

      var AppO2 = (function () {

        var APP_CONFIG = ${raw( clientConfig.encodeAsJSON() as String )};
        APP_CONFIG.contextPath = "${ request.contextPath }";

        return {

            APP_CONFIG: APP_CONFIG

        }

      })();

        // used to share the map canvas between windows
        var mapCanvas;
    </asset:script>
    <asset:deferredScripts/>
    <asset:javascript src="app.manifest.js"/>

  </body>
</html>
