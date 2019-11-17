var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(function ($routeProvider) {


	$routeProvider

		.when('/', {
			templateUrl: 'login.html',
			controller: 'loginController'
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

		.when('/endQuizz', {
			templateUrl: 'endQuizz.html',
			controller: 'quizzController'
		})

});


myApp.controller('mainController', function ($scope) {

});

myApp.controller('headerController', function ($scope, $location) {

	console.log('hello there');

	$scope.is_header = false;

	$scope.logout = function () {
		localStorage.removeItem('active_username');
		$location.path('/');
	}
});


myApp.controller('loginController', function ($scope, $http, $location) {

	if (localStorage.getItem("active_username") != null) {
		$location.path('/home');
	}

	$scope.validation = false;
	$scope.infoLogin = {};

	$scope.login = function (user) {
		$scope.infoLogin = angular.copy(user);
		var data = angular.copy(user);

		console.log("data :" + data);

		$http.post('api/login', data)
			.then(function (response) {
				console.log(response.data);
				if (!Object.keys(response.data).length) {
					$scope.validation = false;
				} else {
					$scope.validation = true;
					activeUserName = response.data[0].identifiant;
					$scope.activeUserNameLogin = response.data[0].identifiant;
					localStorage.setItem("active_username", activeUserName);
					console.log(localStorage.getItem("active_username"));
					$location.path('/home');
				}
			});
	};
});




myApp.controller('homeController', function ($scope, $location) {


	if (localStorage.getItem("active_username") == null) {
		$location.path('/');
	}

	$scope.activeUserNameHome = localStorage.getItem("active_username");
});

myApp.controller('profilController', function ($scope) {

	if (localStorage.getItem("active_username") == null) {
		$location.path('/');
	}
});

myApp.controller('quizzController', function ($scope, $location, $http) {

	if (localStorage.getItem("active_username") == null) {
		$location.path('/');
	}

	$http.post('api/getQuestions', {
			difficulty: 'easy'
		})
		.then(function (response) {
			console.log(response.data);
			if (!Object.keys(response.data).length) {
				$scope.validation = false;
				console.log("ERREUR")
			} else {
				$scope.validation = true;
				$scope.listQuestions = response.data;
				$scope.nbQuestions = $scope.listQuestions.length;
			}
		});


	$scope.listAnswerOfUser = [];

	$scope.activeQuestion = 1;

	$scope.nbGoodAnswers = 0;

	$scope.is_end = false;

	$scope.next = function (idAnswer) {
		$scope.listAnswerOfUser.push(idAnswer);
		$scope.activeQuestion++;
		console.log("Valeur de $scope.nbQuestions :" + $scope.nbQuestions);
		if ($scope.activeQuestion > $scope.listQuestions.length) {
			$scope.nbGoodAnswers = 0;
			for (var i = 0; i < $scope.nbQuestions; i++) {
				console.log("Valeur de i :" + i);
				console.log("Valeur de $scope.listAnswerOfUser[i] :" + $scope.listAnswerOfUser[i]);
				console.log("Valeur de $scope.listQuestions[i] :" + $scope.listQuestions[i]);
				console.log("Valeur de $scope.listQuestions[i].listAnswer[$scope.listAnswerOfUser[i]] :" + $scope.listQuestions[i].listAnswer[$scope.listAnswerOfUser[i]]);
				console.log("Valeur de $scope.listQuestions[i].listAnswer[$scope.listAnswerOfUser[i]].is_answer :" + $scope.listQuestions[i].listAnswer[$scope.listAnswerOfUser[i] - 1].is_answer);
				if ($scope.listQuestions[i].listAnswer[$scope.listAnswerOfUser[i] - 1].is_answer == true) {
					$scope.nbGoodAnswers++;
				}
			}
			$scope.test = "Hello ma boi";
			$scope.is_end = true;
		}
	}
});