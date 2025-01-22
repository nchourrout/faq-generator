# Website FAQ Generator

Web app that generates FAQ for any website using [Firecrawl](https://firecrawl.dev) `/extract` endpoint.

## Installation

```bash
npm install
cp .env.example .env
sudo nano .env # Add your Firecrawl API key
npm run dev
```

## Notes

- Ensure you have Node.js and npm installed on your machine.
- The `.env` file should never be committed to version control for security reasons.
- You can find more details in the accompanying [blog post](https://medium.com/@nchourrout/generate-faqs-from-any-website-with-firecrawl-extract-endpoint-4608d09e694d).