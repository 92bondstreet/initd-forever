INITD-FOREVER [![Build Status](https://travis-ci.org/92bondstreet/initd-forever.png)](https://travis-ci.org/92bondstreet/initd-forever)
=========

initd-forever is a node.js module to create a daemon for your nodejs application.

The package generates a shell script for `/etc/init.d` using <a href="https://npmjs.org/package/forever">forever</a> package.

It generates also a shell script for monitoring daemon with the debain package  `monit`


Keynote
-------

Installation
------------

You can install `initd-forever` and its dependencies with npm:

`npm install initd-forever -g` for a global installation (for example)


Usage
-----

To generate daemon and monit files from the command line, use following options:

		$ initd-forever --help
		usage: initd-forever [options]

		Generate the script file as a daemon and the monit script file.

		options:
			-a, --app			APP			Path to node.js main js file
			-c, --command	COMMAND	Command to execute on the nodejs file used for custom command line options
			-e, --env			ENV			Export NODE_ENV with ENV value
			-l, --logfile		LOGFILE     Logs the daemon output to LOGFILE
			-n, --name			NAME		Application name
			-p, --pidfile		PIDFILE		The pid file
			-m, --monit			MONITPORT	Generate the monit script file with the port number MONITPORT where your application runs
			-f, --forever   FOREVER	Path to forever script
		Error:
		Cannot generate daemon file: no options defined and package.json is not found.

For missing options, initd-forever will use values saved in the package.json.


Options
-------

### app

Default is the **main** defined in package.json

### env

Default is **production**

### name

Default is the **name** defined in package.json

### logfile

Default is based on **name** value: **/var/run/name.log**

### pidfile

Default is based on **name** value: **/var/run/name.pid**

### monit

Default doesn't generate the monit script file.

### forever

Default uses whatever script the enviroment variable points to

### command

Default passes the nodejs executable '/usr/bin/env node'

Running tests
-------------

To run the tests under node you will need `mocha` and `should` installed (it's listed as a
`devDependencies` so `npm install` from the checkout should be enough), then do

    $ npm test

Project status
--------------
initd-forever is currently maintained by Yassine Azzout.


Authors and contributors
------------------------
### Current
* [Yassine Azzout][] (Creator, Coder, Keeper)

[Yassine Azzout]: http://yass.io


License
-------
[MIT license](http://www.opensource.org/licenses/Mit)
