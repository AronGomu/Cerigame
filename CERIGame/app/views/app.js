var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config(function ($routeProvider) {
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

myApp.controller("mainController", function ($scope) {});

myApp.controller("headerController", function ($scope, $location) {

  $scope.is_header = false;

  $scope.GoToProfil = function () {
    $location.path("/profil");
  };

  $scope.logout = function () {
    localStorage.removeItem("active_username");
    $location.path("/");
  };
});

myApp.controller("loginController", function ($scope, $http, $location) {
  if (localStorage.getItem("active_username") != null) {
    $location.path("/home");
  }

  $scope.validation = false;
  $scope.infoLogin = {};

  $scope.login = function (user) {
    $scope.infoLogin = angular.copy(user);
    var data = angular.copy(user);


    $http.post("api/login", data).then(function (response) {
      if (!Object.keys(response.data).length) {
        $scope.validation = false;
      } else {
        $scope.validation = true;
        localStorage.setItem("active_username", response.data[0].identifiant);
        localStorage.setItem("id_user", response.data[0].id);
        $location.path("/home");
      }
    });
  };
});

myApp.controller("homeController", function ($scope, $location, $http) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }

  ////// TEST ///////////
  /*
  $http.post("api/quizzEnded", {
    id: 28,
    nbGoodAnswers: 15,
    time: 50,
    score: 15 * 100 / 50,
  }).then(function (response) {
    console.log("Test");
  });
  */
  /////////////////////

  $scope.goToQuizz = function (difficulty) {
    localStorage.setItem("difficulty", difficulty);
    $location.path("/quizz");
    // /#!/quizz
  }
  $scope.activeUserNameHome = localStorage.getItem("active_username");
});

myApp.controller("profilController", function ($scope) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }



  $scope.visitedUser = {
    name: localStorage.getItem("active_username"),
    nbQuizzPlayed: 5,
    bestScore: 100
  }
});

myApp.controller("quizzController", function (
  $scope,
  $location,
  $http,
  $interval
) {
  if (localStorage.getItem("active_username") == null) {
    $location.path("/");
  }

  $scope.score = 0;

  $scope.difficulty = localStorage.getItem("difficulty");

  function createListAnswer(difficulty, index, listAnswer) {
    listAnswerToReturn = listAnswer[index]["propositions"];
    var nbLoop = -1
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
        listAnswerToReturn.splice(indexWhereTodelete, 1);
      }
    }

    return listAnswerToReturn;
  }

  $http
    .post("api/getQuestions", {
      difficulty: $scope.difficulty
    })
    .then(function (response) {
      if (!Object.keys(response.data).length) {
        $scope.validation = false;
      } else {
        $scope.validation = true;
        $scope.listOfListOfQuestions = response.data;
        $scope.listQuestions =
          $scope.listOfListOfQuestions[Math.floor(Math.random() * 11)]["quizz"];
        $scope.activeQuestion = 0;
        $scope.listAnswer = [];

        $scope.listAnswer = createListAnswer(
          $scope.difficulty,
          $scope.activeQuestion,
          $scope.listQuestions
        );

      }
    });

  $scope.listAnswerOfUser = [];

  $scope.is_answered = false;
  $scope.is_not_answered = true;
  $scope.is_end = false;

  $scope.reveal = function (answer) {
    console.log($scope.activeQuestion);
    $scope.listAnswerOfUser.push(answer);
    $scope.goodAnswer = $scope.listQuestions[$scope.activeQuestion]["réponse"];
    $scope.anecdote = $scope.listQuestions[$scope.activeQuestion]["anecdote"];
    $scope.is_answered = true;
    $scope.is_not_answered = false;
  };

  $scope.nexto = function () {
    $scope.is_answered = false;
    $scope.is_not_answered = true;
    $scope.activeQuestion++;
    $scope.nbQuestions = $scope.listQuestions.length;

    // Script Fin du quizz
    if ($scope.activeQuestion >= $scope.listQuestions.length) {
      $scope.stopTimer = true;
      $scope.nbGoodAnswers = 0;
      for (var i = 0; i < $scope.listQuestions.length; i++) {
        $scope.is_end = true;

        if ($scope.listAnswerOfUser[i] === $scope.listQuestions[i]["réponse"]) {
          $scope.nbGoodAnswers++;
        }
      }
      $scope.score = Math.trunc($scope.nbGoodAnswers * 100 / $scope.timer);

      // Sauvegarde des infos sur fredouil.historique par requête ajax
      /*
          $http.post("api/quizzEnded", {
            id: localStorage.getItem("id_user"),
            nbGoodAnswers: $scope.nbGoodAnswers,
            time: $scope.timer,
            score: $scope.score,
          });
        */

    } else {
      $scope.listAnswer = createListAnswer(
        $scope.difficulty,
        $scope.activeQuestion,
        $scope.listQuestions
      );
    }
  };

  $scope.stopTimer = false;
  $scope.timer = 0;
  $scope.addSecond = function () {
    if ($scope.stopTimer == false) {
      $scope.timer++;
    }
  }
  $interval($scope.addSecond, 1000);

  function stopTimer() {
    $interval.cancel($scope.addSecond);
  }
});