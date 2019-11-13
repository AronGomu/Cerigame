var myApp = angular.module('myApp', ['ngRoute']);

var activeUserName = "Rien";


myApp.config(function ($routeProvider) {


	$routeProvider

		.when('/', {
			templateUrl: 'login.html',
			controller: 'mainController'
		})

		.when('/home', {
			templateUrl: 'home.html',
			controller: 'homeController'
		})

		.when('/profil', {
			templateUrl: 'profil.html',
			controller: 'profilController'
		})

		.when('/quizz', {
			templateUrl: 'quizz.html',
			controller: 'quizzController'
		})

});




myApp.controller('mainController', function ($scope) {
	$scope.lol = "lol";
});


myApp.controller('loginController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
	$scope.validation = false;
	$scope.infoLogin = {};

	$scope.login = function (user) {
		$scope.infoLogin = angular.copy(user);
		var data = angular.copy(user);

		console.log(data);

		$http.post('api/login', data)
			.then(function (response) {
				console.log(response.data);
				if (!Object.keys(response.data).length) {
					$scope.validation = false;
				} else {
					$scope.validation = true;
					activeUserName = response.data[0].identifiant;
					$scope.activeUserNameLogin = response.data[0].identifiant;
					console.log(activeUserName);
					$location.path('/home');
				}
			});
	};
}]);




myApp.controller('homeController', ['$scope', function ($scope) {
	$scope.activeUserNameHome = activeUserName;
}]);

myApp.controller('profilController', ['$scope', function ($scope) {
	$scope.message = 'Hello profilController!';
}]);

myApp.controller('quizzController', ['$scope', function ($scope) {

	$scope.activeQuestion = "This is the question";

	$scope.listAnswer = [{
		id: 1,
		text: "Answer 1"
	}, {
		id: 2,
		text: "Answer 2"
	}, {
		id: 3,
		text: "Answer 3"
	}]
}]);