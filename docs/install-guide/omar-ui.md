# OMAR UI

## Purpose
The OMAR UI Service provides a user entry point for image analysis in the system. The UI provides a set of web pages and map views that expose the various OMAR functions the user via search boxes, sliders, maps, etc.

## Variables to Change
The following variables in the application.yml should be changed or overriden for your deployment:
- `banner` - Banner shown above the map view.
- `securityClassificationBanner` - Colored banner at the top and bottom.
- `about` - Dropdown with contact and version information.
- `motd` - Message of the day shown on the home page.
- `sites` - Available federations.
- `splashModal` The splash page that opens on application start up.

## Installation in Openshift

**Assumption:** The omar-ui-app docker image is pushed into the OpenShift server's internal docker registry and available to the project.

### Persistent Volumes

OMAR UI does not require any persistent volume storage.

### Environment variables

|Variable|Value|
|------|------|
|SPRING_PROFILES_ACTIVE|Comma separated profile tags (*e.g. production, dev*)|
|SPRING_CLOUD_CONFIG_LABEL|The Git branch from which to pull config files (*e.g. master*)|
