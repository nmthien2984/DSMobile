(function() {
  angular.module('app.controllers', ["firebase"])
  .controller("mainCtrl", ["$scope", "$firebaseArray", "$window", 
  function($scope, $firebaseArray, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");
    
    $scope.search="";	
    $scope.phones;
    $scope.popularPhones;
    $scope.currentBrand;
    $scope.products = $firebaseArray(ref.child('products'));
    $scope.products.$loaded()
      .then(function() {
        console.log($scope.products);        
        var brand = Lockr.get("reqBrand", null);
        if (brand != null && brand == "Search result") {
            $scope.search = Lockr.get("search", "");
            console.log("save search: " + $scope.search);
            $scope.currentBrand = brand;
            $scope.searchPhones();
        } else if (brand == null) {
          $scope.loadPhones("Apple");
          $scope.currentBrand = "Apple";
        } else {
          $scope.loadPhones(brand);
          $scope.currentBrand = brand;
        }


        $scope.populars = $firebaseArray(ref.child('popular'));
        $scope.populars.$loaded()
          .then(function() {
            $scope.popularPhones = [];
            var i;
            var count = 0;
            for (i = 0; i < $scope.products.length; i++) {
              for (j = 0; j < $scope.populars.length; j++) {
                if ($scope.products[i].$id == $scope.populars[j].$value) {
                  $scope.popularPhones.push($scope.products[i]);
                  count++;
                }
                if (count ==  $scope.populars.length) {
                  console.log($scope.popularPhones)
                  return;
                }
              }
            }
          })
          .catch(function(err) {
          console.error(err);
          });

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

    $scope.goToCart = function(){
      $window.location.href = "/cart.html";
    }

    $scope.searchPhones = function() {
      if ($scope.search == "")
        return;
      Lockr.set("search", $scope.search);
      Lockr.set("reqBrand", "Search result");


      $scope.currentBrand = "Search result";
      $scope.phones = [];
      var i;
      for (i = 0; i < $scope.products.length; i++) {
        if ($scope.products[i].name.id.includes($scope.search)) {

          $scope.phones.push($scope.products[i]);
        }
      }

    };

  }]);
})();

