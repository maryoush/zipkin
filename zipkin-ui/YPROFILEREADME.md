# Pre-requisite
 You need node (node js) version 5.x

# Zipkin orks

## Source
   use ork fork   https://github.com/maryoush/zipkin
## Build

  ```
  ./mvnw -DskipTests --also-make -pl zipkin-server clean package
  ```
## Release
  * Upload newly created executbale jar (_zipkin-server/target/**-exec.jar) in BOSH
    ```
      bosh add blob <path> zipkin/<jarname>
    ```
  * Create and upload new release
  ```
    https://stash.hybris.com/projects/ORK/repos/bosh-deployment-hybris-zipkin
  ```
  * Deploy via BOSH using
  ```
    https://stash.hybris.com/projects/ORK/repos/bosh-deployment-hybris-zipkin/browse/aws/zipkin-us-east-prod.yml
  ```

