# School Portal CI/CD Architecture & Deployment Manual

> 📚 **Documentation Navigation:** [README](README.md) • [Architecture & Deployment](ARCHITECTURE.md)

This document provides a comprehensive technical overview of the School Portal deployment pipeline, container architecture, automated release steps, emergency rollback procedures, and health monitoring stack.

---

  1. Architecture Overview

  High-Level Deployment Workflow

  mermaid
  flowchart TD
      dev[Developer Push] -->|git push main| gh[GitHub Repository]
      gh -->|Trigger Workflow| gha[GitHub Actions CI/CD]

      subgraph CI_CD [GitHub Actions Automation]
          stage1[1. Test & Validate] --> stage2[2. Build Docker Image]
          stage2 --> stage3[3. Push to Docker Hub]
          stage3 --> stage4[4. SSH Server Deploy]
      end

      stage3 -->|Push Container Tag| dh[(Docker Hub Registry)]
      stage4 -->|Pull & Start| container[Nginx Web Container]
      dh -->|Stream Image| container

      subgraph Server [Production Web Server]
          container -->|Container Metrics| cadvisor[cAdvisor Exporter]
          cadvisor -->|Metrics Scraping| prom[Prometheus Collector]
          prom -->|Dashboard Queries| graf[Grafana Dashboards]
      end

      rb[Manual Rollback Trigger] -.->|Revert to Previous Tag| stage4

  ---

  2. Infrastructure & System Components

  A. Source Control & Automation (Git & GitHub Actions)

  - Repository Manager: Stores project code, static assets (HTML/CSS/JS), infrastructure configs, and deployment
    scripts.
  - CI/CD Automation Engine: Listens for code pushes on the main branch to trigger builds, test suites, and remote SSH
    deployment routines.
  - Secrets Manager: Encrypts sensitive credentials (SSH keys, server IPs, Docker Hub access tokens) required during
    deployment.

  B. Containerization & Delivery (Docker & Docker Hub)

  - Application Packaging: Bundles static web assets inside an optimized Nginx Alpine image, ensuring identical behavior
    across development and production environments.
  - Image Registry (Docker Hub Free Tier): Hosts built container images tagged with both latest and the unique Git
    Commit SHA (${{ github.sha }}) for precise versioning and rollbacks.

  C. Host Server & Runtime Environment (Production Server)

  - Application Runtime: Runs the School Portal container via Docker Compose on port 80.
  - Health Checks: Periodically tests HTTP readiness (wget --spider) to confirm web server availability and automatic
    container restart upon failure.

  D. Monitoring & Observability Stack

  - cAdvisor (Container Advisor): Gathers CPU, memory, network, and disk usage stats directly from running Docker
    containers on port 8080.
  - Prometheus: Time-series database that regularly scrapes metrics from cAdvisor on port 9090.
  - Grafana: Web interface on port 3000 that visualizes real-time container health, resource utilization, and uptime
    using Prometheus as its data source.

  ---

  3. End-to-End CI/CD Pipeline Stages

  Stage 1: Code Verification & Quality Gate

  - Trigger: Developer pushes code to the main branch.
  - Process: GitHub Actions spins up an Ubuntu runner, checks out the codebase, and runs HTML/CSS linter suites.
  - Outcome: If syntax or validation errors are detected, the pipeline terminates immediately, preventing bad code from
    proceeding.

  Stage 2: Docker Build & Tagging

  - Trigger: Successful completion of Stage 1.
  - Process: Builds the lightweight Nginx Docker image containing your HTML/CSS files.
  - Tagging Strategy:
    - latest tag for active production referencing.
    - Unique Git Commit SHA tag (e.g., school-portal:a1b2c3d) to preserve an immutable build history for rollbacks.

  Stage 3: Registry Push

  - Trigger: Successful image build in Stage 2.
  - Process: Authenticates securely with Docker Hub using repository secrets and uploads the newly tagged images.

  Stage 4: Remote SSH Deployment

  - Trigger: Successful registry push in Stage 3.
  - Process:
    a. Opens an encrypted SSH session to the production server using the repository's SSH_PRIVATE_KEY.
    b. Exports environment variables containing the target Docker Hub account and Commit SHA tag.
    c. Pulls the matching container image from Docker Hub onto the production server.
    d. Restarts the School Portal container using Docker Compose without service downtime.
    e. Saves the deployed Commit SHA tag locally into a tracking file (LAST_SUCCESSFUL_SHA) on the server.

  ---

  4. Rollback Strategy & Disaster Recovery

  If a bug or layout issue passes testing and reaches production, a instant rollback mechanism is available.

  How the Rollback Works

  1. Version History: Every build generates a unique Docker image tag matching its Git commit hash. Old images remain
     available on Docker Hub and stored locally on the host server.
  2. Automated Tracking: Each successful deployment logs its Commit SHA into a file on the server.
  3. Rollback Execution: When a rollback is requested, GitHub Actions connects to the server and instructs Docker
     Compose to re-deploy the previous healthy SHA tag.

  Execution Steps for Administrators

  1. Navigate to your repository on GitHub.
  2. Click the Actions tab and select the Rollback School Portal workflow.
  3. Click Run workflow.
  4. (Optional) Input a specific past Commit SHA tag to revert to, or leave the field blank to automatically restore the
     last known healthy state saved on the server.

  ---

  5. Environment Requirements & Configuration Setup

  To ensure seamless execution, the following environment secrets and files must be established:

  Required GitHub Secrets

  - DOCKER_USERNAME: Docker Hub account login.
  - DOCKER_PASSWORD: Docker Hub Personal Access Token.
  - SERVER_HOST: Public IP address or domain name of your production server.
  - SERVER_USER: User with SSH and Docker privileges (e.g., ubuntu or root).
  - SSH_PRIVATE_KEY: Private SSH key authorized for server login.

  Server Directory Layout

  - /path/to/school-portal/docker-compose.yml: Defines the application service and port mappings.
  - /path/to/school-portal/docker-compose-monitoring.yml: Defines the Prometheus, Grafana, and cAdvisor containers.
  - /path/to/school-portal/prometheus.yml: Configures target endpoints and scrape intervals for container monitoring.
  - /path/to/school-portal/LAST_SUCCESSFUL_SHA: Generated automatically during deployment to store the current
    production version tag.