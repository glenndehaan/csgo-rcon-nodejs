# Counter-Strike Global Offensive Web Panel

A web panel to control a CS:GO server

[![Build Status](https://travis-ci.org/glenndehaan/csgo-rcon-nodejs.svg?branch=master)](https://travis-ci.org/glenndehaan/csgo-rcon-nodejs) [![release](https://img.shields.io/github/release/glenndehaan/csgo-rcon-nodejs.svg)](https://github.com/glenndehaan/csgo-rcon-nodejs/releases) [![dependencies](https://david-dm.org/glenndehaan/csgo-rcon-nodejs.svg)](https://github.com/glenndehaan/csgo-rcon-nodejs/blob/master/package.json) [![license](https://img.shields.io/github/license/glenndehaan/csgo-rcon-nodejs.svg)](https://github.com/glenndehaan/csgo-rcon-nodejs/blob/master/LICENCE)

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

## Language Support
- English
- French
- German
- Dutch

## config.json Explanation
```
{
  "application": {
    "companyName": "A Company", <<- This name will be prefixed in the servername
    "baseUrl": "http://CURRENTIP:3542" <<- Change 'CURRENTIP' to the IP of the CSGO-Remote server. Your CS:GO servers must be able to connect to the CSGO-Remote app
  },
  "servers": [ <<- Put all your CS:GO server in this block
    { <<- A server block
      "ip": "192.168.1.xx", <<- CS:GO server IP/Hostname
      "port": 27015, <<- CS:GO server Port
      "password": "anrconpassword", <<- CS:GO server password
      "default_map": "de_dust2", <<- CS:GO server default loading map
      "server_restore_config": "server" <<- Leave this default
    }
  ],
  "broadcaster": { <<- The broadcaster sends messages to the CS:GO server chat
    "enabled": true, <<- Enables the broadcaster
    "speed": 120, <<- After how long do we need to send the next message in seconds
    "messages": [ <<- This block contains all the messages
      "This is message 1", <<- This is one message
      "This is message 2",
      "This is message 3"
    ]
  },
  "authentication": { <<- This block is for the /settings pages
    "username": "root", <<- Username for the /settings pages
    "password": "password123!" <<- Password for the /settings pages
  }
}
```

## v2 TODO's
* GitHub Request: https://github.com/glenndehaan/csgo-rcon-nodejs/issues/2
* ~~Wingman: `Connect server` needs to change map to wingman map~~
* ~~Dangerzone: `Connect server` needs to change map to dangerzone map~~
* ~~Dangerzone: `Knife round` needs to be disabled~~
* ~~Dangerzone: `Start match` needs to stop warmup~~
* ~~Dangerzone/Wingman: Restore game_type/game_mode to competitive~~
* ~~Healthcheck needs to be faster~~
* ~~Translations add socket error messages~~
* ~~Add frontend translations~~
* Add Bo1, Bo2, Bo3, Bo4, Bo5 support
* ~~Add wingman and dangerzone support (maps, configs)~~
* Add support for uploading scores back to challonge
* Replace basic auth with frontend login
* Add livescoring to Home/Servers view
* ~~Add Readme `config.json` explanation~~
* Implement LoadBalancing (Redis)?
* Implement MongoDB?
* ~~Implement lang files tests~~
* ~~Implement basic tests~~
* ~~Implement NodeJS server logs web interface~~
* ~~Implement NodeJS server controls~~ (Not possible)
* ~~Better GitHub release integration~~
* ~~Rcon Healthcheck (Auto reinit Rcon connection)~~
* ~~Rcon Command error/timeout (https://github.com/randunel/node-srcds-rcon#specify-command-timeout)~~

## v1 TODO's
* ~~Lock matches on same server when one match is running.~~
* ~~Fix production PKG build.~~
* ~~Add say to admin interface.~~
* ~~Add broadcaster to config file.~~
* ~~Fix restore server config file.~~ (Restore config is now optional)
* ~~Catch srcds error's. (Send cmd if rcon fails)~~
* ~~Create one cmd for rcon. (Use in startMatch, reset) Let others use that.~~
* ~~Rcon reconnect?~~ (Not possible with current package!)
* ~~Rcon server/match status? (V2)~~
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
