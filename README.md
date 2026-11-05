# johnrising.com

Static personal site served by GitHub Pages from the `main` branch. Push to `main` to deploy.

DNS and email forwarding live in Cloudflare, managed by Terraform in `infra/`:

```
source ~/.config/cloudflare/johnrising.env
cd infra && terraform apply
```

State is local (`infra/terraform.tfstate`, not committed).
