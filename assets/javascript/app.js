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
  var nextArrivalIntervalID; 
  var minutesAwayIntervalID; 

  $("#submit-button").on("click", function(event){

  	event.preventDefault();
  	// Grab the values 
  	var trainName = $("#train-name").val();
  	var departureStation = $("#departure-station").val();
  	var arrivalStation = $("#arrival-station").val();
  	var firstTrainTime = $("#first-train-time").val();
  	var frequency = $("#frequency").val();


  	db.ref().push({
  		trainName : trainName, 
  		departureStation : departureStation,
  		arrivalStation : arrivalStation,
  		firstTrainTime : firstTrainTime,
  		frequency : frequency 
  	});
  
  });

  db.ref().on("child_added", function(childSnapShot){

  	console.log(childSnapShot.key); 

  	var newRow = $("<tr>").html("<td>" + childSnapShot.val().trainName +
  		"</td><td>" + childSnapShot.val().departureStation +"</td><td>" + 
  		childSnapShot.val().arrivalStation +"</td><td>" + 
  		childSnapShot.val().frequency +"</td><td id='" + childSnapShot.key + 
  		"next-arrival'></td><td id='" + childSnapShot.key + "minutes-away'></td>");

  	$("#schedule-table").append(newRow); 

  	minutesAwayIntervalID = setInterval(function(){
  		var minutesLeft = calculateMinutesLeft(childSnapShot.val().frequency, childSnapShot.val().firstTrainTime);
  		$("#" + childSnapShot.key + "minutes-away").text(minutesLeft + " mins");
  		$("#" + childSnapShot.key + "next-arrival").text(minutesTillNextTrain(minutesLeft));
  	} , 30 *1000);

  }, function(errorObject){
  	 console.log("Errors handled: " + errorObject.code);
  });



  function minutesTillNextTrain(minutesLeft){
  	var nextTrain = moment().add(minutesLeft, "minutes");
    return moment(nextTrain).format("hh:mm");
  }


  function calculateMinutesLeft(frequency, firstTrainTime){

  	var tFrequency = frequency;

    var firstTrainTime = firstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    return tMinutesTillTrain;

  }



alert("working");