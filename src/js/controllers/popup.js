(function() {
	var app = angular.module('app.controllers').controller('PopupCtrl', ["$scope", "$firebaseAuth", "$window",
	
	
	function ($scope, $firebaseAuth, $window)
	{
		var ref = new Firebase("https://mobileds.firebaseio.com");
		this.auth = $firebaseAuth(ref);
		//alert(this.auth);	
		
		this.toggle = function(div_id) {
			var el = document.getElementById(div_id);
			if ( el.style.display == 'none' ) 
				el.style.display = 'block';
			else 
				el.style.display = 'none';
		}
		
		this.blanket_size = function(popUpDivVar) {
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
			popUpDiv.style.top = popUpDiv_height + 'px';
		}

		this.window_pos = function(popUpDivVar) 
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

		this.popup = function(windowname) 
		{
			this.blanket_size(windowname);
			this.window_pos(windowname);
			this.toggle('blanket');
			this.toggle(windowname);		
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
		//this.aglError = null;
		this.aglEmail = null;
		this.aglPass = null;
		
		this.SignUp = function()
		{		
			$scope.aglError = null;

			if (this.aglSUEmail == null || this.aglSUEmail == "")
				$scope.aglError = "Empty Username!";
			else if (this.aglSUPass == null || this.aglSUPass == "")
				$scope.aglError = "Empty Password!";
			else if (this.aglAgree != true)
				$scope.aglError = "Must agree!";
			
			if ($scope.aglError != null)
				return;
						
			this.auth.$createUser({
				email    : this.aglSUEmail,
				password : this.aglSUPass
			}).then(function(userData) {
				alert("Success");

				this.auth.$authWithPassword({
				email    : this.aglSUEmail,
				password : this.aglSUPass
				}).then(function(authData) {
					this.aglSUEmail = null;
					this.aglSUPass = null;
					this.aglFlag = true;
					//window.location.href = "index.html";
				}).catch(function(error) {
					$scope.getError(error);
				});
				
			}).catch(function(error) {
				$scope.getError(error);
			});
		}
	  
		this.SignIn = function()
		{
			$scope.aglError = null;
			if (this.aglEmail == null || this.aglEmail == "")
				$scope.aglError = "Empty Username!"
			else if (this.aglPass == null || this.aglPass == "")
				$scope.aglError = "Empty Password!"
			
			if ($scope.aglError != null)
				return;
			
			this.auth.$authWithPassword({
				email    : this.aglEmail,
				password : this.aglPass
			}).then(function(authData) {
				this.aglEmail = null;
				this.aglPass = null;
				this.aglFlag = true;
				
				alert("Log in successfully");			
			}).catch(function(error) {
				$scope.getError(error);
			});
		}
	}
]);
})();