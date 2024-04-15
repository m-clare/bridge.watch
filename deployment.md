# Deploying Bridge.Watch

## Container Microservices
There are three container microservices deployed on a digital ocean droplet. To build and push the latest changes to the droplet, run:

```sh
cd bridge.watch
source ./build_services.sh
```

## Frontend
The frontend is simply built as a static site and all built files as pushed up to the droplet:

```sh
cd bridge.watch/react 
npm run build 
scp -r ./public/* root@${digital_ocean_droplet}:/var/www/bridge.watch/html
```

## NGINX Conf
Once the microservices have been rebuilt and pushed, they need to be pulled down and restarted.

```sh
ssh root@${digital_ocean_droplet}
cd nbi
docker pull registry.digitalocean.com/${registry}/db-prod:latest
docker pull registry.digitalocean.com/${registry}/express-prod:latest
docker pull registry.digitalocean.com/${registry}/web-prod:latest
docker-compose down -v
docker-compose up -d
```

Once they have been restarted, the nginx conf needs to be adjusted to use the correct internal IP address.
```sh
docker network inspect ${network_name}
[0].Containers["express"].IPv4Address

nano /etc/nginx/sites-available/bridge.watch
```

Edit this block:
```
upstream backend {
    server ${express_server}
}
```

Check config and restart
```sh
sudo nginx -t
sudo systemctl restart nginx
```

### How to clear the NGINX Cache 
```sh
/data/nginx/cache/
rm -rf .
```
## Tile generation
```sh
tippecanoe --maximum-zoom 16 --minimum-zoom 10 -o bridges2023.pmtiles -r1 --drop-densest-as-needed bridges_2023.geojson --force
```
