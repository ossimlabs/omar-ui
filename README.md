# omar-ui

## Description

The OMAR UI services provides the user an entry point to conveniently interact with OMAR and its supported services.

## How to run a local OMAR UI
Install PostgreSQL `docker pull postgres`.

Build the OMAR UI `gradle assemble`.

Go to `docker` and run `docker-compose -f dev-compose.yml up`.

Go to `apps/omar-ui-app` and create a new `application.yml` file. 
Then copy the contents from `application.yml.local` into it.

Go to `apps/omar-ui-app` and run `java -jar build/libs/omar-ui-app-2.0.1-SNAPSHOT.jar`.

Go to `http://localhost:8080/omar-ui` in your browser.