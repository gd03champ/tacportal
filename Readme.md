# TacPortal: A 3-Tier MERN Stack Application

TacPortal is a 3-tier MERN (MongoDB, Express.js, React.js, Node.js) stack application. It is organized into three main components: the client, the server, and the database. Each component runs in its own Docker container, allowing for easy deployment and scaling.

## Architecture

- **Client**: The client is a React.js application, bootstrapped with Create React App. It communicates with the server via a RESTful API. The client's Dockerfile is located at [`client/Dockerfile`](/client/Dockerfile).
    
- **Server**: The server is a Node.js application using Express.js. It provides a RESTful API for the client and communicates with the MongoDB database. The server's Dockerfile is located at [`server/Dockerfile`](/server/Dockerfile).
    
- **Database**: The database is a MongoDB instance. It stores all the application data and is accessed by the server.

## Project Structure

TacPortal follows a well-structured and organized directory layout that separates the client, server, and database files. Here's a brief overview of the project structure:

```
├───client
│   ├───public
│   └───src
│       ├───handlers
│       └───pages
├───db
└───server
    ├───auth
    ├───handlers
    ├───middlewares
    └───models
```

- **Root Directory**: The root directory contains Docker-related files (`docker-compose.yml`, `Dockerfile`), `.gitignore`, `.dockerignore`, and the main `Readme.md` file. It also includes the `client`, `db`, and `server` directories.
    
- **Client Directory**: This directory contains all the files related to the client-side ( react ) of the application.
    
- **DB Directory**: This directory contains JSON files (`tacportal.blacktokens.json`, `tacportal.tacs.json`, `tacportal.users.json`) that represent the sample data for the MongoDB database.
    
- **Server Directory**: This directory contains all the server-side files. It includes `server.js` which is the entry point for the server, Docker-related files, and directories for `auth`, `handlers`, `middlewares`, and `models`.

## Running the Project

To run the project, you need to have Docker and Docker Compose installed on your machine. Once you have these installed, you can start the project by running the following command in the root directory of the project:

```
docker-compose up -d
```

This command will start all three components in their own Docker containers. The client will be accessible at `http://localhost:4000`, and the server will be accessible at `http://localhost:3001`.

## Building Docker Images

To build the Docker images for the client and the server, you can use the following commands:

```
docker build -t tacportal_client -f client/Dockerfile .

docker build -t tacportal_server -f server/Dockerfile .
```

These commands will build the Docker images using the Dockerfiles located in the client and server directories, respectively.

You can also pull the images available in docker registry as `gd03/tacportal:client` and `gd03/tacportal:api` 

## Prometheus Metrics Exporting

Prometheus metrics exporting is configured for all three tiers of the application using Node Exporter. Node Exporter is a Prometheus exporter for hardware and OS metrics with pluggable metric collectors. It allows you to measure various machine resources such as memory, disk I/O, CPU, network, etc.

In each Dockerfile for the client and the server, Node Exporter is installed and started alongside the application. This allows Prometheus to scrape metrics from each tier of the application.

In the [`docker-compose.yml`](docker-compose.yml) file, each service exposes a different port for Prometheus metrics:

- The client exposes port `9102`
- The server exposes port `9101`
- The MongoDB database exposes port `9103` via the MongoDB Exporter

These ports can be configured to be scraped by a Prometheus instance.

For more information on how to use these metrics with Prometheus, please refer to the [Prometheus documentation](vscode-file://vscode-app/c:/Users/gdthe/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html "https://prometheus.io/docs/introduction/overview/").

## Example prometheus config 

The below file showcases example prometheus configs using which metrics from all above 3 containers are scrapped

```yaml
global:
  scrape_interval: 15s # By default, scrape targets every 15 seconds.
  
scrape_configs:
# Exporters for tacportal services
  
  - job_name: 'client'
    static_configs:
      - targets: ['host.docker.internal:9102'] # Targets for scraping metrics from the frontend container on port 9100
  
  - job_name: 'backend'

   static_configs:
      - targets: ['host.docker.internal:3001', 'host.docker.internal:9101'] # Targets for scraping metrics from the backend container on ports 8000 and 9100
  - job_name: 'mongodb'
    static_configs:
      - targets: ['host.docker.internal:9103'] # Target for scraping metrics from the MongoDB service/container on port 9100
```

# Features and Workflow of TacPortal

TacPortal is a comprehensive application with a variety of features designed to streamline the user experience and facilitate administrative tasks.

## Features

- **JWT User Authentication**: TacPortal uses JSON Web Tokens (JWT) for user authentication.

- **User and Admin Dashboard**: The application provides separate dashboards for users and administrators. The user dashboard provides access to personal account information and application features, while the admin dashboard offers a comprehensive view of all user accounts and application data.

- **Tac Form Application**: Users can fill out and submit Tac forms through the application. The form data is stored in the MongoDB database and can be accessed by administrators for review.
    
- **Admin Approval/Rejection with Remarks**: Administrators can review submitted Tac forms and either approve or reject them. They can also provide remarks on each form, offering feedback or requesting additional information from the user.
    
- **Appointment Booking**: Users have the ability to book appointments through the application one the tac is approved
    
- **Review Forms and Pipeline**: The application provides a pipeline for reviewing and processing Tac forms. This includes stages for initial submission, review, approval/rejection, and final processing.
    
- **Ant Design UI**: The user interface of the application is built using Ant Design, a popular React UI library. This provides a modern and intuitive user experience.
    
- **Well-Structured Development and Code**: The application follows best practices for MERN stack development. The codebase is well-structured and modular, making it easy to understand and maintain.
    

## Workflow

The general workflow of the application is as follows:

1. Users register and log in to the application using JWT authentication.
2. Users can access their personal dashboard, where they can fill out and submit Tac forms, book appointments, and view their account information.
3. Submitted Tac forms and booking information are stored in the MongoDB database.
4. Administrators can access the admin dashboard, where they can manage user accounts and review submitted Tac forms and booking information.
5. Administrators can approve or reject Tac forms, providing remarks as necessary.
6. Users can view the status of their submitted Tac forms and booking information on their dashboard.
7. User can book appointments on approved Tacs
8. On booking date is confirmed, review is scheduled and Tac is reviewed with a review form.
9. Reward points are provided to user based on the review

This workflow provides a seamless experience for both users and administrators, making TacPortal an efficient and effective tool for managing Tac form submissions and appointment bookings.

## Conclusion

TacPortal is a scalable and easy-to-deploy MERN stack application.
Author: [@gd03champ](gd03.me)