myApp = angular.module('app', ["firebase", "ngAnimate"]);

myApp.controller("appCtrl", ["$scope", "$firebaseObject", function($scope, $firebaseObject){

	var ref = new Firebase("https://dsmobile.firebaseio.com/");
	
	$scope.data = $firebaseObject(ref);

	$scope.data.$loaded()
  		.then(function() {

  		})
  		.catch(function(err) {
    		console.error(err);
  		});


	$scope.googleLogin = function() {
		ref.authWithOAuthPopup("google", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {			
				console.log("Authenticated successfully with payload:", authData);
			}
		}, {
			remember : "sessionOnly"
		});
	}

	$scope.facebookLogin = function() {
		ref.authWithOAuthPopup("facebook", function(error, authData) {
 			if (error) {
    			console.log("Login Failed!", error);
    		} else {
    			console.log("Authenticated successfully with payload:", authData);
    		}
		}, {
			remember : "sessionOnly"
		});
	}

	$scope.twitterLogin = function() {
		ref.authWithOAuthPopup("twitter", function(error, authData) {
 			if (error) {
    			console.log("Login Failed!", error);
    		} else {
    			console.log("Authenticated successfully with payload:", authData);
    		}
		}, {
			remember : "sessionOnly"
		});
	}

	$scope.logout = function() {
		ref.unauth();
	}
    

	function authDataCallback(authData) {
  		if (authData) {
  			$scope.showLogin = false;
  			$scope.auth = true;
  			$scope.promptLogin=false;
  			if (authData.provider == "google")
    			$scope.username = authData.google.displayName;
    		if (authData.provider == "facebook")
    			$scope.username = authData.facebook.displayName;
    		if (authData.provider == "twitter")
    			$scope.username = authData.twitter.displayName;
  			setTimeout(function () {
        		$scope.$apply(function(){});
    		}, 1000);    		
    		console.log("User " + authData.uid + " is logged in with " + authData.provider);
    		console.log($scope.username);  		
  		} else {
    		console.log("User is logged out");
    		$scope.auth = false;
  		}
	}

	// Register the callback to be fired every time auth state changes
	ref.onAuth(authDataCallback);

}]);