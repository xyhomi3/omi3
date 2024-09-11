# `@omi3/tailwind`

Ce module fournit une fonction pour créer une configuration Tailwind CSS personnalisée basée sur des styles prédéfinis.

## Installation

```bash
npm install @omi3/tailwind
```

## Utilisation

```ts
import createTailwindConfig from '@omi3/tailwind';

const config = createTailwindConfig('shadcn', [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
]);
```

## API

### `createTailwindConfig`

```ts
createTailwindConfig(styleType: 'neobrutalism' | 'shadcn', content: string[]): Config
```

Crée une configuration Tailwind CSS.

- `styleType`: Le style à utiliser ('neobrutalism' ou 'shadcn')
- `content`: Un tableau de chemins de fichiers à analyser pour le contenu Tailwind

## Styles disponibles

- `neobrutalism`: Un style inspiré du brutalisme avec des couleurs vives et des ombres marquées
- `shadcn`: Un style basé sur le thème shadcn/ui avec des variables CSS pour les couleurs

## Personnalisation

Pour ajouter ou modifier des styles, éditez l'objet `styles` dans le fichier source.

## Licence

MIT
