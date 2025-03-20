# Toastizy

[![Tests](https://github.com/theodugautier/toastizy/actions/workflows/tests.yml/badge.svg)](https://github.com/theodugautier/toastizy/actions/workflows/tests.yml)
[![Lint](https://github.com/theodugautier/toastizy/actions/workflows/lint.yml/badge.svg)](https://github.com/theodugautier/toastizy/actions/workflows/lint.yml)
[![npm version](https://img.shields.io/npm/v/toastizy.svg)](https://www.npmjs.com/package/toastizy)
[![License](https://img.shields.io/npm/l/toastizy.svg)](https://github.com/theodugautier/toastizy/blob/main/LICENSE)

![Toastizy Cover](cover.png)

Une librairie TypeScript pour afficher des notifications toastr

## Utilisation

```typescript
import { Toastr } from 'toastizy';

const toastr = Toastr.getInstance();

toastr.show('Message de succès', 'success');

toastr.show('Message d\'erreur', 'error', {
  duration: 5000,
  position: 'top-right',
  closeButton: true,
  progressBar: true
});
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