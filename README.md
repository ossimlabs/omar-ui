# omar-ui

## Description

The OMAR UI services provides the user an entry point to conveniently interact with OMAR and its supported services.

## How to use local OMAR services for OMAR UI
Set this environment variable on your system: `O2_INLINE_BUILD=true`.

Go to the `settings.gradle` and look for the services in `def modules`. Clone those on the same directory level as this project and build everyone of them by going through the `omar-<project>/plugins/omar-<project>` and running `gradle clean install`.

Go to `apps/omar-ui-app` and run `gradle assemble`.

## How to run a local OMAR UI
Install PostgreSQL `docker pull postgres`.

Build the OMAR UI `gradle assemble`.

Go to `docker` and run `docker-compose -f dev-compose.yml up`.

Go to `apps/omar-ui-app` and create a new `application.yml` file. 
Then copy the contents from `application.yml.local` into it.

Go to `apps/omar-ui-app` and run `java -jar build/libs/omar-ui-app-2.0.1-SNAPSHOT.jar`.

Go to `http://localhost:8080/omar-ui` in your browser.