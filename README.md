# Toastizy

[![Tests](https://github.com/theodugautier/toastizy/actions/workflows/tests.yml/badge.svg)](https://github.com/theodugautier/toastizy/actions/workflows/tests.yml)
[![Lint](https://github.com/theodugautier/toastizy/actions/workflows/lint.yml/badge.svg)](https://github.com/theodugautier/toastizy/actions/workflows/lint.yml)
[![npm version](https://img.shields.io/npm/v/toastizy.svg)](https://www.npmjs.com/package/toastizy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Toastizy Cover](cover.png)

Une librairie TypeScript pour afficher des notifications toastr

## Installation

### Via NPM

```bash
npm install toastizy

yarn add toastizy
```

### Via CDN

Ajoutez les fichiers CSS et JavaScript dans votre HTML :

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/toastizy@1.1.0/dist/css/toastizy.min.css">

<!-- JavaScript -->
<script src="https://unpkg.com/toastizy@1.1.0/dist/toastizy.min.js"></script>
```

## Utilisation

### Avec les modules ES

```typescript
import { Toastr } from 'toastizy';
import 'toastizy/dist/toastizy.min.css';

const toastr = Toastr.getInstance();

// Notification simple
toastr.show({ title: 'Success', type: 'success'});

// Notification avec options
toastr.show({
  title: "Error",
  type: 'error',
  description: 'Une erreur est survenue'
}, {
  duration: 5000,
  position: 'top-right',
  closeButton: true,
  progressBar: true
});
```

### Avec le CDN

```html
<script>
  const toastr = Toastizy.Toastr.getInstance();

  toastr.show({ title: 'Success', type: 'success'});
</script>
```

## Types de notifications

- `success`
- `error`
- `info`
- `warning`

## Options

| Option | Type | Description | Par défaut |
|--------|------|-------------|------------|
| duration | number | Durée d'affichage en ms | 3000 |
| position | string | Position de la notification | 'top-right' |
| closeButton | boolean | Afficher le bouton de fermeture | true |
| progressBar | boolean | Afficher la barre de progression | true |
| className | string | Classe CSS personnalisée | undefined |

## Développement

```bash
# Installer les dépendances
npm install

# Lancer les tests
npm test

# Compiler le projet
npm run build
```
