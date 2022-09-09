# E2E Demo Guide

## Basic Application Setup
1. Create a spring project. Add:
    * Data JPA
    * Rest Repositoru
    * Lombok
    * Actuator
    * Prometheus
    * DevTools
    * TestContainer
    ![Create a Spring Project][img/01]

    Shortcut: [Create Spring Project][01-create-spring-project]

2. Download, extract and open in IDE. Add boilerplate `pom.xml` configs

    ![Project Structure][img/02]

3. Start database with `yb-ctl` or `yb-docker-ctl`

    ```bash
    yb-ctl destroy && \
    yb-ctl --rf 3 create  \
      --tserver_flags="cql_nodelist_refresh_interval_secs=2,ysql_log_statement=all" \
      --master_flags="tserver_unresponsive_timeout_ms=2000" \
      --placement_info "aws.us-east-2.us-east-2c,aws.eu-central-1.eu-central-1c,aws.ap-southeast-1.ap-southeast-1c"
    ```

4. Create frontend app, set proxy in `package.json`, create base pages

5. Create `GreetingsService`, `ReactUIWebConfig`, etc. Setup `application.yaml`

6. Run frontend and backend. Check connectivity

    Backend
    ```bash
    ./mvnw spring-boot:run
    ```
   Frontend
   ```bash
    # On second terminal
    cd src/main/frontend && npm start
    ```

    ![First Run][img/03]
7. Build docker container

    ```bash
    ./mvnw spring-boot:build-image -DskipTests
    ```

8. Run app on local docker

    ```bash
    cd deployment/local
    docker-compose up
    ```


## Create REST Service and Front End

1. Create table for Orders and add sample data

2. Create JPA Entity and Repository

    Test entity with `curl`

    ```bash
    curl "http://localhost:8080/api/v1/orders"
    ```

    Create new order with

    ```bash
     curl "http://localhost:8080/api/v1/orders" -X POST -H content-type:application/json -d '{
        "orderDate" : "2019-03-17",
        "name" : "Yogi Rampuria",
        "shipTo" : "Singapore, Asia",
        "paymentMethod" : "AMEX",
        "paymentId" : "6789",
        "amount" : 123.45
      }'
    ```

    Retrieve order

    ```bash
   curl http://localhost:8080/api/v1/orders/101
    ```

    Update order

    ```bash
    curl -X PATCH -H content-type:application/json -d '{ "amount": 12.34 }' http://localhost:8080/api/v1/orders/101
    ```

    Delete oder

    ```bash
    curl -X DELETE http://localhost:8080/api/v1/orders/101
    ```

3. Update frontend to fetch order from rest API and add a form to update data

4. Create docker image again and push

    ```bash
    ./mvnw spring-boot:build-image
    docker push ghcr.io/yogendra/yb-e2e-demo:latest
    ```

## reate



[img/01]: 01-create-spring-project.png
[img/02]: 02-open-in-ide.png
[img/03]: 03-first-run.png
[01-create-spring-project]: https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.7.3&packaging=jar&jvmVersion=17&groupId=com.yugabyte.dssdemos&artifactId=e2e-demo&name=e2e-demo&description=Demo%20project%20for%20Spring%20Boot&packageName=com.yugabyte.dssdemos.e2e-demo&dependencies=devtools,prometheus,actuator,data-jpa,postgresql,testcontainers,lombok,data-rest
