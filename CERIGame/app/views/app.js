var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config(function($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "login.html",
      controller: "loginController"
    })

    .when("/home", {
      templateUrl: "home.html",
      controller: "homeController"
    })

    .when("/profil", {
      templateUrl: "profil.html",
      controller: "profilController"
    })

    .when("/quizz", {
      templateUrl: "quizz.html",
      controller: "quizzController"
    })

    .when("/endQuizz", {
      templateUrl: "endQuizz.html",
      controller: "quizzController"
    });
});

myApp.controller("mainController", function($scope) {});

myApp.controller("headerController", function($scope, $location) {
  console.log("hello there");

  $scope.is_header = false;

  $scope.logout = function() {
    localStorage.removeItem("active_username");
    $location.path("/");
  };
});

myApp.controller("loginController", function($scope, $http, $location) {
  if (localStorage.getItem("active_username") != null) {
    $location.path("/home");
  }

  $scope.validation = false;
  $scope.infoLogin = {};

  $scope.login = function(user) {
    $scope.infoLogin = angular.copy(user);
    var data = angular.copy(user);

    console.log("data :" + data);

    $http.post("api/login", data).then(function(response) {
      console.log(response.data);
      if (!Object.keys(response.data).length) {
        $scope.validation = false;
      } else {
        $scope.validation = true;
        activeUserName = response.data[0].identifiant;
        $scope.activeUserNameLogin = response.data[0].identifiant;
        localStorage.setItem("active_username", activeUserName);
        console.log(localStorage.getItem("active_username"));
        $location.path("/home");
      }
    });
  };
});

myApp.controller("homeController", function($scope, $location) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }

  $scope.activeUserNameHome = localStorage.getItem("active_username");
});

myApp.controller("profilController", function($scope) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }
});

myApp.controller("quizzController", function(
  $scope,
  $location,
  $http,
  $interval
) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }

  $scope.difficulty = "easy";

  function createListAnswer(difficulty, index, listAnswer) {
    console.log("Enter createListAnswer");
    console.log(difficulty);
    listAnswerToReturn = listAnswer[index]["propositions"];

    nbAnswer = -1;
    if (difficulty == "easy") {
      nbLoop = 2;
    } else if (difficulty == "medium") {
      nbLoop = 1;
    } else if (difficulty == "hard") {
      nbLoop = 0;
    }
    if (nbLoop == -1) {
      console.error("ERROR: parameter isn't good");
      return;
    }

    for (i = 0; i < nbLoop; i++) {
      indexWhereTodelete = Math.floor(
        Math.random() * listAnswerToReturn.length
      );
      if (
        listAnswerToReturn[indexWhereTodelete] == listAnswer[index]["réponse"]
      ) {
        i--;
      } else {
        console.log(listAnswerToReturn[indexWhereTodelete]);
        listAnswerToReturn.splice(indexWhereTodelete, 1);
      }
    }

    return listAnswerToReturn;
  }

  $http
    .post("api/getQuestions", {
      difficulty: $scope.difficulty
    })
    .then(function(response) {
      console.log(response.data);
      if (!Object.keys(response.data).length) {
        $scope.validation = false;
        console.log("ERREUR");
      } else {
        $scope.validation = true;
        $scope.listOfListOfQuestions = response.data;
        $scope.listQuestions =
          $scope.listOfListOfQuestions[Math.floor(Math.random() * 11)]["quizz"];
        console.log($scope.listQuestions);
        $scope.activeQuestion = 0;
        $scope.listAnswer = [];

        $scope.listAnswer = createListAnswer(
          $scope.difficulty,
          $scope.activeQuestion,
          $scope.listQuestions
        );

        console.log($scope.listAnswer);
      }
    });

  $scope.listAnswerOfUser = [];

  //$scope.nbGoodAnswers = 0;
  $scope.is_answered = false;
  $scope.is_not_answered = true;
  $scope.is_end = false;

  $scope.reveal = function(answer) {
    console.log("HELLO HELLO");
    $scope.listAnswerOfUser.push(answer);
    $scope.goodAnswer = $scope.listQuestions[$scope.activeQuestion]["réponse"];
    $scope.anecdote = $scope.listQuestions[$scope.activeQuestion]["anecdote"];
    $scope.is_answered = true;
    $scope.is_not_answered = false;
  };

  $scope.nexto = function() {
    $scope.is_answered = false;
    $scope.is_not_answered = true;
    $scope.activeQuestion++;
    $scope.nbQuestions = $scope.listQuestions.length;

    console.log("$scope.activeQuestion : " + $scope.activeQuestion);
    console.log("$scope.listQuestions.length : " + $scope.listQuestions.length);

    // Script Fin du quizz
    if ($scope.activeQuestion >= $scope.listQuestions.length) {
      $scope.nbGoodAnswers = 0;
      for (var i = 0; i < $scope.listQuestions.length; i++) {
        $scope.is_end = true;

        if ($scope.listAnswerOfUser[i] === $scope.listQuestions[i]["réponse"]) {
          $scope.nbGoodAnswers++;
        }
      }
    } else {
      $scope.listAnswer = createListAnswer(
        $scope.difficulty,
        $scope.activeQuestion,
        $scope.listQuestions
      );
    }
  };

  $scope.timer = 0;
  $scope.addSecond = function() {
    $scope.timer++;
  };
  $interval($scope.addSecond, 1000);
});
