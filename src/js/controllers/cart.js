(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("cartCtrl", ["$scope", "$firebaseArray", "$firebaseObject", "$window", 
  function($scope, $firebaseArray, $firebaseObject, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");
    
    $scope.search = "";
    $scope.user = null;
    $scope.total = 0;
    
    function authDataCallback(authData) {
      if (authData) {
        console.log(authData);
        $scope.user = authData;
        $scope.cartItems = $firebaseArray(ref.child("carts/" + $scope.user.uid));
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        $scope.user = null;
        $scope.goToIndex();
        console.log("User is logged out");
      }
    }

    ref.onAuth(authDataCallback);

    $scope.populars = $firebaseArray(ref.child('popular'));
    $scope.populars.$loaded()
      .then(function() {
        $scope.popularPhones = [];
        var i;
        var count = 0;
        for (i = 0; i < $scope.populars.length; i++) {
          let temp = $firebaseObject(ref.child("products/" + $scope.populars[i].$value));
          
          temp.$loaded()
            .then(function() {
                $scope.popularPhones.push(temp);
            })
            .catch(function(err) {
            console.error(err);
            });
          
        }
      })
      .catch(function(err) {
      console.error(err);
      });
    
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

      ref.child("carts/" + $scope.user.uid + "/" + phone.$id).remove(onComplete);
    };


    $scope.loadPhones = function(brand) {
      Lockr.set("reqBrand", brand);
      $scope.goToIndex();
    };

    $scope.searchPhones = function() {
      if ($scope.search == "")
        return;
      Lockr.set("search", $scope.search);
      Lockr.set("reqBrand", "Search result");
      $scope.goToIndex();
    }

    $scope.goToIndex = function() {
      $window.location.href = "/";
    }

    $scope.loadProduct = function(popular) {
      Lockr.set("phone", popular);
      $window.location.href = "/product.html";
    }

  }]);
})();