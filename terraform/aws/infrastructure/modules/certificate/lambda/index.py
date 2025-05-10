import os
import boto3
import datetime
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
acm = boto3.client('acm')

def handler(event, context):
    """
    Lambda function to check certificate expiration and trigger renewal if needed.
    """
    try:
        # Get certificate ARN and grace period from environment variables
        certificate_arn = os.environ['CERTIFICATE_ARN']
        grace_period = int(os.environ['GRACE_PERIOD'])

        # Get certificate details
        response = acm.describe_certificate(
            CertificateArn=certificate_arn
        )
        
        certificate = response['Certificate']
        expiration_date = certificate['NotAfter']
        current_date = datetime.datetime.now(expiration_date.tzinfo)
        
        # Calculate days until expiration
        days_until_expiration = (expiration_date - current_date).days
        
        logger.info(
            f"Certificate {certificate_arn} expires in {days_until_expiration} days"
        )
        
        # Check if renewal is needed
        if days_until_expiration <= grace_period:
            logger.info(
                f"Certificate {certificate_arn} needs renewal"
            )
            
            # Request certificate renewal
            acm.renew_certificate(
                CertificateArn=certificate_arn
            )
            
            logger.info(
                f"Certificate {certificate_arn} renewal requested successfully"
            )
            return {
                'statusCode': 200,
                'body': (
                    f"Certificate renewal requested. "
                    f"Days until expiration: {days_until_expiration}"
                )
            }
        else:
            logger.info(
                f"Certificate {certificate_arn} does not need renewal yet"
            )
            return {
                'statusCode': 200,
                'body': (
                    f"Certificate renewal not needed. "
                    f"Days until expiration: {days_until_expiration}"
                )
            }
            
    except Exception as e:
        logger.error(f"Error processing certificate renewal: {str(e)}")
        raise 