package omar.app

import groovy.json.JsonSlurper
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import omar.openlayers.OpenLayersConfig
import grails.converters.JSON

import omar.ui.OmarSitesConfig

@Api(value = "/omar",
	 description = "O2 REST API"
)
class OmarController {

    def openlayers
    def preferencesService

    OpenLayersConfig openLayersConfig
    OmarSitesConfig omarSitesConfig


    @ApiOperation(
        httpMethod = "GET",
        produces = 'text/html',
        value = "Set UI features from the URL."
    )
    @ApiImplicitParams([
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'azimuth',
            paramType = 'query',
            value = 'The image\'s azimuth angle. A range can bet set with a semi-colon.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'be',
            paramType = 'query',
            value = 'A basic encyclopedia number.'
        ),
        @ApiImplicitParam(
            dataType = 'integer',
            defaultValue = '',
            name = 'cloudCover',
            paramType = 'query',
            value = 'The maximum cloud cover percentage.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'countries',
            paramType = 'query',
            value = 'An image\'s country code. Multiple can be set separated by a comma.'
        ),
        @ApiImplicitParam(
            allowableValues = 'acquisition_date,ingest_date',
            dataType = 'string',
            defaultValue = '',
            name = 'dateType',
            paramType = 'query',
            value = 'When doing a temporal search, what date on which to search.'
        ),
        @ApiImplicitParam(
            allowableValues = 'today,last3Days,lastWeek,lastMonth,last3Months,last6Months',
            dataType = 'string',
            defaultValue = '',
            name = 'duration',
            paramType = 'query',
            value = 'Simple, predefined date ranges.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'elevation',
            paramType = 'query',
            value = 'The image\'s elevation angle. A range can be set with a semi-colon.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'endDate',
            paramType = 'query',
            value = 'The end date for a custom date range.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'filename',
            paramType = 'query',
            value = 'The image\'s filename.'
        ),
	@ApiImplicitParam(	
            dataType = 'string',	
            defaultValue = '',	
            name = 'gsd',	
            paramType = 'query',	
            value = 'The image\'s ground sample distance.'	
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'imageId',
            paramType = 'query',
            value = 'The image\'s image ID.'
        ),
        @ApiImplicitParam(
            dataType = 'double',
            defaultValue = '',
            name = 'mapCenterX',
            paramType = 'query',
            value = 'The map center\'s longitude.'
        ),
        @ApiImplicitParam(
            dataType = 'double',
            defaultValue = '',
            name = 'mapCenterY',
            paramType = 'query',
            value = 'The map center\'s latitude.'
        ),
        @ApiImplicitParam(
            dataType = 'integer',
            defaultValue = '',
            name = 'mapRotation',
            paramType = 'query',
            value = 'How many degrees to rotate the map.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'mapSearch',
            paramType = 'query',
            value = 'Where the map should center in on, can be DD, DMS, MGRS, Image ID or Placename where supported.'
        ),
        @ApiImplicitParam(
            dataType = 'integer',
            defaultValue = '',
            name = 'mapZoom',
            paramType = 'query',
            value = 'What level to zoom the map to.'
        ),
        @ApiImplicitParam(
            dataType = 'boolean',
            defaultValue = '',
            name = 'mapVisibility',
            paramType = 'query',
            value = 'Whether or not to start off showing the map when the page loads.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'missions',
            paramType = 'query',
            value = 'The image\'s mission ID. Multiple can be set separated by a comma.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'niirs',
            paramType = 'query',
            value = 'The image\'s NIIRS rating. A range can bet set with a semi-colon.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'products',
            paramType = 'query',
            value = 'The image\'s product designator.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'sensors',
            paramType = 'query',
            value = 'The image\'s sensor ID. Multiple can be set separated by a comma.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'spatial',
            paramType = 'query',
            value = 'The map\'s spatial filter. "mapView", or either a POINT/POLYGON WKT.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'startDate',
            paramType = 'query',
            value = 'The start date for a custom date range.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'sunAzimuth',
            paramType = 'query',
            value = 'The image\'s sun aximuth angle. A range can be set with a semi-colon.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'sunElevation',
            paramType = 'query',
            value = 'The image\'s sun elevation angle. A range can be set with a semi-colon.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'target',
            paramType = 'query',
            value = 'The image\'s target ID.'
        ),
        @ApiImplicitParam(
            dataType = 'string',
            defaultValue = '',
            name = 'wac',
            paramType = 'query',
            value = 'The image\'s World Area Code.'
        )
    ])
    def index() {
        // user information parameters coming in from application.yml
        def userInfo = grailsApplication.config.userInfo

        // The value of the request header for the user's name
        def requestHeaderName = request.getHeader(userInfo.requestHeaderUserName)

        // We will use the requestHeaderUserNameDefault from the application.yml if the request
        // header name is null.  Otherwise we will use the value from the request.getHeader call.

        def userInfoName = (requestHeaderName == null) ? userInfo.requestHeaderUserNameDefault : requestHeaderName

        //grailsApplication.config.omar.app.sites = omarSitesConfig.sites

        def preferences
        JSON.use( "deep" ) {
            def json = preferencesService.getPreferences() as JSON
            preferences = new JsonSlurper().parseText( json.toString() )
        }
        def clientConfig = [
			about: grailsApplication.config.about,
            serverURL: getBaseUrl(),
            openlayers: grailsApplication.config.omar.openlayers, //openLayersConfig,
            params: grailsApplication.config.omar.app,
            userInfo: [name: userInfoName],
            userPreferences: preferences
        ]

        [ clientConfig: clientConfig ]
    }

    void afterPropertiesSet() throws Exception {
        openlayers = grailsApplication.config.omar.openlayers

        //  Collect baseMaps[x] named params as a list and use it to override baseMaps
        def newBaseMaps = openlayers.keySet()?.grep { it ==~ /baseMaps\[\d+\]/ }?.collect { openlayers[it] }

        if ( newBaseMaps ) {
            openlayers.baseMaps = newBaseMaps
        }
    }
}
