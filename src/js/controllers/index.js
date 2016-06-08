(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("mainCtrl", ["$scope", "$firebaseArray", "$window", 
  function($scope, $firebaseArray, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");
    	
    $scope.phones;
    $scope.currentBrand;
    $scope.products = $firebaseArray(ref.child('products'));
    $scope.products.$loaded()
      .then(function() {
        console.log($scope.products);

        var brand = Lockr.get("reqBrand", null);
        if (brand != null) {
          $scope.loadPhones(brand);
          $scope.currentBrand = brand;
        } else {
          $scope.loadPhones("Apple");
          $scope.currentBrand = "Apple";
        }
      })
      .catch(function(err) {
      console.error(err);
      });


    $scope.loadPhones = function(brand) {

      if (brand == $scope.currentBrand)
      return;

      $scope.currentBrand = brand;
      $scope.phones = [];

      var i;
      for (i = 0; i < $scope.products.length; i++) {
        if ($scope.products[i].maker.name == brand) {
          $scope.phones.push($scope.products[i]);
        }
      }

      console.log($scope.phones);  		
    };

    $scope.goToProductPage = function(phone) {
      Lockr.set("phone", phone);
      $window.location.href = "/product.html";
    };

    

  }]);
})();

