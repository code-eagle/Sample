
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('classroomApp', ['ngAnimate', 'ui.router','firebase','angular-loading-bar'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {

var checkLoggedIn = function($rootScope,$state,loginService){
	
	if(!loginService.authObj.$getAuth()){
		$state.go('login');
	}
};
  $stateProvider
  .state('login', {
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'HomeCtrl'
  })

  .state('userHome', {
    url:'/userHome',
    templateUrl:'templates/home.html',
    controller:'formController'//,
	//resolve: { loggedin: checkLoggedIn }
  })

  .state('signup', {
    url:'/signup',
    templateUrl:'templates/signup.html',
   controller:'SignUpCtrl'
  })
  
    .state('confirmation', {
    url:'/confirmation',
    templateUrl:'templates/confirmation.html'
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

  $urlRouterProvider.otherwise('/userHome');
})




// our controller for the form
// =============================================================================
.controller('HomeCtrl',['$scope','$rootScope','$firebaseAuth','$state','SessionData','loginService', function($scope,$rootScope,$firebaseAuth,$state,SessionData,loginService) {
	$scope.login={}
	$rootScope.bgClass=true;
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
		//	window.localStorage.setItem("loggedin",true);
            $state.go('userHome');

        }, function(error) {
            //Failure callback
		$scope.serverError="Authentication Failure";
            console.log('Authentication failure',error);
        });

	}

	
	
    $scope.showSignUp = function(){
        $state.go('signup');
    }
	
	
}])

.controller('SignUpCtrl', ['$scope','$state','$firebaseAuth','$rootScope', function($scope,$state,$firebaseAuth,$rootScope){
	$rootScope.bgClass=true;
    $scope.login={};
    $scope.isRequired = false;
    var firebaseObj = new Firebase("https://glowing-inferno-5931.firebaseio.com");
    var loginObj = $firebaseAuth(firebaseObj);

    $scope.showSignIn = function(){
        $state.go('login');
    }
	

    $scope.signup = function(){
	$scope.isRequired = true;

	if($scope.loginForm.$invalid)
	{
  		return;

	}
	var obj={};
        obj.email = $scope.login.username;
        obj.password = $scope.login.password;
		obj.school = $scope.login.school
        loginObj.$createUser(obj)
            .then(function() {
                // do things if success
                console.log('User creation success');
                $state.go('login');
            }, function(error) {
                // do things if failure
                console.log(error);
            });
    }

}])


.controller('formController', function($scope,$state,$rootScope,dataservice,loginService,SessionData) {
	$rootScope.bgClass=false;
	dataservice.syncData();
	$scope.logout=function(){
		loginService.logout();
		$state.go('login');
	}
		
		$scope.classroom={};
		$scope.classroom.username=loginService.authObj.$getAuth().password.email;
		/* $scope.classroom.number="LKG";
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
		$scope.classroom.overallPlan="Yes"; */
		
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
		$scope.require=false;
		$scope.require2=false;
		$scope.require3=false;
		$scope.step={};
		$scope.step.switched="step1";
		$scope.formStep1={"form":{}};
		$scope.formStep2={"form":{}};
		$scope.formStep3={"form":{}};
		$scope.stepOne = function() {$scope.step.switched="step1";}
        $scope.stepTwoPrev = function() {$scope.step.switched="step2";}
		$scope.stepTwo = function() {
		$scope.require=true;
		$scope.isRequired = true;
			if($scope.formStep1.form.$invalid){
				return;
			}
		$scope.step.switched="step2";
		}
		$scope.stepThree = function() {
		$scope.require2=true;
		$scope.isRequired = true;
			if($scope.formStep2.form.$invalid){
				return;
			}
		$scope.step.switched="step3";}
		
		$scope.saveData = function(){
		$scope.require3=true;
		$scope.isRequired = true;
			if($scope.formStep3.form.$invalid){
				return;
			}
			dataservice.saveData($scope.classroom);
			$state.go('confirmation');
		}
	

});



var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};


angular.module('classroomApp').directive("compareTo", compareTo);


angular.module('classroomApp').run(function($rootScope,$state,loginService){ 

	$rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){ 
	//  console.log(loginService.authObj.$getAuth().password.email)
	  if(toState.name !== "login" && toState.name !== "signup"){
	  if(!loginService.authObj.$getAuth()){
	 // if(!window.localStorage.getItem("loggedin")){
		 event.preventDefault(); 
			$state.go('login');
		} 
      }   
          // transitionTo() promise will be rejected with 
          // a 'transition prevented' error
 })
 });


