terraform {
 backend "gcs" {
   bucket  = "wd-terraform-admin"
   prefix  = "terraform/state"
 }
}
