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
`http://artifacts.radiantbluecloud.com/artifactory/webapp/#/artifacts/browse/tree/General/omar-local/io/ossim/omar/apps/omar-ui-app`

## Configuration
You can insert additional [Common Config Settings](../../../omar-common/docs/install-guide/omar-common/#common-config-settings).

```
omar:
  openlayers:
    baseMaps:
      -
        layerType: "tilewms"
        title: "Open Street Map"
        url: "http://vmap0.tiles.osgeo.org/wms/vmap0"
        params:
          layers: "basic,coastline_01,coastline_02,priroad,secroad,rail,ferry,tunnel,bridge,trail,CAUSE,clabel,statelabel,ctylabel"
          format: "image/jpeg"
        options:
          visible: false
 app:
    wfs:
      baseUrl: ${serverProtocol}://${serverName}/omar-wfs/wfs?
      enabled: true
      proxy: /proxy/index?url=
    wms:
      baseUrl: ${serverProtocol}://${serverName}/omar-wms/wms?
      enabled: true
    imageSpace:
      baseUrl: ${serverProtocol}://${serverName}/omar-oms/imageSpace
      enabled: true
    thumbnails:
      baseUrl: ${serverProtocol}://${serverName}/omar-oms/imageSpace/getThumbnail
    footprints:
      baseUrl: ${serverProtocol}://${serverName}/omar-wms/footprints/getFootprints
      params:
        name: "Image Footprints"
        version: '1.1.1'
        layers: 'omar:raster_entry'
        styles: 'byFileType'
        format: 'image/gif'
    mensaApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-mensa/mensa
    stagerApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-stager
    downloadApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-download
    kmlApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-superoverlay
    predio:
      baseUrl: ${serverProtocol}://${serverName}/predio/
      enabled: false
    twofishes:
      baseUrl: http://twofishes:8081
      proxy: /twoFishesProxy
    isaApp:
      baseUrl: ${serverProtocol}://${serverName}/isa
      enabled: true
    tlvApp:
      baseUrl: ${serverProtocol}://${serverName}/tlv
      enabled: true
    swipeApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-swipe/swipe
      enabled: false
    jpipApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-jpip/jpip
      enabled: false
    wmtsApp:
      baseUrl: ${serverProtocol}://${serverName}/omar-wmts/index
      enabled: false
    piwikApp:
      baseUrl: ${serverProtocol}://${serverName}/piwik/
      enabled: false
    apiApp:
      baseUrl: ${serverProtocol}://${serverName}/api
      enabled: false
    userGuide:
      baseUrl: ${serverProtocol}://${serverName}/omar-docs/
      enabled: true
    misc:
      icons:
        green-marker: search_marker_green.png
    totalPaginationCount: 1000
    pageLimit: 10


classificationBanner:
  backgroundColor: green
  classificationType: Unclassified

```

* **omar.openlayers.baseMaps** Allows one to controll the layers added to the base maps section of openlayers on the ortho view and map view pages in the omar-app. If you do not have this field specified in the application YAML it ill use the default layers. The default layers includes **Open Street Map** layer, **Natural Earth** layer, and a **Blue Marble** layer.
* **omar.app.root** Root settings for the rot url.
 * **baseURL** Base URL for the omar-app
* **omar.app.wfs** Base URL and flag for WFS.
 * **baseURL** Base URL for the WFS service
 * **enabled** Flag used to specify if the WFS service is enabled and ready
* **omar.app.wms** Base URL and settings for the WMS service.
 * **baseURL** Base URL for the WMS service call
 * **enabled** Flag used to specify if the WMS service is enabled
* **omar.app.imageSpace** Specifies the base settings for the image space services
 * **baseURL** Base URL for the image space services.  Because of the dependencies for WMS the baseURL can use the path to the IP/DNS location of the WMS service. In the above example we have a proxy called wms-app that points to the base WMS service on your WMS instance.
 * **enabled** specifies whether the image space services are enabled
* **omar.app.thunbnails** Base settings for thumbnail generation
 * **baseURL**  Base URL for the thumbnail service. Because of the dependencies for WMS the baseURL can use the path to the IP/DNS location of the WMS service. In the above example we have a proxy called wms-app that points to the base WMS service on your WMS instance.
* **omar.app.footprints** Base settings for footprints
 * **baseURL** Base URL for the footprints service.   Because of the dependencies for WMS the baseURL can use the path to the IP/DNS location of the WMS service. In the above example we have a proxy called wms-app that points to the base WMS service on your WMS instance.
* **omar.app.kmlApp** Base settings for super overlay
 * **baeURL** Base URL for the KML superoverlay service.
* **omar.app.predio** Base settings for predictionIO
 * **baseURL** Base URL for the location of the Prediction IO service API.
* **omar.app.twofishes** Base settings for twofishes
 * **baseURL** Base URL for the Twofishes service.  This provide geolocation for coutry names, .. etc.
* **omar.app.swipeApp** Base settings for swipe service
 * **baseURL** Base URL for the swipe service.
* **omar.app.jpipApp** Base settings for thumbnail generation
 * **baseURL** Base URL for the JPIP service.
 * **enabled** Allows one to specify if the service is enabled.
* **omar.app.misc** Base settings for the O2 UI general configuration
 * **beLookupEnabled** Enable BE number lookups in the search field.
 * **placemarks** The placemarks uses the WFS query engine to query placemark locations based on BE numbers.  the table name is the namespace and table name where the be's are stored and is a WFS tableId entry.  The other columns specified is the be name "be" and the spatial column name "location".  Note, "location" and "be" are arbitrary and should match the column names in the BE table you have imported.  
 * **totalPaginationCount** is used to limit the number of items to paginate through.  
 * **pageLimit** is used to identify the number of items to show per page. 
* **classificationBanner**
 * **backgroundColor** Can be named values such as "red", "green", "yellow" , ... etc. or you can specify an exact color using the CSS styling format.  For example, if you wanted white banners you can set the value to "#FFFFFF" and if you wanted red you can also use the value "#FF0000".
 * **classificationType** This is the string displayed in the banners.  So setting to "My Secret Stuff" would print that string at the top and bottom of every page with a background color identified by the **backgroundColor** field

