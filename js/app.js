
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('classroomApp', ['ngAnimate', 'ui.router','firebase'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {

var checkLoggedIn = function($rootScope,$state){
	if(!$rootScope.user){
		$state.go('home')
	}
};
  $stateProvider
  .state('home', {
    url:'/home',
    templateUrl:'templates/login.html',
    controller:'HomeCtrl'
  })

  .state('userHome', {
    url:'/userHome',
    templateUrl:'templates/home.html',
    controller:'formController',
	resolve: { loggedin: checkLoggedIn }
  })

  .state('signup', {
    url:'/signup',
    templateUrl:'templates/signup.html',
    controller:'SignUpCtrl'
  })

  .state('about', {
    url:'/about',
    templateUrl:'templates/about.html'
  })
  
  .state('new', {
    url:'/new',
    templateUrl:'templates/new.html',
    controller:'DemoCtrl'
  })

  $urlRouterProvider.otherwise('/home');
})




// our controller for the form
// =============================================================================
.controller('HomeCtrl',['$scope','$rootScope','$firebaseAuth','$state','SessionData','loginService', function($scope,$rootScope,$firebaseAuth,$state,SessionData,loginService) {
	$scope.login={}

$scope.isRequired = false;
	$scope.signin = function(){

$scope.isRequired = true;

if($scope.login.$invalid)
{
  return;

}

		var username = $scope.login.username;
		var password = $scope.login.password;

    	loginService.login(username,password)
        .then(function(user) {
            //Success callback
            console.log('Authentication successful');
            SessionData.setUser(username);
            $state.go('userHome');

        }, function(error) {
            //Failure callback
            console.log('Authentication failure',error);
        });

	}

	$scope.logout=function(){
		loginService.logout();
		$state.go('home');
	}
	
    $scope.showSignUp = function(){
        $state.go('signup');
    }
	
	
}])




.controller('formController', function($scope,$state,$rootScope,dataservice) {
	console.log("Controller loadedddddddddd");
		$scope.classroom={};
		$scope.classroom.number="LKG";
		$scope.classroom.school="option1";
		$scope.classroom.subject="English";
		$scope.classroom.info="Yes";
		$scope.classroom.slot="Full lesson observation";
		$scope.classroom.time="Pre-lunch session";
		$scope.classroom.observer="Medha";
		$scope.classroom.task="participate";
		$scope.classroom.engaged="Challenging";
		$scope.classroom.learning="Significant";
		$scope.classroom.order="Yes";
		$scope.classroom.effectiveTime="Yes";
		$scope.classroom.ineffectiveTime="Yes";
		$scope.classroom.positiveTone="Yes";
		$scope.classroom.negativeTone="Yes";
		$scope.classroom.friendlyTone="Yes";
		$scope.classroom.overallPlan="Yes";
		
		if($scope.classroom.school=="option5"){
		$scope.classroom.school=$scope.classroom.otherSchool;
		}
		if($scope.classroom.observer=="other"){
		$scope.classroom.observer=$scope.classroom.otherobserver;
		}
		if($scope.classroom.subject=="Others"){
		$scope.classroom.subject=$scope.classroom.othersubject;
		}
		if($scope.classroom.task=="other"){
		$scope.classroom.task=$scope.classroom.othertask;
		}
		if($scope.classroom.engaged=="other"){
		$scope.classroom.engaged=$scope.classroom.otherengaged;
		}
		if($scope.classroom.learning=="other"){
		$scope.classroom.learning=$scope.classroom.otherlearning;
		}
		
		$scope.step={};
		$scope.step.switched="step1";
		
		$scope.stepOne = function() {$scope.step.switched="step1";}
		$scope.stepTwo = function() {$scope.step.switched="step2";}
		$scope.stepThree = function() {$scope.step.switched="step3";}
		
		$scope.saveData = function(){
			dataservice.saveData($scope.classroom);
		}
	

})





