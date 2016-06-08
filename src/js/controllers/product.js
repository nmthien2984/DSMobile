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

    console.log($scope.phone);

    $scope.reviews = $firebaseArray(ref.child("reviews/" + $scope.phone.$id));
    $scope.reviews.$loaded()
      .then(function() {
        console.log($scope.reviews);  
      })
      .catch(function(err) {
      console.error(err);
      });


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

    $scope.title = "";
    $scope.error = "";
    $scope.content = "";
    $scope.submitReview = function() {
      var i;
      for (i = 0; i < $scope.reviews.length; i++) {
        if ($scope.user == $scope.reviews[i].$id) {
          $scope.error = "You already reviewed this product";
          return;
        }
      }  

      if ($scope.title == "" || $scope.content == "") {
        $scope.error = "Can not leave either title or content blank";
        return;
      }

      var reviewItem = {"title" : $scope.title, "content" : $scope.content};

      var onComplete = function(error) {
        if (error) {
          console.log('Synchronization failed');
        } else {
          reviewItem.$id = $scope.user;
          $scope.reviews.push(reviewItem);
          $scope.title = "";
          $scope.content = "";
          console.log('Synchronization succeeded');
        }
      };
      
      ref.child("reviews/"+ $scope.phone.$id + "/" + $scope.user).set(reviewItem, onComplete);
    }

  }]);
})();