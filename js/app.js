
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router','firebase'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '',
            templateUrl: 'form.html',
            controller: 'formController'
        })

        .state('step1', {
            url: '/step1',
            templateUrl: 'step1.html'
        })
        
    
        .state('step2', {
            url: '/step2',
            templateUrl: 'step2.html'
        })
        
        
        .state('step3', {
            url: '/step3',
            templateUrl: 'step3.html'
        });
       
})

// our controller for the form
// =============================================================================
.controller('formController', function($scope,$firebaseSimpleLogin) {
    
var firebaseObj = new Firebase("https://shining-heat-1036.firebaseio.com/");
   
var loginObj = $firebaseSimpleLogin(firebaseObj);
  
  $scope.user = {};
  $scope.SignIn = function(e){ 
     e.preventDefault();
     var username = $scope.user.email;
     var password = $scope.user.password;
     loginObj.$login('password', {
                email: username,
                password: password
            })
            .then(function(user) {
                //Success callback
                console.log('Authentication successful');
                 $state.go('step1');
            }, function(error) {
                //Failure callback
				
                console.log('Authentication failure');
            });
  }
});

