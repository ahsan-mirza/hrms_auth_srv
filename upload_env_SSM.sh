#!/bin/bash

# Verify .env exists
if [ ! -f ".env" ]; then
  echo "Error: .env file not found in current directory"
  exit 1
fi

# Get AWS SSO profile name
read -p "Enter your AWS SSO profile name [default]: " aws_profile
aws_profile=${aws_profile:-default}

# Get base path
read -p "Enter SSM base path (e.g., /quickdropx/prod/backend): " base_path
[[ "$base_path" != /* ]] && base_path="/$base_path"
base_path="${base_path%/}"

# Process .env file
while IFS='=' read -r key value; do
  if [[ -n $key && $key != \#* ]]; then
    # Remove surrounding quotes
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"

    parameter_name="$base_path/$key"
    
    echo "Creating parameter: $parameter_name"
    aws ssm put-parameter \
      --name "$parameter_name" \
      --type "String" \
      --value "$value" \
      --profile "$aws_profile" \
      --overwrite
  fi
done < .env

echo "All parameters uploaded successfully using profile '$aws_profile'!"
