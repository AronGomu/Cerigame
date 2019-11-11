var myApp = angular.module('myApp', ['ngRoute']);

console.log("Hello bro yay");


myApp.config(function ($routeProvider) {

	console.log("Hello bro yay");

	$routeProvider

		.when('/', {
			templateUrl: 'login.html',
			controller: 'mainController'
		})

		.when('/home', {
			templateUrl: 'home.html',
			controller: 'loginController'
		})

});




//console.log("Hello bro yay");

myApp.controller('mainController', function ($scope) {
	$scope.lol = "lol";
});


myApp.controller('loginController', ['$scope', '$http', function ($scope, $http) {
	$scope.infoLogin = {};

	$scope.login = function (user) {
		$scope.infoLogin = angular.copy(user);
		var data = angular.copy(user);

		console.log(data);

		$http.post('api/login', data)
			.then(function (response) {
				$scope.validation = response.data;
			});
	};
}]);




myApp.controller('LogController', ['$scope', '$log', function ($scope, $log) {
	$scope.$log = $log;
	$scope.message = 'Hello World!';
}]);