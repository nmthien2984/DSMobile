(function() {
	var app = angular.module('app.controllers').controller('PopupCtrl', ["$scope", "$firebaseAuth", "$window",
	
	
	function ($scope, $firebaseAuth, $window)
	{
		var ref = new Firebase("https://mobileds.firebaseio.com");
		$scope.auth = $firebaseAuth(ref);
		console.log($scope.auth);	
		$scope.loggedIn = false;
		$scope.loggedInSpan = "";
		
		$scope.toggle = function(div_id) {
			var el = document.getElementById(div_id);
			if ( el.style.display == 'none' ) 
				el.style.display = 'block';
			else 
				el.style.display = 'none';
		}
		
		$scope.blanket_size = function(popUpDivVar) {
			if (typeof window.innerWidth != 'undefined')
				viewportheight = window.innerHeight;
			else
				viewportheight = document.documentElement.clientHeight;
			
			if ((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight))
				blanket_height = viewportheight;
			else
			{
				if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight)
					blanket_height = document.body.parentNode.clientHeight;
				else
					blanket_height = document.body.parentNode.scrollHeight;
			}
			
			var blanket = document.getElementById('blanket');
			blanket.style.height = blanket_height + 'px';
			var popUpDiv = document.getElementById(popUpDivVar);
			popUpDiv_height=blanket_height/2-200;//200 is half popup's height
			popUpDiv.style.top = window.scrollTop + 'px';
		}

		$scope.window_pos = function(popUpDivVar) 
		{
			if (typeof window.innerWidth != 'undefined')
				viewportwidth = window.innerHeight;
			else
				viewportwidth = document.documentElement.clientHeight;
		
			if ((viewportwidth > document.body.parentNode.scrollWidth) && (viewportwidth > document.body.parentNode.clientWidth))
				window_width = viewportwidth;
			else 
			{
				if (document.body.parentNode.clientWidth > document.body.parentNode.scrollWidth)
					window_width = document.body.parentNode.clientWidth;
				else
					window_width = document.body.parentNode.scrollWidth;
			}
			
			var popUpDiv = document.getElementById(popUpDivVar);
			window_width=window_width/2-200;//200 is half popup's width
			popUpDiv.style.left = window_width + 'px';
		}

		$scope.popup = function(windowname) 
		{
			$scope.blanket_size(windowname);
			$scope.window_pos(windowname);
			$scope.toggle('blanket');
			$scope.toggle(windowname);	
			$scope.flag0 = false;
			$scope.flag1 = false;
			$scope.flag2 = false;			
		}	

		$scope.getError = function(error)
		{
			$scope.aglError = null;

			if (error.code == "INVALID_USER")
				$scope.aglError = "Wrong username!";
			else if (error.code == "INVALID_PASSWORD")
				$scope.aglError = "Wrong password!";
			else if (error.code == "INVALID_EMAIL")
				$scope.aglError = "Invalid email!";
			else if (error.code == "EMAIL_TAKEN")
				$scope.aglError = "Email's used!";
		}
		//$scope.getError("");
		//$scope.aglError = null;
		$scope.aglEmail = null;
		$scope.aglPass = null;

		function authDataCallback(authData) {
	      if (authData) {
	        console.log(authData);
	        $scope.loggedIn = true;
	        if (authData.provider == "facebook")
	        	$scope.loggedInSpan = "Logged in as " + authData.facebook.displayName;
	        else
	        	$scope.loggedInSpan = "Logged in as " + authData.password.email;
	        console.log("loggedIn = " + $scope.loggedIn);
	        console.log("User " + authData.uid + " is logged in with " + authData.provider);
	        setTimeout(function () {
        		$scope.$apply(function(){});
    		}, 1000);
	      } else {
	        $scope.loggedIn = false;
	        $scope.loggedInSpan = "";
	        console.log("loggedIn = " + $scope.loggedIn);
	        console.log("User is logged out");
	      }
	    }

    	ref.onAuth(authDataCallback);

    	$scope.loginFacebook = function() {
			ref.authWithOAuthPopup("facebook", function(error, authData) {
					if (error) {
					console.log("Login Failed!", error);
				} else {
					$scope.popup('popUpDiv');
					console.log("Authenticated successfully with payload:", authData);
				}
			});
		}

		$scope.SignOut = function()
		{
			$scope.auth.$unauth();
		}

		$scope.signOutFromCart = function()
		{
			$scope.auth.$unauth();
			$window.location.href ="/";
		}
		
		$scope.SignUp = function()
		{		
			$scope.aglError = null;

			if ($scope.aglSUEmail == null || $scope.aglSUEmail == "")
				$scope.aglError = "Empty Username!";
			else if ($scope.aglSUPass == null || $scope.aglSUPass == "")
				$scope.aglError = "Empty Password!";
			else if ($scope.aglAgree != true)
				$scope.aglError = "Must agree!";
			
			if ($scope.aglError != null)
				return;
						
			$scope.auth.$createUser({
				email    : $scope.aglSUEmail,
				password : $scope.aglSUPass
			}).then(function(userData) {
				alert("Success"  + userData.uid);

				$scope.auth.$authWithPassword({
				email    : $scope.aglSUEmail,
				password : $scope.aglSUPass
				}).then(function(authData) {
					
					$scope.aglFlag = true;
					//window.location.href = "index.html";
					
					var usersRef = ref.child("users");
					var a = usersRef.child(userData.uid);
					a.set({
						"email" : $scope.aglSUEmail,
						"password" : $scope.aglSUPass						
					});
					
					$scope.aglSUEmail = null;
					$scope.aglSUPass = null;
					$scope.popup('popUpDiv');
					
				}).catch(function(error) {
					$scope.getError(error);
				});
				
			}).catch(function(error) {
				$scope.getError(error);
			});
		}

		$scope.SignIn = function()
		{
			$scope.aglError = null;
			if ($scope.aglEmail == null || $scope.aglEmail == "")
				$scope.aglError = "Empty Username!"
			else if ($scope.aglPass == null || $scope.aglPass == "")
				$scope.aglError = "Empty Password!"
			
			if ($scope.aglError != null)
				return;
			
			$scope.auth.$authWithPassword({
				email    : $scope.aglEmail,
				password : $scope.aglPass
			}).then(function(authData) {
				$scope.aglEmail = null;
				$scope.aglPass = null;
				$scope.aglFlag = true;				
				$scope.popup('popUpDiv');
				alert("Log in successfully");	

				
			}).catch(function(error) {
				$scope.getError(error);
			});
		}

		$scope.SignOut = function()
		{
			$scope.auth.$unauth();
		}
		
		$scope.changeToSignUpForm = function()
		{
			$scope.flag0 = true;
			$scope.flag1 = true; 
		}
		
		$scope.changeToForgotPassword = function()
		{	
			$scope.aglFGError = null;
			$scope.aglFGMess = null;
			$scope.flag0 = true;
			$scope.ForgotPassWord();
		}
		
		$scope.ForgotPassWord = function()
		{
			$scope.aglFGError = null;
			$scope.aglFGMess = null;
			if ($scope.aglEmail == null || $scope.aglEmail == "")
				$scope.aglFGError = "The specified user account does not exist.";
			
			if ($scope.aglFGError != null)
				return;
			
			ref.resetPassword({
			  email: $scope.aglEmail
			}, function(error) {
				$scope.$apply(function () 
				{
					if (error) {
						switch (error.code) {
						  case "INVALID_USER":				  
							console.log("The specified user account does not exist.");
							$scope.aglFGError = "The specified user account does not exist.";
							break;
						  default:
						  
							console.log("Error resetting password:", error);
							$scope.aglFGError = "Error resetting password:" + error;
						}
					} 
					else {
						console.log("Password reset email sent successfully!");
						$scope.aglFGMess = "Password reset email sent successfully! The temporary password lasts for 24 hours! Please check mail & change your password!";			
					}
					
					$scope.flag2 = true;
				})
			});
			
		}
	}
]);
})();