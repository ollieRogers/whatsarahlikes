#What Sarah Likes

A simple MVC app so Sarah can remember what she likes.

Built with node & mongo, it allows you to store things you like and categorise them. The app runs on node.js so the below assumes you have it installed already.

------

##Local Build

###1.) Clone the repo & build the app

First clone this repo and go to the directory you cloned to.

`cd ~/directory/you/cloned/to`

Install the projects dependencies with npm.

`npm install`

-------

###2.) Install Mongo

The app uses mongo db. To run this locally on you Mac run the below commands:

`brew update`

`brew install mongodb`

then:

`mongod`

-------

###3.) Install ImageMagick

Uses [imagemagick](http://www.imagemagick.org/) to resize & crop images on upload.

To install imagemagick on Ubuntu - `apt-get install imagemagick`

To install imagemagick on Ubuntu on Mac OSX - `brew install imagemagick`

-------

###4.) Set up config/secrets.js

You will need to configure secrets.js in order to connect to mongo and for the site to send any emails. For Gmail you will need to generate an application specific passkey. Go to http://bit.ly/1ey8yID and select the Manage application-specific passwords link at the bottom.

```
module.exports = {
  db: 'mongodb://localhost/dbname',   // where to connect to mongo
  localAuth: true,
  sessionSecret: process.env.SESSION_SECRET || 'your session secret',
  gmail: {
    user: 'gmailusername@gmail.com',  // gmail account for smtp
    password: 'gmailpasskey'          // you will need a gmail passkey http://bit.ly/1ey8yID
  }
};
```

-------

###5.) Run the app locally

first go to the directory you cloned to `cd ~/directory/you/cloned/to`

production: `NODE_ENV=producton node app`

development: `NODE_ENV=development nodemon app.js`

**you can also run the app using npm run-script.**

`npm run-script dev` starts the app up in dev mode.

`npm run-script prod` starts the ap up in production mode. 

-------
##Run on Digital Ocean

To run this on a production server (I chose Digital Ocean) using [forever](https://www.npmjs.org/package/forever), first install forever; `npm install forever -g` then `cd` to the directory the app is in and run:

`NODE_ENV=production forever start app.js`

Or using npm:

`npm run-script live`
