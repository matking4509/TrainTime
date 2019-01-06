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



// Watch for trains being added and paint the list
// Link to data on pulling from unknown parent ref.
// https://stackoverflow.com/questions/38541098/how-to-retrieve-data-from-firebase-database

var leadsRef = database.ref('trains');
leadsRef.on('child_added', function(snapshot) {
    // for (var i=0; i < snapshot.length; i++) {
    //   var childData = snapshot[i].val();
    //   console.log("TrainID-" + i, childData);
    // }
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      console.log("TrainID", childData);
    });
});



  // Watch for Train Entry Form.
  $("#add-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();
    trainID = Math.floor((new Date).getTime() / 1000);
    trainName = $("#trainName-input").val().trim();
    trainDest = $("#trainDest-input").val().trim();
    trainFat = $("#trainFat-input").val().trim();
    trainFreq = $("#trainFreq-input").val().trim();

    database.ref("/trains/" + trainID).update({
      train_name: trainName,
      train_destination: trainDest,
      train_firstarrivaltime: trainFat,
      train_frequency: trainFreq
    });
  });