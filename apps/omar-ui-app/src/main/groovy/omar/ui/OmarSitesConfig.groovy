package omar.ui

import groovy.transform.ToString
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationPropertiesBinding
import org.springframework.core.convert.converter.Converter

@ConfigurationProperties(prefix="omar.app",ignoreInvalidFields=true,merge=false)
@ToString(includeNames=true)
class OmarSitesConfig
{
  List<OmarConfig> sites

  @ToString(includeNames=true)
  static class OmarConfig {
      Map<String,String> info
      Map<String,String> url
  }

  @ConfigurationPropertiesBinding
  static class OmarConfigConverter implements Converter<Map<String, String>, OmarConfig>
  {
    @Override
    OmarConfig convert(Map<String, String> map)
    {
      return new OmarConfig( map )
    }
  }
}
