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

## Create Infrastructure

1. Create GCP VPC

2. Create GKE Asia (South) and Configure Ingress

    ```bash
    gcloud beta container clusters create ap-dss2022 \
      --project "yrampuria-yb" \
      --region "asia-south1" \
      --no-enable-basic-auth \
      --cluster-version "1.22.12-gke.1200" \
      --release-channel "regular" \
      --machine-type "n1-standard-8"  \
      --image-type "COS_CONTAINERD" \
      --disk-type "pd-standard" \
      --disk-size "50" \
      --enable-ip-alias \
      --network "projects/yrampuria-yb/global/networks/default" \
      --subnetwork "projects/yrampuria-yb/regions/asia-south1/subnetworks/default" \
      --num-nodes "2" \
      --node-locations "asia-south1-a" \
      --labels "zone=asia-south1-a" \
      --enable-shielded-nodes \
      --workload-pool yrampuria-yb.svc.id.goog

    ```

    ```bash
    gcloud compute addresses create asia-dss2022-ingress --global
    ```

    ```bash
    gcloud container hub memberships register ap-dss2022 --gke-cluster asia-south1/ap-dss2022 --enable-workload-identity --project yrampuria-yb
    ```

3. Create GKE Europe (West) and Configure Ingress

    ```bash
    gcloud beta container clusters create eu-dss2022 \
      --project "yrampuria-yb" \
      --region "europe-west1" \
      --no-enable-basic-auth \
      --cluster-version "1.22.12-gke.1200" \
      --release-channel "regular" \
      --machine-type "n1-standard-8"  \
      --image-type "COS_CONTAINERD" \
      --disk-type "pd-standard" \
      --disk-size "50" \
      --enable-ip-alias \
      --network "projects/yrampuria-yb/global/networks/default" \
      --subnetwork "projects/yrampuria-yb/regions/europe-west1/subnetworks/default" \
      --num-nodes "2" \
      --node-locations "europe-west1-b" \
      --labels "zone=europe-west1-b" \
      --enable-shielded-nodes \
      --workload-pool yrampuria-yb.svc.id.goog
    ```

    ```bash
    gcloud compute addresses create europe-dss2022-ingress --global
    ```

    ```bash
    gcloud container hub memberships register eu-dss2022 --gke-cluster europe-west1/eu-dss2022 --enable-workload-identity --project yrampuria-yb
    ```

4. Create GKE US (Central) and Configure Ingress

    ```bash
    gcloud beta container clusters create us-dss2022 \
      --project "yrampuria-yb" \
      --region "us-central1" \
      --no-enable-basic-auth \
      --cluster-version "1.22.12-gke.1200" \
      --release-channel "regular" \
      --machine-type "n1-standard-8"  \
      --image-type "COS_CONTAINERD" \
      --disk-type "pd-standard" \
      --disk-size "50" \
      --enable-ip-alias \
      --network "projects/yrampuria-yb/global/networks/default" \
      --subnetwork "projects/yrampuria-yb/regions/us-central1/subnetworks/default" \
      --num-nodes "2" \
      --node-locations "us-central1-c" \
      --labels "zone=us-central1-c" \
      --enable-shielded-nodes \
      --workload-pool yrampuria-yb.svc.id.goog
    ```

    ```bash
    gcloud compute addresses create us-dss2022-ingress --global
    ```

    ```bash
    gcloud container hub memberships register us-dss2022 --gke-cluster us-central1/us-dss2022 --enable-workload-identity --project yrampuria-yb
    ```

5. Deploy Yugabyte on GKE Asia (South)

    Generate template and update broadcast addresses

    ```bash
    helm template yugabytedb/yugabyte --namespace ap-south1 -f deployment/ap/k8s/ap-south1.yaml --dry-run > deployment/cloud/ap/k8s/ap-dss2022.yaml
    ```

    Deploy database

    ```bash
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 create ns ap-south1
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 -n ap-south1 apply -f deployment/cloud/ap/k8s/ap-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 -n ap-south1 apply -f deployment/cloud/ap/k8s/service-export.yaml
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 -n ap-south1 get all,pv,pvc
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 -n ap-south1 get svc yb-master-ui -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 -n ap-south1 logs -l chart=yugabyte --all-containers --prefix -f
    ```

6. Deploy Yugabyte on GKE Europe (West)

   Generate template and update broadcast addresses

    ```bash
    helm template yugabytedb/yugabyte --namespace eu-west1 -f deployment/cloud/eu/k8s/eu-west1.yaml --dry-run > deployment/cloud/eu/k8s/eu-dss2022.yaml
    ```

   Deploy database

    ```bash
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 create ns eu-west1
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 -n eu-west1 apply -f deployment/cloud/eu/k8s/eu-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 -n eu-west1 apply -f deployment/cloud/eu/k8s/service-export.yaml
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 -n eu-west1 get all,pv,pvc
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 -n eu-west1 get svc yb-master-ui -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 -n eu-west1 logs -l chart=yugabyte --all-containers --prefix -f
    ```

7. Deploy Yugabyte on GKE US (Central)

    Generate template and update broadcast addresses

   ```bash
    helm template yugabytedb/yugabyte --namespace us-central1 -f deployment/cloud/us/k8s/us-central1.yaml --dry-run > deployment/cloud/us/k8s/us-dss2022.yaml
    ```

    Deploy database

    ```bash
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022  create ns us-central1
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 -n us-central1 apply -f deployment/cloud/us/k8s/us-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 -n us-central1 apply -f deployment/cloud/us/k8s/service-export.yaml
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 -n us-central1 get all,pv,pvc
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 -n us-central1 get svc yb-master-ui -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 -n us-central1 logs -l chart=yugabyte --all-containers --prefix -f
    ```
8. Create cluster with placement info

    ```bash
     kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022  exec -it -n us-central1 yb-master-0 -- bash \
       -c "/home/yugabyte/master/bin/yb-admin \
       --master_addresses yb-master-0.us-dss2022.yb-masters.us-central1.svc.clusterset.local:7100,yb-master-0.eu-dss2022.yb-masters.eu-west1.svc.clusterset.local:7100,yb-master-0.ap-dss2022.yb-masters.ap-south1.svc.clusterset.local:7100 \
         modify_placement_info gke.us-central1.us-east1-c,gke.europe-west1.europe-west1-b,gke.asia-south1.asia-south1-a 3"
    ```

9. Uninstall

    ```bash

    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 delete -n ap-south1 -f  deployment/cloud/ap/k8s/ap-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_asia-south1_ap-dss2022 delete -n ap-south1 pvc -l chart=yugabyte

    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 delete -n eu-west1 -f  deployment/cloud/eu/k8s/eu-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_europe-west1_eu-dss2022 delete -n eu-west1 pvc -l chart=yugabyte

    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 delete -n us-central1 -f  deployment/cloud/us/k8s/us-dss2022.yaml
    kubectl --context=gke_yrampuria-yb_us-central1_us-dss2022 delete -n us-central1 pvc -l chart=yugabyte
    ```






[img/01]: 01-create-spring-project.png
[img/02]: 02-open-in-ide.png
[img/03]: 03-first-run.png
[01-create-spring-project]: https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.7.3&packaging=jar&jvmVersion=17&groupId=com.yugabyte.dssdemos&artifactId=e2e-demo&name=e2e-demo&description=Demo%20project%20for%20Spring%20Boot&packageName=com.yugabyte.dssdemos.e2e-demo&dependencies=devtools,prometheus,actuator,data-jpa,postgresql,testcontainers,lombok,data-rest
