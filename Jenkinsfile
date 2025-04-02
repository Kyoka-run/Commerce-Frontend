pipeline {
    agent any
    
    environment {
        AWS_REGION = 'eu-west-1'
        S3_BUCKET = 'kyoka-ecommerce'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Build React App') {
            steps {
                bat """
                    set "CI=false"
                    npm run build
                """
            }
        }
        
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    bat "aws s3 sync dist/ s3://${S3_BUCKET} --delete"
                }
            }
        }
    }
    
    post {
        success {
            echo 'E-commerce frontend deployment to S3 successful!'
        }
        failure {
            echo 'E-commerce frontend deployment to S3 failed!'
        }
    }
}