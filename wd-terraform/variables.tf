variable "project_name" {
  type = map
  default = {
    dev = "wd-dev"
    prod = "wd-dev"
  }
}
variable "billing_account" {
  default = "0167F4-126FFA-78226F"
}
variable "org_id" {
  default = "140991335971"
}
variable "region" {
  default = "us-central1"
}
