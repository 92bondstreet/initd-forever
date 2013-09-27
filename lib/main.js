(
	function(){

		var program = require('commander'); 

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

				var package = require(process.cwd() + '/package.json');
				if(package.main && package.name){
					this.packageInfo.info = true;
					this.packageInfo.name = package.name;
					this.packageInfo.appjs = package.main;
				}
			
				// Create default options value	
				this.options = {	app:this.packageInfo.main,
									env:'production',
									name:this.packageInfo.name,
									logfile:'/var/run' + this.packageInfo.name + '.log',
									pidfile:'/var/run' + this.packageInfo.name + '.pid',
									monit:'3000'
				};
			},
			/**
			* Generate script file daemon and monit
			*
			* @method script 			
			* @param {Array} 		process_argv	process.arv
			* @param {Function} 	callback		function	 
			*/
			script: function(process_argv,callback){
				
			}
		};


		module.exports = new Daemon();

	}
)();