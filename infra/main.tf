terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
  }
}

# Reads CLOUDFLARE_API_TOKEN from the environment.
provider "cloudflare" {}

variable "account_id" {
  type = string
}

resource "cloudflare_zone" "site" {
  account = { id = var.account_id }
  name    = "johnrising.com"
}

# GitHub Pages apex IPs. Not proxied so GitHub can issue the HTTPS certificate.
resource "cloudflare_dns_record" "apex" {
  for_each = toset(["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"])
  zone_id  = cloudflare_zone.site.id
  name     = "johnrising.com"
  type     = "A"
  content  = each.value
  ttl      = 1
  proxied  = false
}

resource "cloudflare_dns_record" "www" {
  zone_id = cloudflare_zone.site.id
  name    = "www.johnrising.com"
  type    = "CNAME"
  content = "johnrising.github.io"
  ttl     = 1
  proxied = false
}

# Email Routing: forwards hello@johnrising.com. Cloudflare adds the MX and SPF records.
resource "cloudflare_email_routing_dns" "mail" {
  zone_id = cloudflare_zone.site.id
  name    = "johnrising.com"
}

# Cloudflare emails this address a verification link on first apply.
resource "cloudflare_email_routing_address" "inbox" {
  account_id = var.account_id
  email      = "johnrising@alum.mit.edu"
}

resource "cloudflare_email_routing_rule" "hello" {
  zone_id  = cloudflare_zone.site.id
  name     = "hello"
  matchers = [{ type = "literal", field = "to", value = "hello@johnrising.com" }]
  actions  = [{ type = "forward", value = [cloudflare_email_routing_address.inbox.email] }]
}

output "name_servers" {
  value = cloudflare_zone.site.name_servers
}
