resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project
}

resource "google_firebase_web_app" "basic" {
  provider = google-beta
  project = var.project
  display_name = "Word Detective"

  depends_on = [google_firebase_project.default]
}

data "google_firebase_web_app_config" "basic" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.basic.app_id
}