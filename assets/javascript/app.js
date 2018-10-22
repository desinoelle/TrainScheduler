// Initialize Firebase
var config = {
    apiKey: "AIzaSyBglZu77XXNYHUYFU8-fW5zLhN0Vddx3rI",
    authDomain: "train-scheduler-719cb.firebaseapp.com",
    databaseURL: "https://train-scheduler-719cb.firebaseio.com",
    projectId: "train-scheduler-719cb",
    storageBucket: "train-scheduler-719cb.appspot.com",
    messagingSenderId: "1000632820237"
};

firebase.initializeApp(config);

var database = firebase.database();

// Grab submitted info
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // Get user input
    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#place-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm").format("h:mm A");
    var trainFrequency = $("#frequency-input").val().trim();

    // Object to hold data 
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    };

    // Upload data to database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    // Clear text boxes
    $("#name-input").val("");
    $("#place-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

// Adds a row to the Train Schedule table when a new train is added to the database
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store new train info
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    // Convert frequency from string to number
    var tFrequency = parseInt(trainFrequency);

    // Push trainTime back one year
    var convertedTrainTime = moment(trainTime, "HH:mm").subtract(1, "years");

    // Difference between times
    var timeDiff = moment().diff(moment(convertedTrainTime), "minutes");

    // Remainder
    var tRemainder = timeDiff % tFrequency;

    // Minutes away
    var minutesAway = tFrequency - tRemainder;

    // Next Train Arrival
    var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(minutesAway)
    );
  
    // Append the new row to the table
    $("#new-trains").append(newRow);
  });