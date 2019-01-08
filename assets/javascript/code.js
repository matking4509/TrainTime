  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCX-HxZYF6GBJPaA7TFiZYmpSDMGPVU8CE",
    authDomain: "traintime-d41e7.firebaseapp.com",
    databaseURL: "https://traintime-d41e7.firebaseio.com",
    projectId: "traintime-d41e7",
    storageBucket: "traintime-d41e7.appspot.com",
    messagingSenderId: "821665649277"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  
  displayTrains();
  intervalId = setInterval(displayTrains, 60000);
// Refresh Trains List
  $("#trainReload").on("click", displayTrains);

  // Watch for Train Entry Form.
  $("#add-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();
    var submitFlag = 0;
    trainName = $("#trainName-input").val().trim();
        if (!trainName) {
            alert("Please enter a Train Name:");
            submitFlag = 1;
        }
    trainDest = $("#trainDest-input").val().trim();
        if (!trainDest) {
            alert("Please enter a Destination:");
            submitFlag = 1;
        }
    trainFat = $("#trainFat-input").val().trim();
        var reFat = new RegExp("[0-9][0-9]:[0-9][0-9]");
        if (!reFat.test(trainFat) || !trainFat) {
            alert("Please enter valid First Arriaval time. 24-Hour format ex: 14:00");
            submitFlag = 1;
        } else {
           // console.log("Valid FAT");
        }   
    // //validate Input
    trainFreq = $("#trainFreq-input").val().trim();
        if (trainFreq.match(/[a-z]/i) || !trainFreq) {
            alert("Please enter valid Frequency. Numbers Only");
            submitFlag = 1;
        } else {
            // console.log("Valid Freq");
        }   
    // //validate Input

    if (submitFlag === 0 ) {
        database.ref("/trains").push({
            train_name: trainName,
            train_destination: trainDest,
            train_firstarrivaltime: trainFat,
            train_frequency: trainFreq
        });
    }
    displayTrains();
  });

function displayTrains() {
    $("#trainData").replaceWith("<table id=\"trainData\" style=\"width:100%\"><tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Next Arrival</th><th>Minutes Away</th></tr></table>");
    var leadsRef = database.ref('trains');
        leadsRef.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();

                var firstTimeConverted = moment(childData.train_firstarrivaltime, "HH:mm").subtract(1, "years");
                var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                var tRemainder = diffTime % childData.train_frequency;
                var tMinutesTillTrain = childData.train_frequency - tRemainder;
                var nextTrain = moment().add(tMinutesTillTrain, "minutes");
                
                var newRow = $("<tr>");
                var tableName = $("<td>");
                    tableName.text(childData.train_name);
                    tableName.appendTo(newRow);
                var tableDest = $("<td>");
                    tableDest.text(childData.train_destination);
                    tableDest.appendTo(newRow);
                var tableFreq = $("<td>");
                    tableFreq.text(childData.train_frequency);
                    tableFreq.appendTo(newRow);
                var tableNat = $("<td>");
                    tableNat.text(moment(nextTrain).format("hh:mm"))
                    tableNat.appendTo(newRow);
                var tableMinAway = $("<td>");
                    tableMinAway.text(tMinutesTillTrain);
                    tableMinAway.appendTo(newRow);
                    newRow.appendTo("#trainData");
                    // console.log("childData", childData);
                });
        });
}