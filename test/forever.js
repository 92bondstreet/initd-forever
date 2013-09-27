(
	function()
	{
		var should = require('should');
		var daemon = require('../lib/main');


		var traceError = function (error, retval) {
		  if (error) {
		    console.log(error);
		    return;
		  }
		  console.log(retval);
		}


 	   /*
 		* 		Generate 
 		*/
 		describe('Generate daemon script file', function() {
 			describe('with no arguments', function() {
 				it('throw ERROR', function() {
		          (function () {
		          	daemon.script();		            
		          }).should.throw();  
		        });
		    });

		    describe('More than 2 invalids arguments', function() {
		    	it('throw ERROR for just 2', function() {
		          (function () {
		          	daemon.script("","");		
		          }).should.throw();
		        });

		        it('throw ERROR', function() {
		          (function () {
		          	daemon.script("","","");		
		          }).should.throw();
		        });

		         it('throw ERROR', function() {
		          (function () {
		          	daemon.script("","","","");		
		          }).should.throw();
		        });
		    });

		    describe('with 2 valids arguments', function() {
 			
		        /*it('check if package.json is missing ', function() {
		        	daemon.packageInfo.should.have.property('info',false);			        	
		        });*/

		        it('check if package.json has minimalistic values', function() {
		        	daemon.packageInfo.should.have.property('info',true);	
		        	daemon.packageInfo.should.have.property('name');
		        	daemon.packageInfo.should.have.property('appjs');
		        });		       
		    });

		    describe('with 2 valids arguments', function() {
		    	describe('with no options', function() {

		    		/*it('Callback error if package.json is missing', function(done) {
		    			             						         	
			        	daemon.script([],function(err,response){
	             			if (err) 
	             				console.log(err);	             		
	            			done();
	          			});
		    		});

		    		it('Callback error if package.json has not minimalistic info', function(done) {
		    			               						         	
			        	daemon.script([],function(err,response){
	             			if (err) 
	             				console.log(err);	             		
	            			done();
	          			});
		    		});*/

		    		it('generate script file with package.json info', function(done){
			        	               						         	
			        	daemon.script([],function(err,response){
	             			if (err) 
	             				console.log(err);
	             			else
	             				console.log(response);
	            			done();
	          			});
					});


		    	});

		    	describe('with options', function() {
		    		
		    		/*it('Callback error if -a, -n are missing AND package.json is missing', function(done) {
		    			             						         	
			        	daemon.script(['npm','test','-e','production'],function(err,response){
	             			if (err) 
	             				console.log(err);	             		
	            			done();
	          			});
		    		});*/

		    		it('generate script file with arguments', function(done) {
		    			           						         	
			        	daemon.script(['npm', 'test', '-a', '/var/www/mynodesite/app.js', '-e', 'production', '-n', 'mynodesite'],function(err,response){
	             			if (err) 
	             				console.log(err);	
	             			else
	             				console.log(response);	            		
	            			done();
	          			});
		    		});

		    		it('generate monit script file with arguments', function(done) {
		    			             						         	
			        	daemon.script(['npm', 'test', '-a', '/var/www/nodeapp/app.js', '-e', 'production', '-n', 'nodeapp', '-m', '3010'],function(err,response){
	             			if (err) 
	             				console.log(err);	
	             			else
	             				console.log(response);	            		
	            			done();
	          			});
		    		});
		    	});
		    });


 		});
	}
)();