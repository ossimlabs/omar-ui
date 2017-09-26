package omar.app

import omar.openlayers.OmarOpenlayersUtils
import omar.openlayers.OpenLayersConfig
import org.springframework.beans.factory.InitializingBean
import grails.converters.JSON

import omar.ui.OmarSitesConfig

class OmarController /*implements InitializingBean*/
{
  def openlayers
  def userInfo

  OpenLayersConfig openLayersConfig
  OmarSitesConfig omarSitesConfig

  def index()
  {

    userInfo = grailsApplication.config.omar.app.userInfo

    grailsApplication.config.omar.app.sites = omarSitesConfig.sites

      def clientConfig = [
        serverURL: getBaseUrl(),
        openlayers: openLayersConfig,
        params: grailsApplication.config.omar.app,
        userInfo: [
          name: request.getHeader(userInfo.requestHeaderUserName)?:userInfo.requestHeaderUserNameDefault
        ]
      ]

  		[
  				clientConfig: clientConfig
  		]
	}

  void afterPropertiesSet() throws Exception
  {
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
