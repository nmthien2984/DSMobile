(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("productCtrl", ["$scope", "$firebaseArray", "$firebaseObject", "$window", 
  function($scope, $firebaseArray, $firebaseObject, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");

    $scope.user=null;
    $scope.search = "";
    $scope.quantity = 1;	
    $scope.phone = Lockr.get("phone", null);
    if ($scope.phone != null)
      Lockr.set("reqBrand", $scope.phone.maker.name);

    console.log($scope.phone);

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

    $scope.reviews = $firebaseArray(ref.child("reviews/" + $scope.phone.$id));
    $scope.reviews.$loaded()
      .then(function() {
        console.log($scope.reviews);  
      })
      .catch(function(err) {
      console.error(err);
      });


    function authDataCallback(authData) {
      if (authData) {
        console.log(authData);
        $scope.user = authData;
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        $scope.user = null;
        console.log("User is logged out");
      }
    }

    ref.onAuth(authDataCallback);


    $scope.loadPhones = function(brand) {
      Lockr.set("phone", null);
      Lockr.set("reqBrand", brand);
      $window.location.href = "/";
    };

    $scope.addToCart = function() {
      var cartItem = $firebaseObject(ref.child("carts/"+ $scope.user.uid + "/" + $scope.phone.$id));
      cartItem.$loaded().then(function() {
        if (cartItem == null) {
          ref.child("carts/"+ $scope.user.uid + "/" + $scope.phone.$id).set($scope.quantity);
        } else {
          ref.child("carts/"+ $scope.user.uid + "/" + $scope.phone.$id).set($scope.quantity + cartItem.$value);
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

      if ($scope.user == null) {
        $scope.error = "You must login to submit review"
        return;
      }

      var i;
      for (i = 0; i < $scope.reviews.length; i++) {
        if ($scope.user.uid == $scope.reviews[i].$id) {
          $scope.error = "You already reviewed this product";
          return;
        }
      }  

      if ($scope.title == "" || $scope.content == "") {
        $scope.error = "Can not leave either title or content blank";
        return;
      }

      var name;
      if (user.provider == "facebook")
        name = $scope.user.facebook.displayName;
      else
        name = $scope.user.password.email;

      var reviewItem = {"name" : name, 
        "title" : $scope.title, "content" : $scope.content};

      var onComplete = function(error) {
        if (error) {
          console.log('Synchronization failed');
        } else {
          reviewItem.$id = $scope.user.uid;
          $scope.reviews.push(reviewItem);
          $scope.title = "";
          $scope.content = "";
          console.log('Synchronization succeeded');
        }
      };
      
      ref.child("reviews/"+ $scope.phone.$id + "/" + $scope.user.uid).set(reviewItem, onComplete);
    }

    $scope.loadProduct = function(popular) {
      $scope.phone = popular;
      Lockr.set("reqBrand", $scope.phone.maker.name);
      Lock.set("phone", phone);  
    }

  }]);
})();