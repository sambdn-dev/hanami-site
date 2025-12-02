# 🌿 Hanami - Site Web Next.js

## 📦 Installation avec Claude Code

```bash
# 1. Cloner ou télécharger ce dossier

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev

# 4. Ouvrir http://localhost:3000
```

## 🏗️ Structure du projet

```
hanami-nextjs/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── pro/page.tsx        # Page paysagistes
│   │   ├── boutique/page.tsx   # Page boutique
│   │   ├── blog/page.tsx       # Page blog
│   │   └── ...
│   ├── components/             # Composants React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── FiveMomentsCarousel.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ...
│   ├── contexts/               # Contextes React
│   │   └── CartContext.tsx
│   ├── data/                   # Données statiques
│   │   ├── products.ts
│   │   └── blogArticles.ts
│   └── styles/
│       └── globals.css
├── public/                     # Assets statiques
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🎨 Design System

### Couleurs principales

| Nom | Hex | Usage |
|-----|-----|-------|
| `green-primary` | `#2D5016` | CTA, titres, logo |
| `green-accent` | `#00C896` | Badges, hover |
| `orange-accent` | `#FF8C42` | Étoiles, gradients |
| `pro-green` | `#00D9A3` | Mode Pro |
| `dark-bg` | `#0F1419` | Fond mode Pro |
| `dark-surface` | `#1A1F29` | Cartes mode Pro |
| `beige-bg` | `#F5F3EF` | Fond principal |
| `beige-border` | `#E8E5DF` | Bordures |

### Typographies

- **Logo**: `Fredoka` (font-weight: 700)
- **Titres**: `Poppins` (font-weight: 600-800)
- **Corps**: `Inter` (font-weight: 400-600)

## 🚀 Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

## 📝 Notes importantes

1. **Images** : Les images Unsplash sont conservées pour le moment. À remplacer par tes propres images dans `/public/images/`.

2. **Paiement** : Intégrer Stripe pour le panier fonctionnel.

3. **Base de données** : Les données produits/articles sont en dur. À migrer vers Supabase/Sanity si besoin.
