# WarrantyOne Landing Page — React Components

## Where to copy these files

Copy the whole `src/` contents into your existing React project's `src/` folder,
matching this structure:

```
your-project/
└── src/
    ├── index.css                      → replace/merge with your global CSS
    ├── LandingPage.jsx                → the page itself (import & render this)
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── WarrantyCardPreview.jsx
        ├── StatsBar.jsx
        ├── TrustedBy.jsx
        ├── HowItWorks.jsx
        ├── RolesSection.jsx
        ├── FeaturesGrid.jsx
        ├── PaymentsSection.jsx
        ├── CTABanner.jsx
        ├── Footer.jsx
        └── ui/                        → shared, reusable across other pages too
            ├── Button.jsx
            ├── Badge.jsx
            ├── Divider.jsx
            ├── SectionHeader.jsx
            ├── Card.jsx
            └── IconTile.jsx
```

## Requirements

This uses **Tailwind CSS** utility classes. If your project doesn't have it yet:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Make sure your `tailwind.config.js` content globs include `./src/**/*.{js,jsx}`,
and that `src/index.css` (or wherever your global stylesheet lives) is imported
once in your app's entry file (e.g. `main.jsx`).

## Using the page

```jsx
// src/main.jsx or src/App.jsx
import LandingPage from "./LandingPage";
import "./index.css";

export default function App() {
  return <LandingPage />;
}
```

## Reusing components elsewhere

The `components/ui/` folder (`Button`, `Badge`, `Divider`, `SectionHeader`, `Card`,
`IconTile`) is intentionally generic — import any of them into other pages
(e.g. a pricing page or dashboard) the same way:

```jsx
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";

<Card>
  <Button variant="accent">Do a thing</Button>
</Card>
```

## Notes

- Global hover/transition polish (color, shadow, and transform easing) lives in
  `index.css` and applies site-wide — no per-element setup needed.
- `Divider` is placed between major sections in `LandingPage.jsx`; adjust the
  `tone` prop (`"light"` / `"strong"`) if you add darker banded sections.
- Swap the emoji icons in `PaymentsSection.jsx` for an icon library
  (e.g. `lucide-react`) if you'd like something more polished.
