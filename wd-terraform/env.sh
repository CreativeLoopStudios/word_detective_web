#!/bin/sh

export TF_ADMIN=wd-terraform-admin
export TF_CREDS=~/.config/gcloud/wd-terraform-admin.json
export GOOGLE_APPLICATION_CREDENTIALS=${TF_CREDS}
export GOOGLE_PROJECT=${TF_ADMIN}
export PROJECT_ID=`terraform output project_id`