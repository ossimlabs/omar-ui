package omar.ui

import groovy.transform.ToString
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix="omar.app",ignoreInvalidFields=true,merge=false)
@ToString(includeNames=true)
class OmarSitesConfig
{
  List<Map<String,Object>> sites


}
