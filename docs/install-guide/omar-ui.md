# OMAR UI

## Dockerfile
```
FROM omar-base
EXPOSE 8080
RUN mkdir /usr/share/omar
COPY omar-ui-app-1.0.0-SNAPSHOT.jar /usr/share/omar
RUN chown -R 1001:0 /usr/share/omar
RUN chown 1001:0 /usr/share/omar
RUN chmod -R g+rw /usr/share/omar
RUN find $HOME -type d -exec chmod g+x {} +
USER 1001
WORKDIR /usr/share/omar
CMD java -server -Xms256m -Xmx1024m -Djava.awt.headless=true -XX:+CMSClassUnloadingEnabled -XX:+UseGCOverheadLimit -Djava.security.egd=file:/dev/./urandom -jar omar-ui-app-1.0.0-SNAPSHOT.jar
```
Ref: [omar-base](../../../omar-base/docs/install-guide/omar-base/)

## JAR
[https://artifactory.ossim.io/artifactory/webapp/#/artifacts/browse/tree/General/omar-local/io/ossim/omar/apps/omar-ui-app](https://artifactory.ossim.io/artifactory/webapp/#/artifacts/browse/tree/General/omar-local/io/ossim/omar/apps/omar-ui-app)

## Configuration
You can insert additional [Common Config Settings](../../../omar-common/docs/install-guide/omar-common/#common-config-settings)

* **omar**
    * **openlayers**
      * **baseMaps** Allows one to control the layers added to the base maps section of openlayers on the ortho view and map view pages in the omar-app. If you do not have this field specified in the application YAML it will use the default layer. The default layer is the **OSM Basic** layer from https://omar-dev.ossim.io.
    * **app**
      * **sites** A list of federated omar sites
        * **info**
          * **name** Short name for the omar site
          * **description** Long name/description of the site.  This is displayed in the dropdown in the UI
        * **url**
          * **base** Base URL for the federated site
          * **uiContextPath** Optional context path for the UI
          * **wfsContextPath** Optional context path for the WFS
          * **wmsContextPath** Optional context path for the WMS
          * **omsContextPath** Optional context path for OMS
          * **geoscriptContextPath** Optional context path for geoscript
          * **avroMetadataContextPath** Optional context path for Avro Metadata
          * **mensaContextPath** Optional context path for Mensa
          * **stagerContextPath** Optional context path for Stager
          * **downloadContextPath** Optional context path for Download
          * **kmlContextPath** Optional context path for KML Superoverlay
          * **jpipContextPath** Optional context path for JPIP
          * **wmtsContextPath** Optional context path for WMTS
          * **tlvContextPath** Optional context path for TLV UI
          * **isaContextPath** Optional context path for ISA UI
      * **footprints**
        * **params** Misc. params for the wfs request
          * **name** Name for the footprint layer.  Shows up in UI's layerswitcher
          * **version** WFS version number
          * **layers** Layer name
          * **styles** Styling for the footprint layer. Choices are (byFileType, bySensorType, byMissionType)
          * **format** Image format. Example: 'image/gif'
      * **apiApp**
        * **baseUrl** URL of aggregated API's for O2 services
        * **enabled** Used to show/hide the API link on the O2 home page (True or False )
      * **isaApp**
        * **enabled** Used to show/hide the export to ISA app link in the UI (True or False)
      * **tlvApp**
        * **enabled** Used to show/hide the various links to the TLV app in the UI (True or False)
      * **twofishes**
        * **baseUrl** URL of Twofishes search service.  Used for geocoding place names
        * **proxy** Context for the Twofishes search service
      * **kmlApp**
        * **enabled** Used to show/hide the KML Superoverlay buttons in the UI (True or False)
      * **jpipApp**
        * **enabled** Used to show/hide the JPIP buttons in the UI (True or False)
      * **wmtsApp**
        * **enabled** Used to turn on the WMTS links (True or False)
      * **piwikApp**
        * **enabled** Used to show/hide the PIWIK app link on the O2 home page (True or False )
      * **userGuide**
        * **baseUrl** URL of the userGuide
        * **enabled** Used to show/hide the user guide links
      * **misc** Base settings for the O2 UI general configuration
        * **beLookupEnabled** Enable BE number lookups in the search field.
        * **placemarks** The placemarks uses the WFS query engine to query placemark locations based on BE numbers.  
          * **tableName** Namespace and table name where the BE's are stored and is a WFS tableId entry.
          * **columName** The table column with the BE list
          * **geomName** The spatial column in the BE table
          * **maxResults** The maximum number of BE items to return in a query
        * **listRefreshButtonVisible** Display or hide the refresh button in the Sort menu.
        * **totalPaginationCount** is used to limit the number of items to paginate through.  
        * **pageLimit** is used to identify the number of items to show per page.
        * **motd** Message of The Display Banner settings
         * **message** Text for the message of the day
         * **enabled** Used to show/hide the message of the day banner
        * **about** About dropdown settings
          * **message** Optional about message
          * **releaseName** O2 release name
          * **releaseNumber** O2 release version number
          * **enabled** Used to show/hide the About dropdown
        * **metrics** Metrics dropdown menu settings
          * **enabled** Used to show/hide the Metrics dropdown menu in the UI
          * **user** Settings for the User section of the metrics dropdown
            * **enabled** Used to show/hide the User section of the metrics dropdown
            * **eureka**
              * **baseUrl** URL of the Eureka server used to show system status
              * **enabled** Used to show/hide the Service Health & Status button
          * **admin** Settings for the Admin section of the metrics dropdown
            * **enabled** Used to show/hide the Admin section of the Metrics dropdown menu
            * **hystrixTurbine** Hystrix and Turbine link settings
              * **baseUrl** URL of the Hystrix and Turbine page
              * **enabled** Used to show/hide the Real-time Insight/System Behavior button
            * **sleuthZipkin** Sleuth and Zipkin link setttings
              * **baseUrl** URL of the Sleuth and Zipkin page
              * **enabled** Used to show/hide the Distributed Tracing button
            * **kibana** Kibana dashboard settings
              * **baseUrl** URL of the Kibana dashboard
              * **enabled** Used to show/hide the Dashboard button


* **classificationBanner**
  * **backgroundColor** Can be named values such as "red", "green", "yellow" , ... etc. or you can specify an exact color using the CSS styling format.  For example, if you wanted white banners you can set the value to "#FFFFFF" and if you wanted red you can also use the value "#FF0000".
  * **classificationType** This is the string displayed in the banners.  So setting to "My Secret Stuff" would print that string at the top and bottom of every page with a background color identified by the **backgroundColor** field
