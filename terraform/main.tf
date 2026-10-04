terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "status_page" {
  name = "cloud-status-page:latest"
}

resource "docker_container" "status_page" {
  name  = "status-page-tf"
  image = docker_image.status_page.image_id
  ports {
    internal = 80
    external = 8081
  }
}
