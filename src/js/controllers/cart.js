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
        $scope.shows = [];
        var i;
        for (i = 0; i < $scope.cartItems.length; i++) {
          let phone = $firebaseObject(ref.child("products/"+ $scope.cartItems[i].$id));
          let j = i;
          phone.$loaded().then(function() {
            phone.quantity = $scope.cartItems[j].$value;
            phone.index = j;
            $scope.total += phone.price * phone.quantity;
            console.log(phone);
            $scope.phones.push(phone);
            $scope.shows.push(false);
          });
        }
        
      })
      .catch(function(err) {
      console.error(err);
      });

    $scope.remove = function(phone) {
      var index = $scope.phones.indexOf(phone);
      var money = phone.price * phone.quantity;
     
      var onComplete = function(error) {
        if (error) {
          console.log('Synchronization failed');
        } else {
          $scope.phones.splice(index, 1);
          $scope.total -= money;
          console.log('Synchronization succeeded');
        }
      };

      ref.child("carts/" + $scope.user + "/" + phone.$id).remove(onComplete);
    };

  }]);
})();