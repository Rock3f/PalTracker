# PalTrack

Dashboard de suivi de progression pour un groupe privé de joueurs Palworld 1.0 : niveau, Pals capturés, points de voyage rapide, tours vaincues, alphas et raids abattus.

- **Frontend** : React + Vite, hébergé sur GitHub Pages
- **Backend** : Supabase (auth email/password + base de données), aucun serveur applicatif

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Le déploiement sur GitHub Pages se fait automatiquement via GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) à chaque push sur `main`.

## Sécurité

La clé Supabase anon présente dans le code est publique par conception. La protection des données repose sur les policies Row Level Security définies dans [supabase/rls_policies.sql](supabase/rls_policies.sql) — à exécuter dans l'éditeur SQL Supabase avant toute mise en production.
