angular.module('classroomApp')
.service('loginService',['$firebaseAuth',function($firebaseAuth){
	var firebaseObj = new Firebase("https://glowing-inferno-5931.firebaseio.com");
	var loginObj = $firebaseAuth(firebaseObj);
	console.log('reinit')
	return {
		login : function(username,password){
				return loginObj.$authWithPassword({
				email: username,
				password: password
			})
		},
		logout:function(){
			loginObj.$unauth();
		}
		
	}
}])
.service('SessionData', function($rootScope) {
    var user = '';
 
    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
			$rootScope.user = value;
        }
    };
})
.service('dataservice',function($firebaseArray){
	var firebaseObj = new Firebase("https://glowing-inferno-5931.firebaseio.com/classroom");
	return {
	saveData:function(data){
		var dataArray=$firebaseArray(firebaseObj);
		dataArray.$add(data).then
		 (function(res){console.log(res);},
		 function(err){console.log(err);}
		 );
  }
	}
	
});