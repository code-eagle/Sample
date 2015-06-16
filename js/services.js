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
		},
		authObj:loginObj
		
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
	var connectedRef = new Firebase("https://glowing-inferno-5931.firebaseio.com/.info/connected");
	var connectionFlag=false
		connectedRef.on("value", function(snap) {
		  if (snap.val() === true) {
			connectionFlag=true;
		  } else {
			connectionFlag=false;
		  }
		});
		if(connectionFlag){
		var dataArray=$firebaseArray(firebaseObj);
		dataArray.$add(data).then
		 (function(res){
		 console.log(res);
		 
		 },
		 function(err){
		 console.log(err);
		 }
		 );
		 }
		 else{
		 var localArr=window.localStorage.getItem("unsyncdata");
		 if(localArr){
             localArr=JSON.parse(localArr);
		 localArr.push(data);
		 window.localStorage.setItem("unsyncdata",JSON.stringify(localArr));
		 }
		 else{
			localArr=[];
			localArr.push(data);
			window.localStorage.setItem("unsyncdata",JSON.stringify(localArr));
		 }
			
		 }
  },
  syncData:function(){
	var localArr=window.localStorage.getItem("unsyncdata");
	if(localArr){
	var connectionFlag=false
	var connectedRef = new Firebase("https://glowing-inferno-5931.firebaseio.com/.info/connected");
		connectedRef.on("value", function(snap) {
		  if (snap.val() === true) {
				var dataArray=$firebaseArray(firebaseObj);
				var tmpArr=JSON.parse(localArr)
				tmpArr.forEach(function(obj){
						dataArray.$add(obj).then
					 (function(res){
					 window.localStorage.removeItem("unsyncdata");
                    window.localStorage.clear();
                     localArr=null;
					 console.log(res); 
					 },
					 function(err){
                    localArr=null;
					 console.log(err);
					 }
					 );
				})
		  }
		});
		
	}
	}
	}
	
});
