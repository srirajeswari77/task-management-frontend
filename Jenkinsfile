
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install, Lint and Build') {
            steps {
                sh '''
                    docker run --rm \
                      --user 1000:1000 \
                      -e HOME=/tmp \
                      -v jenkins_home:/jenkins_home \
                      -w "/jenkins_home/workspace/${JOB_NAME}" \
                      node:22-alpine \
                      sh -c "npm ci && npm run lint && npm run build"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t task-management-frontend:${BUILD_NUMBER} .
                    docker tag task-management-frontend:${BUILD_NUMBER} task-management-frontend:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend CI pipeline completed successfully!'
        }
        failure {
            echo 'Frontend CI pipeline failed. Check the console output.'
        }
    }
}
