# Hari Ram AWPL Store

A mobile-first product storefront with a midnight Liquid Glass interface and WhatsApp order requests.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 3
- Motion for React
- Zustand for cart and local profile state

## Local development

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The GitHub Actions quality workflow runs dependency auditing, linting, type checking, unit tests and a production build.

## Store settings

The WhatsApp destination is public configuration. Set `NEXT_PUBLIC_WHATSAPP_PHONE` to the store number with country code and digits only. The current fallback is the number already configured in the storefront.

Customer profile details and the cart are stored in this browser using local storage. They are not synchronized to a server or between devices. WhatsApp opens an order request for the customer to review; it does not create a confirmed order or process payment.

## Product catalogue

The current committed catalogue is a starter set. Replace or expand it only with the product names, pack sizes, categories, pricing and image assets supplied and confirmed by the store owner. The catalogue validator checks duplicate ids, required fields, category references and numeric prices.

Do not invent ratings, customer reviews, stock counts, certifications or health benefits. Health-related product copy must be checked against verified product labelling and applicable Indian requirements before publication.
