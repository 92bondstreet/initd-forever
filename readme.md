INITD-FOREVER
=========

initd-forever is a node.js module to create a daemon for your nodejs application.

The package generates a shell script for `/etc/init.d` using <a href="https://npmjs.org/package/forever">forever</a> package.

It generates also a shell script for monitoring daemon with the debain package  `monit`


Keynote
-------

Installation
------------

You can install `initd-forever` and its dependencies with npm: 

`npm install initd-forever`.


Usage
-----
	

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

[Yassine Azzout]: http://www.92bondstreet.com


License
-------
[MIT license](http://www.opensource.org/licenses/Mit)
