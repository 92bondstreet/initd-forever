(
	function(){

		var program = require('commander');
		var swig = require('swig');
		var fs = require('fs');
		var path = require('path');

		function isFunction(functionToCheck) {
		 var getType = {};
		 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		}

		var daemonTemplate = [
			'#!/bin/bash'
		,	'### BEGIN INIT INFO'
		,	'# If you wish the Daemon to be lauched at boot / stopped at shutdown :'
		,	'#'
		,	'#    On Debian-based distributions:'
		,	'#      INSTALL : update-rc.d scriptname defaults'
		,	'#      (UNINSTALL : update-rc.d -f  scriptname remove)'
		,	'#'
		,	'#    On RedHat-based distributions (CentOS, OpenSUSE...):'
		,	'#      INSTALL : chkconfig --level 35 scriptname on'
		,	'#      (UNINSTALL : chkconfig --level 35 scriptname off)'
		,	'#'
		,	'# chkconfig:         2345 90 60'
		,	'# Provides:          {{app}}'
		,	'# Required-Start:    $remote_fs $syslog'
		,	'# Required-Stop:     $remote_fs $syslog'
		,	'# Default-Start:     2 3 4 5'
		,	'# Default-Stop:      0 1 6'
		,	'# Short-Description: forever running {{app}}'
		,	'# Description:       {{app}}'
		,	'### END INIT INFO'
		,	'#'
		,	'# initd a node app'
		,	'# Based on a script posted by https://gist.github.com/jinze at https://gist.github.com/3748766'
		,	'#'
		,	''
		,	'if [ -e /lib/lsb/init-functions ]; then'
		,	'	# LSB source function library.'
		,	'	. /lib/lsb/init-functions'
		,	'fi;'
		,	''
		,	'pidFile="{{pidfile}}"'
		,	'logFile="{{logfile}}"'
		,	''
		,	'command="{{command}}"'
		,	'nodeApp="{{app}}"'
		,	'foreverApp="{{forever}}"'
		,	''
		,	'start() {'
		,	'	echo "Starting $nodeApp"'
		,	''
		,	'	# Notice that we change the PATH because on reboot'
		,	'   # the PATH does not include the path to node.'
		,	'   # Launching forever with a full path'
		,	'   # does not work unless we set the PATH.'
		,	'   PATH=/usr/local/bin:$PATH'
		,	'	export NODE_ENV={{env}}'
		,	'   #PORT=80'
		,	'   $foreverApp start --pidFile $pidFile -l $logFile -a -d -c "$command" $nodeApp'
		,	'   RETVAL=$?'
		,	'}'
		,	''
		,	'restart() {'
		,	'	echo -n "Restarting $nodeApp"'
		,	'	$foreverApp restart $nodeApp'
		,	'	RETVAL=$?'
		,	'}'
		,	''
		,	'stop() {'
		,	'	echo -n "Shutting down $nodeApp"'
		,	'   $foreverApp stop $nodeApp'
		,	'   RETVAL=$?'
		,	'}'
		,	''
		,	'status() {'
		,	'   echo -n "Status $nodeApp"'
		,	'   $foreverApp list'
		,	'   RETVAL=$?'
		,	'}'
		,	''
		,	'case "$1" in'
		,	'   start)'
		,	'        start'
		,	'        ;;'
		,	'    stop)'
		,	'        stop'
		,	'        ;;'
		,	'   status)'
		,	'        status'
		,	'       ;;'
		,	'   restart)'
		,	'   	restart'
		,	'        ;;'
		,	'	*)'
		,	'       echo "Usage:  {start|stop|status|restart}"'
		,	'       exit 1'
		,	'        ;;'
		,	'esac'
		,	'exit $RETVAL'
		].join('\n');


		var monitTemplate = [
			'check process nodejs with pidfile "{{pidfile}}"'
		,	'	start program = "/etc/init.d/{{name}} start"'
		,	'   stop program = "/etc/init.d/{{name}} stop"'
		,	'    if failed port {{monit}} protocol HTTP'
		,	'    	request /'
		,	'        with timeout 10 seconds'
		,	'        then restart'
		].join('\n');


		/**
		 * 	Daemon definition
		 */
		var Daemon = function(){
			this.init();
		};

		Daemon.prototype = {

			/**
			* Load package.json file
			*
			* @method init
			*/

			init: function(){
				// Find and load package.json from which the node command is invoked.
				this.packageInfo = { 	info:false,
										name:"",
										appjs:"" };
				try{
					var package = require(process.cwd() + '/package.json');
					if(package.main && package.name){
						this.packageInfo.info = true;
						this.packageInfo.name = package.name;
						this.packageInfo.appjs = package.main;
						if(package.scripts && package.scripts.start){
							this.packageInfo.command = package.scripts.start;
						}
					}
				}
				catch(err) {}

				// Create default options value
				this.options = {	app: path.join(process.cwd() + '/' + this.packageInfo.appjs),
									env:'production',
									name:this.packageInfo.name,
									command:this.packageInfo['command'],
									logfile:'/var/run/' + this.packageInfo.name + '.log',
									pidfile:'/var/run/' + this.packageInfo.name + '.pid',
									monit:'3000',
									forever:'forever'
				};

				// Create options parsing
				program
					.version('0.1.1')
					.option('-a, --app [path]', 'Path to node.js main file')
					.option('-c, --command [value]', 'Command to execute on main file')
					.option('-e, --env [value]', 'Export NODE_ENV with value')
					.option('-l, --logfile [path]', 'Logs the daemon output to LOGFILE')
					.option('-n, --name [value]', 'Application name')
					.option('-p, --pidfile [path]', 'The pid file')
					.option('-m, --monit [value]', 'Generate the monit script file with the listen port number')
					.option('-f, --forever [value]', 'The location of forever')
			},
			/**
			* Generate script file daemon and monit
			*
			* @method script
			* @param {Array} 		process_argv	process.arv
			* @param {Function} 	callback		function
			*/
			script: function(process_argv,callback){

				// 1. Exception handler
    			if(arguments.length!==2 )
    				throw new Error('No valid args for script(process_argv,callback)');
    			else{
    				// init parameters
    				var callback = this.checkCallback(callback) ? callback : null;

    				//1.1 Check paramaters one by one
    				if(!this.checkCallback(callback))
    					throw new Error('No valid args for callback parameters | script(process_argv,callback)');
    			}

    			// 2. Success on args
    			this.process_argv = process_argv;
    			this.callback = callback;

    			//3. Parse arguments
    			this.parseArgs();

    			//4. write files
    			this.writeFiles();
			},
			/**
			* Parse args and define some booleans
			*
			* @method 				writeDaemonfile
			*/
			parseArgs: function(){

				this.nooptions = false;
				this.noname = false;
				this.monitfile = false;

				program.parse(this.process_argv);

				if(!program.app && !program.env && !program.logfile && !program.name && !program.pidfile && !program.monit)
					this.nooptions = true;
				else if(!program.app && !program.name)
					this.noname = true;

				if(program.app)
					this.options.app = program.app;
				if(program.command && !isFunction(program.command))
				  this.options.command = program.command;
				else
					this.options.command = 'node';
				if(program.name)
					this.options.name = program.name;
				if(program.env)
					this.options.env = program.env;
				if(program.logfile)
					this.options.logfile = program.logfile;
				else
					this.options.logfile = '/var/run/' +this.options.name + '.log';
				if(program.forever)
					this.options.forever = program.forever;
				if(program.pidfile)
					this.options.pidfile = program.pidfile;
				else
					this.options.pidfile = '/var/run/' +this.options.name + '.pid';
				if(program.monit){
					this.options.monit = program.monit;
					this.monitfile = true;
				}


				return;
			},
			/**
			* Test callback function
			*
			* @method 				checkCallback
			* @param {Function} 	callback				function
			*/
			checkCallback:function (callback){

				if (callback && typeof(callback) === "function")
					return true;
				else
					return false;
			},
			/**
			* Write shell script daemon file
			*
			* @method 				writeDaemonfile
			*/
			writeFiles: function(){
				// 1. Before to write, do some check info
				if(this.nooptions === true && this.packageInfo.info === false)
					return this.callback(new Error('No options define in command line AND no package.json information (or file) found'));

				var self = this;

				// write daemon file
				var daemontpl = swig.compile(daemonTemplate);
  				var daemonFile = daemontpl(this.options);

  				fs.writeFile(this.options.name, daemonFile, function (err) {
					self.callback(err,"Script daemon file saved to " + self.options.name);
				});

  				// write monit file only if --monit is defined
				if(this.monitfile === true){
					// write daemon file
					var monittpl = swig.compile(monitTemplate);
  					var monitFile = monittpl(this.options);
	  				var monitFileName = this.options.name + '.monit';

  					fs.writeFile(monitFileName, monitFile, function (err) {
						self.callback(err,"Script monit file saved to " + monitFileName);
					});
				}

			}
		};


		module.exports = new Daemon();

	}
)();
