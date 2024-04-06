#! /bin/sh

cd ~/workspaces/current/bridge.watch/

# build / tag db container
docker build --platform linux/amd64 -t db-prod -f ./db/Dockerfile.prod.db ./db
docker tag db-prod registr.digitalocean.com/${DO_REGISTRY}/db-prod
docker push registry.digitalocean.com/${DO_REGISTRY}/db-prod

# build / tag web service container
docker build --platform linux/amd64 -t web-prod -f ./app/Dockerfile.prod ./app
docker tag web-prod registr.digitalocean.com/${DO_REGISTRY}/web-prod
docker push registry.digitalocean.com/${DO_REGISTRY}/web-prod

# build / tag express aggregation service container
docker build --platform linux/amd64 -t express-prod -f ./express-redis/Dockerfile.prod ./express-redis
docker tag express-prod registr.digitalocean.com/${DO_REGISTRY}/express-prod
docker push registry.digitalocean.com/${DO_REGISTRY}/express-prod
