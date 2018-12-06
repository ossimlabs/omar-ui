package omar.app

import groovy.json.JsonSlurper
import omar.openlayers.OmarOpenlayersUtils
import omar.openlayers.OpenLayersConfig
import org.springframework.beans.factory.InitializingBean
import grails.converters.JSON

import omar.ui.OmarSitesConfig

class OmarController {

  def openlayers
  def preferencesService

  OpenLayersConfig openLayersConfig
  OmarSitesConfig omarSitesConfig

  def index() {

    // user information parameters coming in from application.yml
    def userInfo = grailsApplication.config.omar.app.userInfo

    // The value of the request header for the user's name
    def requestHeaderName = request.getHeader(userInfo.requestHeaderUserName)

    // We will use the requestHeaderUserNameDefault from the application.yml if the request
    // header name is null.  Otherwise we will use the value from the request.getHeader call.

    def userInfoName = (requestHeaderName == null) ?
      userInfo.requestHeaderUserNameDefault : requestHeaderName

    grailsApplication.config.omar.app.sites = omarSitesConfig.sites

      def preferences
      JSON.use( "deep" ) {
        def json = preferencesService.getPreferences() as JSON
        preferences = new JsonSlurper().parseText( json.toString() )
      }
      def clientConfig = [
        serverURL: getBaseUrl(),
        openlayers: openLayersConfig,
        params: grailsApplication.config.omar.app,
        userInfo: [name: userInfoName],
        userPreferences: preferences
      ]

  		[
  				clientConfig: clientConfig
  		]
	}

  void afterPropertiesSet() throws Exception {
      openlayers = grailsApplication.config.omar.openlayers

      //  Collect baseMaps[x] named params as a list and use it to override baseMaps
      def newBaseMaps = openlayers.keySet()?.grep { it ==~ /baseMaps\[\d+\]/ }?.collect { openlayers[it] }

      if ( newBaseMaps )
      {
          openlayers.baseMaps = newBaseMaps
      }

      // println openlayers as JSON
  }
}
