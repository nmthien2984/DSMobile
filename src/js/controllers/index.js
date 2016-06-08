(function() {
	angular.module('app.controllers', "firebase", "ngRoute").controller("mainCtrl", ["$scope", "$firebaseArray", "$window", function($scope, $firebaseArray, $window){

	var ref = new Firebase("https://mobileds.firebaseio.com/");
	
	$scope.phones;
  $scope.currentBrand;
	$scope.products = $firebaseArray(ref.child('products'));
	$scope.products.$loaded()
  		.then(function() {
    		console.log($scope.products);
    		$scope.loadPhones("Apple");
        $scope.currentBrand = "Apple";
  		})
  		.catch(function(err) {
    		console.error(err);
  		});


  	$scope.loadPhones = function(brand) {

      if (brand == $scope.currentBrand)
        return;

      $scope.currentBrand = brand;
  		$scope.phones = [];
  		
  		for (i = 0; i < $scope.products.length; i++) {
  			if ($scope.products[i].maker.name == brand) {

          var phone = $scope.products[i];

          var price = (Math.floor(Math.random() * (400 - 100)) + 100)* 50000; // random giá
  				phone.price = price.toString();

          // định dạng lại dữ liệu
          if (phone.memory.ram >= 1024)
            phone.memory.ram = (phone.memory.ram / 1024).toString() + "GB";
          else
            phone.memory.ram = (phone.memory.ram).toString() + "MB";

          if (phone.memory.rom >= 1024)
            phone.memory.rom = (phone.memory.rom / 1024).toString() + "GB";
          else
            phone.memory.rom = (phone.memory.rom).toString() + "MB";

          // thêm link ảnh
          phone.image = "images/phones/" + phone.$id + ".jpg";

  				$scope.phones.push(phone);

  			}
  		}
		
		console.log($scope.phones);  		
  	};

    $scope.goToProductPage = function(phone) {
      Lockr.set("phone", phone);
      var url = $window.location.host + "/product.html";
      console.log($window.location);
      console.log($window.location.host);
      console.log(url);
      //$window.location.href = url;
    }

    $scope.login = function() {

    };

}]);
})();

