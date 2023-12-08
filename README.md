# HIVE - Human Information Vivification Exploration

## Introduction
Welcome to HIVE, an innovative project to enhance human information exploration and interaction. HIVE stands for Human Information Vivification Exploration, reflecting our goal to develop a modern chat interface with a scalable backend.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Docker
- Docker Compose
- Node.js and npm (for local development)

### Starting the Application
To start HIVE, use Docker Compose. This will build and start all the necessary services for the application.

```docker compose up --build```

### Stopping the Application
To stop HIVE and remove the containers, networks, and volumes created by `up`, run:

```docker compose down```

## Configuration
To configure HIVE, refer to the `docker-compose.yml` file. This file contains all the necessary settings and configurations for the Docker containers.

## Frontend and Backend Interaction
HIVE is designed with a flexible architecture, ensuring compatibility with various backend services. As long as the backend service is compliant with OpenAI completions, the frontend will operate seamlessly.

## Local Development
For local development, you can build and serve the project using npm. This is especially useful for front-end development and testing.

```npm build```
```npm serve```

## Contributions
We welcome contributions to the HIVE project. Please read our contribution guidelines before you submit your pull requests.

## License
HIVE is licensed under the MIT License. See the LICENSE file in this repository for full license text.
