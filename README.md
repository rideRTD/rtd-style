# rtd-style

Shared repo for RTD assets on [website-drupal8](https://github.com/rideRTD/website-drupal8) and [ember-client](https://github.com/rideRTD/ember-client). Uses Webpack 4 for translation and optimization of CSS.

## Development

- Run `npm start` to spin up a local, live-reloading development server at http://localhost:8080/.
- Always lint (`npm run lint:css`) and build (`npm run build`) styles before committing.
- Tag your commit with an incremental version change (e.g. v0.5.6).
- Update the dependency in each project's package.json (e.g. git+https://github.com/rideRTD/rtd-style.git#v0.5.6)
