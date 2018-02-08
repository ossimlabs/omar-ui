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

### An Example DeploymentConfig
```yaml
apiVersion: v1
kind: DeploymentConfig
metadata:
  annotations:
    openshift.io/generated-by: OpenShiftNewApp
  creationTimestamp: null
  generation: 1
  labels:
    app: omar-openshift
  name: omar-ui-app
spec:
  replicas: 1
  selector:
    app: omar-openshift
    deploymentconfig: omar-ui-app
  strategy:
    activeDeadlineSeconds: 21600
    resources: {}
    rollingParams:
      intervalSeconds: 1
      maxSurge: 25%
      maxUnavailable: 25%
      timeoutSeconds: 600
      updatePeriodSeconds: 1
    type: Rolling
  template:
    metadata:
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
      creationTimestamp: null
      labels:
        app: omar-openshift
        deploymentconfig: omar-ui-app
    spec:
      containers:
      - env:
        - name: SPRING_PROFILES_ACTIVE
          value: dev
        - name: SPRING_CLOUD_CONFIG_LABEL
          value: master
        image: 172.30.181.173:5000/o2/omar-ui-app@sha256:06daac5e657ae6509812eee51ce396eb49e92a623b6007b9e0e1a814d2ad02be
        imagePullPolicy: Always
        livenessProbe:
          failureThreshold: 3
          initialDelaySeconds: 60
          periodSeconds: 10
          successThreshold: 1
          tcpSocket:
            port: 8080
          timeoutSeconds: 1
        name: omar-ui-app
        ports:
        - containerPort: 8080
          protocol: TCP
        readinessProbe:
          failureThreshold: 3
          initialDelaySeconds: 30
          periodSeconds: 10
          successThreshold: 1
          tcpSocket:
            port: 8080
          timeoutSeconds: 1
        resources: {}
        terminationMessagePath: /dev/termination-log
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      securityContext: {}
      terminationGracePeriodSeconds: 30
  test: false
  triggers:
  - type: ConfigChange
  - imageChangeParams:
      automatic: true
      containerNames:
      - omar-ui-app
      from:
        kind: ImageStreamTag
        name: omar-ui-app:latest
        namespace: o2
    type: ImageChange
status:
  availableReplicas: 0
  latestVersion: 0
  observedGeneration: 0
  replicas: 0
  unavailableReplicas: 0
  updatedReplicas: 0
```
