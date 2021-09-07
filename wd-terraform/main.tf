provider "google" {
  region = var.region
}

provider "google-beta" {
  region = var.region
}

resource "random_id" "id" {
  byte_length = 4
  prefix      = var.project_name[terraform.workspace]
}

resource "google_project" "project" {
  name            = var.project_name[terraform.workspace]
  project_id      = random_id.id.hex
  billing_account = var.billing_account
  org_id          = var.org_id
}

module "firebase" {
  source = "./modules/firebase"
  project = google_project.project.project_id
}

terraform {
  required_version = "~> 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "= 3.81.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "= 3.82.0"
    }
  }
}