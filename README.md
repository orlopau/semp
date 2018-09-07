# SEMP2REST
Adapts the SMA SEMP protocol to REST for easier usage.

## REST Api
Documentation for the specific functionality of parameters can be found on [SMAs Website](https://www.sma.de/produkte/sma-developer.html)
under SEMP.
---
* [Get devices](./docs/api/devices/get.md): `GET /api/devices`
* [Create device](./docs/api/devices/post.md): `POST /api/devices`
---
* [Get device](./docs/api/devices/id/get.md): `GET /api/devices/:id`
* [Update device](./docs/api/devices/id/put.md): `PUT /api/devices/:id`
* [Delete device](./docs/api/devices/id/delete.md): `DELETE /api/devices/:id`
---
* [Set hook url](./docs/api/devices/id/hook/post.md): `POST /api/devices/:id/hook`
* [Delete hook url](./docs/api/devices/id/hook/delete.md): `DELETE /api/devices/:id/hook`
---
* [Get planning requests](./docs/api/devices/id/planningRequests/get.md): `GET /api/devices/:id/planningRequests`
* [Add planning request](./docs/api/devices/id/planningRequests/post.md): `POST /api/devices/:id/planningRequests`
* [Delete all planning requests](./docs/api/devices/id/planningRequests/delete.md): `DELETE /api/devices/:id/planningRequests`
---
* [Update last power](./docs/api/devices/id/lastPower/put.md): `PUT /api/devices/:id/lastPower`
---
* [Get recommendation (hook preferred)](./docs/api/devices/id/recommendation/get.md): `GET /api/devices/:id/recommendation`

## Usage
The library can be used in two ways.

**1. Docker (preferred)**

1. [Install docker](https://docs.docker.com/install/).

2. Clone.

    ```
    git clone https://github.com/orlopau/semp.git
    cd semp
    ```

3. Run the container

    `--net=host` is needed because of SSDP device discovery, which uses UDP.
    This means that port flags will be ignored. To use different ports, specify a build flag AND a 
    environment variable on runtime as shown below.
    
    The standard ports are `9765` for SEMP and `9766` for the API.
    
    `-t` specifies the tag.
        
    ```
    docker build -t semp --build-arg semp=9765 --build-arg api=9766 .
    ```
    
    When running the container, the IP Address of the host must be specified.
    
    If the ports have been changed from the standard configuration, additional env variables
    have to be added.
    
    Use the `-it` flag for testing (interactive mode).
    
    Every argument except IP is optional.
    
    ```
    docker run -it --net=host \
        -e IP="192.168.188.101" \
        -e SEMP_PORT=9765 \
        -e API_PORT=9766 \
        -e UUID="290B3891-0311-4854-4333-7B10BC802C2D" \
        -e NAME="Semp Gateway" \
        -e MANUFACTURER="Semp2Rest" \
        semp
    ```
    
    For deployment remove the `-it` flag and add `--restart=always` to restart on boot and error.
    
**2. Module**

Download the module from npm.

```npm install semp2rest --save```

Then use the module as follows:

```javascript
const Gateway = require('semp2rest');
const gateway = new Gateway("290B3891-0311-4854-4333-7C70BC802C2D", "192.168.188.101", 9089, 9090);
gateway.start();
```

Typescript works out-of-the-box.
