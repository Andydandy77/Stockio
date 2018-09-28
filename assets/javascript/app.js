
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBNei_vN8GvML5kPGoD6tfVqAs4GSWaCEw",
    authDomain: "ishallpass-b8571.firebaseapp.com",
    databaseURL: "https://ishallpass-b8571.firebaseio.com",
    projectId: "ishallpass-b8571",
    storageBucket: "ishallpass-b8571.appspot.com",
    messagingSenderId: "160785092414"
  };

  firebase.initializeApp(config);


  var database = firebase.database();

$(".btn-outline-success").on("click", function(event) {
  event.preventDefault();

      // Grabs user input
      var newSearch = $(".form-control").val();
      // Clears all of the text-boxes
      $(".form-control").val("");
      //putting data into database
      database.ref().push({
        searchname: newSearch
      });

});


database.ref().on("child_added", function(childSnapshot) {
  // Store everything into a variable.
var displayName = childSnapshot.val().searchname;


// Append the new row to the table
$("#newSearchName").html(displayName);
});


