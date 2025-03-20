# Toastr

Une librairie TypeScript pour afficher des notifications toastr

## Utilisation

```typescript
import { Toastr } from 'toastr';

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