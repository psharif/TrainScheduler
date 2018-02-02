 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAR54ygQm1qVMeLuzh7iz6tQY-qRb0ayF0",
    authDomain: "trainscheduler-7dcf8.firebaseapp.com",
    databaseURL: "https://trainscheduler-7dcf8.firebaseio.com",
    projectId: "trainscheduler-7dcf8",
    storageBucket: "",
    messagingSenderId: "1025536699954"
  };

  firebase.initializeApp(config);

  var db = firebase.database();

  $("#submit-button").on("click", function(event){

  	event.preventDefault();
  	// Grab the values 
  	var trainName = $("#train-name").val();
  	var departureStation = $("#departure-station").val();
  	var arrivalStation = $("#arrival-station").val();
  	var frequency = $("#frequency").val();

  	db.ref().push({
  		trainName : trainName, 
  		departureStation : departureStation,
  		arrivalStation : arrivalStation,
  		frequency : frequency
  	});
 
  });

  db.ref().on("child_added", function(childSnapShot){

  	console.log(childSnapShot.val()); 

  	var newRow = $("<tr>").html("<td>" + childSnapShot.val().trainName +
  		"</td><td>" + childSnapShot.val().departureStation +"</td><td>" + 
  		childSnapShot.val().arrivalStation +"</td><td>" + 
  		childSnapShot.val().frequency +"</td><td>" + "placeHolder For Next Arrival" +
  		"</td><td>" + "placeHolder For Minutes Away" +"</td>");

  	$("#schedule-table").append(newRow);

  }, function(errorObject){
  	 console.log("Errors handled: " + errorObject.code);
  });

alert("working");