(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("productCtrl", ["$scope", "$firebaseArray", "$firebaseObject", "$window", 
  function($scope, $firebaseArray, $firebaseObject, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");

    $scope.user="1312551"; // fix later
    $scope.search = "";
    $scope.quantity = 1;	
    $scope.phone = Lockr.get("phone", null);
    if ($scope.phone != null)
      Lockr.set("reqBrand", $scope.phone.maker.name);

    $scope.loadPhones = function(brand) {
      Lockr.set("phone", null);
      Lockr.set("reqBrand", brand);
      $window.location.href = "/";
    };

    $scope.addToCart = function() {
      var cartItem = $firebaseObject(ref.child("carts/"+ $scope.user + "/" + $scope.phone.$id));
      cartItem.$loaded().then(function() {
        if (cartItem == null) {
          ref.child("carts/"+ $scope.user + "/" + $scope.phone.$id).set($scope.quantity);
        } else {
          ref.child("carts/"+ $scope.user + "/" + $scope.phone.$id).set($scope.quantity + cartItem.$value);
        }
        $scope.goToCart();                
      });          
    }

    $scope.goToCart = function(){
      $window.location.href = "/cart.html";
    }

    $scope.searchPhones = function() {
      if ($scope.search == "")
        return;
      Lockr.set("search", $scope.search);
      Lockr.set("reqBrand", "Search result");
      $window.location.href = "/";
    }

  }]);
})();