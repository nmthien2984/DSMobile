(function() {
	angular.module('app.services').factory("authFactory", ["$firebaseAuth",
		function($firebaseAuth) {
			var ref = new Firebase("https://mobileds.firebaseio.com");
			return $firebaseAuth(ref);
		}
	]);
})();

