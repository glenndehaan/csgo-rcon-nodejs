# Counter-Strike Global Offensive Web Panel

A web panel to control a CS:GO server

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
- Download the latest version from the releases page on GitHub
- Save the binary in it's own folder
- Run the binary (this will create some additional files/folders)
- Adjust the `config.json`
- Restart the binary

Then open up a webbrowser and go to the site

## Development Usage
- Install NodeJS 8.0 or higher
- Copy the `_scripts/config/config.dev.json` to here `app/config/config.json`
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

## Plugin
To enable livescoring and auto match configuration please install the SourceMod Plugin:

https://github.com/glenndehaan/csgo-rcon-plugin

## TODO's
* ~~Lock matches on same server when one match is running.~~
* ~~Fix production PKG build.~~
* ~~Add say to admin interface.~~
* ~~Add broadcaster to config file.~~
* ~~Fix restore server config file.~~ (Restore config is now optional)
* ~~Catch srcds error's. (Send cmd if rcon fails)~~
* ~~Create one cmd for rcon. (Use in startMatch, reset) Let others use that.~~
* ~~Rcon reconnect?~~ (Not possible with current package!)
* Rcon server/match status? (V2)
* ~~Challonge (API/Webhook) match import?~~
* ~~Rewrite (server modules) to ES6 classes?~~
* ~~Bootstrap Notification bar. (Showing that we are sending something)~~
* ~~Add match groups~~
* ~~Edit match~~
* ~~Add native system notifications~~
* ~~Add SVG's to replace bulky buttons~~
* ~~Protect /settings page with basic auth (Username/Password in config file)~~
* ~~Challonge import server option: Next available server~~
* ~~Challonge import complete notification update~~
* ~~Settings icon active state stuck~~
* ~~Restart game implement are you sure dialog~~
* ~~Rewrite queue module~~
* ~~Filter matches on homepage (Not started, Running, Completed)~~
* ~~/settings add archive complete matches function~~
* ~~Disable match/server controls if match isn't started~~
* ~~Server overview page to so available server where no matches are running~~
* ~~Add breadcrumbs~~
* ~~Add /settings force archive match~~
* ~~/about page with software info~~
* ~~Version update available based on GIT (GitHub)~~
* ~~Show development/production version~~
* Autosetup server (V3)
* Match control password protect at match create
* ~~Plugin: Lock match data after match_end~~
* ~~Plugin: Split connect server/start match~~
* ~~Plugin: Add start warmup button~~
* ~~Plugin: Autoflow Connect Server->Warmup->Start Knife->Knife (End)->Warmup->Start match->Match end->Auto restore server~~
* ~~CSV Import matches~~

## License

MIT
