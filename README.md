# Counter-Strike Global Offensive RCON NodeJS

A prototype to control a CSGO server with a NodeJS backend

## Backend Structure
- NodeJS
- Simple Node Logger
- srcds-rcon
- Json DB
- Express
- Express-WS

## Frontend Structure
- Webpack
- Preact
- Preact Router
- Bootstrap
- Sass
- Sockette

## Basic Usage
TODO: Update the basic usage!

## Development Usage
- Install NodeJS 8.0 or higher
- Copy the `_scripts/config/config.example.json` to here `app/config/config.json`
- Run `npm install` in the root project folder
- Run `npm run webpack` in the root project folder
- Run `npm run dev` in the root project folder

Then open up a webbrowser and go to the site

## Logging
All logs will be written to the `csgo-rcon.log` file in the node folder.

To increase the logging change the logger level in the `config.json` file from `info` to `debug`.

## Database
To make this as simple as it is I use a local Json database.

Checkout `csgo-rcon.json` since this is the db file.

## TODO's
* Lock matches on same server when one match is running.
* Readonly mode after first user opens the match admin panel.
* Fix production PKG build.
* ~~Add say to admin interface.~~ (Needs testing!)
* ~~Add broadcaster to config file.~~ (Needs testing!)
* ~~Fix restore server config file.~~ (Restore config is now optional)
* Catch srcds error's. (Send cmd if rcon fails)
* ~~Create one cmd for rcon. (Use in startMatch, reset) Let others use that.~~ (Needs testing!)
* Rcon reconnect?
* Rcon server/match status?
* Challonge (API/Webhook) match import?
* Rewrite (server modules) to ES6 classes?

## License

MIT
