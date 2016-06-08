(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("productCtrl", ["$scope", "$firebaseArray", "$firebaseObject", "$window", 
  function($scope, $firebaseArray, $firebaseObject, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");
    
    $scope.user = "1312551"; //fix later
    $scope.total = 0;
    
    $scope.cartItems = $firebaseArray(ref.child("carts/" + $scope.user));
    $scope.cartItems.$loaded()
      .then(function() {
        console.log($scope.cartItems);
        $scope.phones = [];
        var i;
        for (i = 0; i < $scope.cartItems.length; i++) {
          let phone = $firebaseObject(ref.child("products/"+ $scope.cartItems[i].$id));
          let j = i;
          phone.$loaded().then(function() {
            phone.quantity = $scope.cartItems[j].$value;
            $scope.total += phone.price * phone.quantity;
            $scope.phones.push(phone);
          });
        }
        
      })
      .catch(function(err) {
      console.error(err);
      });

    $scope.loadPhones = function(brand) {
      Lockr.set("phone", null);
      Lockr.set("reqBrand", brand);
      $window.location.href = "/";
    };

  }]);
})();