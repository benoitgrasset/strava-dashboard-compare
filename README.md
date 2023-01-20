# strava-dashboard-compare

Dashboard pour comparer le volume d'entrainement des personnes suivies sur Strava, en course à pied, vélo et natation.

Les données sont scrappées sur Strava avec `Puppeteer`.

Mis à jour tous les jours à minuit via un [Github actions](https://github.com/benoitgrasset/strava-dashboard-compare/actions/workflows/update-dashboard.yml) et un `cron job`.

(cron-guru)[https://crontab.guru/#*_*_*_*_*]

Le dahboard est déployé avec `Netlify` sur l'url suivante: https://strava-dashboard-compare.netlify.app/
