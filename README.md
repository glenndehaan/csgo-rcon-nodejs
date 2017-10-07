# Counter-Strike Global Offensive RCON NodeJS

A prototype to control a CSGO server with a NodeJS backend

## Structure
- ES6
- NodeJS
- Simple Node Logger
- srcds-rcon
- Json DB
- Socket.IO

## Basic Usage
- Install NodeJS 8.0 or higher
- Copy the `config.example.js` file to `config.js` and change the vars to your settings
- Run `npm install` in the node folder
- Run `npm run dev` in the node folder
- Copy the web folder to a webserver like Apache2 or nginx

Then open up a webbrowser and go to the site to create a match and start the server.

## Logging
All logs will be written to the `csgo-rcon.log` file in the node folder.

To increase the logging change the logLevel in the `config.js` file from `info` to `debug`.

## Database
To make this as simple as it is I use a local Json database.

Checkout `csgo-rcon.json` since this is the db file.

## License

MIT
