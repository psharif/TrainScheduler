// Configuration for Firebase. 
var config = {
apiKey: "AIzaSyAR54ygQm1qVMeLuzh7iz6tQY-qRb0ayF0",
authDomain: "trainscheduler-7dcf8.firebaseapp.com",
databaseURL: "https://trainscheduler-7dcf8.firebaseio.com",
projectId: "trainscheduler-7dcf8",
storageBucket: "",
messagingSenderId: "1025536699954"
};
///Initializes firebase. 
firebase.initializeApp(config);
///Variable for the database. 
var db = firebase.database(); 
///In case interval needs to be cleared. 
var minutesAwayIntervalID; 


///Every time the submit button is clicked. 
///Get the values. 
///Push those values to the firebase database. 
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

///Every Time A new Train is added, create a Row and use the key for the entry to 
///Differentiate them. 
///Use this key to update the correct row, every minute. 
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
		$("#" + childSnapShot.key + "next-arrival").text(nextTrain(minutesLeft));
	} , 60 *1000);

}, function(errorObject){
	 console.log("Errors handled: " + errorObject.code);
});


//Add the minutes left to the current time. 
//Return the formatted time. 
function nextTrain(minutesLeft){
	var nextTrain = moment().add(minutesLeft, "minutes");
	return moment(nextTrain).format("hh:mm");
}

///Calculates the minutes left for each train. 
///It subtracts a year of time from the beginning time. 
///It then fines the difference in minutes. 
///Finds the remainder of difference divided by Frequency. 
///Subtract the remainder from the frequency. That's your minutes Left. 
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

	return tMinutesTillTrain;
}
