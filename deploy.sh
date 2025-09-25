#!/bin/bash

# Serverless Todo API Deployment Script
# AWS Solutions Architect Project

set -e

echo "🚀 Starting deployment of Serverless Todo API..."

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Please install it first:"
    echo "npm install -g serverless"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Get deployment stage
STAGE=${1:-dev}
echo "📦 Deploying to stage: $STAGE"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy the serverless application
echo "☁️  Deploying to AWS..."
serverless deploy --stage $STAGE

# Get the API Gateway URL
API_URL=$(serverless info --stage $STAGE | grep "endpoint:" | awk '{print $2}')
echo "🌐 API Gateway URL: $API_URL"

# Get the S3 bucket name for frontend
BUCKET_NAME="serverless-todo-api-${STAGE}-frontend"
echo "🪣 Frontend S3 Bucket: $BUCKET_NAME"

# Upload frontend to S3
echo "📤 Uploading frontend to S3..."
aws s3 cp frontend/index.html s3://$BUCKET_NAME/index.html --content-type "text/html"

# Update the frontend with the correct API URL
echo "🔧 Updating frontend with API URL..."
sed "s|https://your-api-gateway-url.amazonaws.com/dev|$API_URL|g" frontend/index.html > frontend/index_updated.html
aws s3 cp frontend/index_updated.html s3://$BUCKET_NAME/index.html --content-type "text/html"
rm frontend/index_updated.html

# Get the frontend URL
FRONTEND_URL="http://$BUCKET_NAME.s3-website-${AWS_DEFAULT_REGION:-us-east-1}.amazonaws.com"
echo "🎨 Frontend URL: $FRONTEND_URL"

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Stage: $STAGE"
echo "   API URL: $API_URL"
echo "   Frontend URL: $FRONTEND_URL"
echo "   API Documentation: $API_URL/api-docs"
echo ""
echo "🧪 Test the API:"
echo "   curl $API_URL/api/v1/health"
echo ""
echo "🎯 Next Steps:"
echo "   1. Visit the frontend URL to test the application"
echo "   2. Check the API documentation at $API_URL/api-docs"
echo "   3. Monitor logs in AWS CloudWatch"
echo ""
