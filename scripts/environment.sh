#!/bin/bash -e

set -ev
export RDS_DB=$(aws rds describe-db-instances --query "DBInstances[*].Endpoint.Address" | grep redesmart-rdsdb-dev | cut -d '"' -f2)
export DB_PASSWD=$DB_PASS
export RDS_USER=$DB_USER

cat>.env<<EOF
# Database Connection
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=$RDS_DB
TYPEORM_USERNAME=$RDS_USER
TYPEORM_PASSWORD=$DB_PASSWD
TYPEORM_DATABASE=smart_db
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true
TYPEORM_ENTITIES=dist/**/*.entity.js
AWS_S3_FOLDER=$STAGE
EOF