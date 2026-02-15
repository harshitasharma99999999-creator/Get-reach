# Fix Vercel "Invalid Configuration" for getreach.live

Your domain DNS is pointing to the wrong IP. Do this at your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger, etc.):

---

## Step 1: Log into your domain registrar

Go to wherever you bought `getreach.live` (e.g. GoDaddy, Namecheap, Cloudflare) and open the DNS management for that domain.

---

## Step 2: Remove the old records

Delete these A records:

| Type | Name | Value (remove if this exists) |
|------|------|-------------------------------|
| A | @ (or blank) | 199.35.15.100 |
| A | www | 199.35.15.100 |

---

## Step 3: Add the new records

Add these A records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ (or blank for root) | **216.19.87.91** | 3600 or Auto |
| A | www | **216.19.87.91** | 3600 or Auto |

---

## Step 4: Save and wait

1. Save the DNS changes.
2. Wait 5–15 minutes (sometimes up to an hour).
3. Vercel will re-check and the domains should turn green.

---

## Registrar-specific tips

- **GoDaddy:** My Products → Domains → DNS → Manage DNS → edit or delete records
- **Namecheap:** Domain List → Manage → Advanced DNS → edit/delete records
- **Cloudflare:** DNS → Edit or delete records (ensure proxy is OFF or orange cloud for A records to Vercel)
- **Hostinger:** Domains → Manage → DNS / Name Servers → edit records

---

After DNS propagates, https://getreach.live and https://www.getreach.live should load your app.
