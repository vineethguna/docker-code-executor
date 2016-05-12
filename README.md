Docker Code Executor
====================

A code execution engine based on docker on which you can safely run **untrusted code** without the fear of your server
going down.

It is powered by [kubernetes](http://kubernetes.io/), a container cluster manager by Google.

Currently it supports the below languages
* C
* Python
* Ruby

Installation
============
This includes two micro services
* UI
* Execution Server

First you need to setup the execution server, Please follow the below steps
* Go to `executor` folder
* Run `npm install` - This is a one time step
* Start the server using `npm start`

Then you need to start the UI service, Please follow the below steps
* Go to `ui` folder
* Run `npm install` - This is a one time step
* Set the following environment variables
    * `EXECUTOR_SERVICE_HOST` to the IP address of execution server, if it is on the
    same machine it will be `localhost`
    * `EXECUTOR_SERVICE_PORT` to the port number of execution server, by default it is `3000`
* Start the server using `npm start`

**Note:** The above setup does not involve launching docker containers to execute untrusted code. So use at your own risk.
To use containerized version of the above please refer the section Docker Images

Docker Images
=============
The docker images for both the microservices are available in my docker hub account and is public

Execution Server - https://hub.docker.com/r/vineethguna/executor/

UI - https://hub.docker.com/r/vineethguna/executor-ui/

License
=======
Apache Copyright (c) [Vineeth Guna](vineethguna.wordpress.com)