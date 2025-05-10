#!/bin/bash

# Create a temporary directory for packaging
mkdir -p package

# Install dependencies
pip install -r requirements.txt -t package/

# Copy the Lambda function code
cp index.py package/

# Create the deployment package
cd package
zip -r ../certificate_renewal.zip .
cd ..

# Clean up
rm -rf package 