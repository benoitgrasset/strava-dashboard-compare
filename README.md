# strava-dashboard-compare

Dashboard pour comparer le volume d'entrainement des personnes suivies sur Strava, en course à pied, vélo et natation.

Les données sont scrappées sur Strava avec `Puppeteer`.

Mis à jour tous les jours à minuit via un [Github actions](https://github.com/benoitgrasset/strava-dashboard-compare/actions/workflows/update-dashboard.yml) et un `cron job`.

Le fichier yml décrivant le workflow: [update-dashboard.yml](/.github/workflows/update-dashboard.yml)

Le dahboard est déployé avec `Netlify` sur l'url suivante: https://strava-dashboard-compare.netlify.app/

## cron

```
"0 0 */1 * *"
```

Pour tester crontab: [cron-guru](https://crontab.guru/#*_*_*_*_*)

## output file

[stats.json](./stats.json)

```json
  {
    "name": "Alexandre Thieriot",
    "id": 23340031,
    "activity": { "running": 14, "swimming": 0, "cycling": 1 },
    "distance": { "running": 178.7, "swimming": 0, "cycling": 47.9 },
    "time": { "running": 13.9, "swimming": 0, "cycling": 3.3 },
    "drop": { "running": 3187, "swimming": 0, "cycling": 463 }
  },
  {
    "name": "Alice Michel",
    "id": 34882977,
    "activity": { "running": 28, "cycling": 14, "hiking": 0 },
    "distance": { "running": 276.4, "cycling": 168, "hiking": 0 },
    "time": { "running": 21.8, "cycling": 8.8, "hiking": 0 },
    "drop": { "running": 1194, "cycling": 928, "hiking": 0 }
  }
```

## Other repos example

https://www.curtiscode.dev/post/project/displaying-strava-stats-using-webhooks/
