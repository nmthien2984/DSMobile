(function () {
    'use strict';
 
    var app= angular.module('app', ["firebase"]);
	
	app.controller("appCtrl", ["$scope", "$firebaseObject", function($scope, $firebaseObject){

	var ref = new Firebase("https://mobileds.firebaseio.com/");
	
	$scope.phones = {};
	$scope.data = $firebaseObject(ref);
	$scope.data.$loaded()
  		.then(function() {
    		console.log($scope.data);
  		})
  		.catch(function(err) {
    		console.error(err);
  		});


  	$scope.loadPhones = function(brand) {

  		$scope.phones = {};
  		/*console.log($scope.loaded);
  		if ($scope.loaded == false) {
  			ref.child("products").once("value", function(snapshot) {				
					snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key();
					var childData = childSnapshot.val();
					if (childData.maker.name == "Apple")
						$scope.phones.push(childSnapshot);
				});
			});

  		} else*/ 
  			console.log($scope.data.products);	

	  		for (i = 0; i < $scope.data.products.$length; i++) {
	  			console.log($scope.data.products[i].maker.name);
				if ($scope.data.products[i].maker.name == brand)
					$scope.phones.push($scope.data.products[i]);
			}
			
			console.log($scope.phones);
  		
  		
  	}	

}]);
}());