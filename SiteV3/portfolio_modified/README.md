# Portfolio Game Developer

## Lancer le site

Aucune dépendance n'est nécessaire.

Ouvre simplement :

- `index.html` → portfolio public
- `admin.html` → administration

## Administration

Mot de passe de démonstration :

`admin123`

Les modifications sont actuellement enregistrées dans le `localStorage` du navigateur.

### Important

Cette authentification est uniquement une démonstration côté client.
Elle ne protège pas réellement le site contre quelqu'un qui connaît le code source.

Pour une vraie mise en ligne, il faudra ajouter :

- un backend
- une vraie authentification
- une base de données
- un stockage d'images
- une API permettant de modifier le contenu

## Structure

```text
portfolio/
├── index.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── main.js
│   └── admin.js
└── assets/
    └── images/
```


## Thème et langue

Le site dispose maintenant de :

- 🌙 / ☀️ un switch sombre / clair
- FR / EN un switch français / anglais
- Les deux préférences sont conservées dans le navigateur avec `localStorage`.

Les contenus personnalisés de l'administration restent indépendants du changement de langue.
