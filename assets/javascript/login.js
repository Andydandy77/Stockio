$(document).ready(function () {
    
    console.log("linked mannn");
});
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC0tz_bNSxnWAANS4j6XKDzHIDz9WFGI70",
        authDomain: "fir-practice-7e0ed.firebaseapp.com",
        databaseURL: "https://fir-practice-7e0ed.firebaseio.com",
        projectId: "fir-practice-7e0ed",
        storageBucket: "fir-practice-7e0ed.appspot.com",
        messagingSenderId: "10233592685"
    };
    firebase.initializeApp(config);


function login() {  
    var userName = $(".userName").val();
    var password = $(".passWord").val();
    firebase.auth().signInWithEmailAndPassword(userName, password).catch(function(error) {
        console.log(error);
        console.log(userName + password)

        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);
        
        });
        
};

function signUp() {
    var userName = $(".userName").val();
    var password = $(".passWord").val();
    firebase.auth().createUserWithEmailAndPassword(userName, password).catch(function(error) {
        console.log("Signed Up")
        // Handle Errors here.

        // var errorCode = error.code;
        // var errorMessage = error.message;
        // window.alert("Error: " + errorMessage);
        
        
    
    });
};


function logout() {
    firebase.auth().signOut()
    // window.location = 'index.html';
        // Sign-out successful.
        console.log("They signed out Trae");
    
    

};

firebase.auth().onAuthStateChanged(function (user) {
    if(user) {

        console.log("fired again");
        var user = firebase.auth().currentUser;

        console.log(user);
        // window.location = 'portfolio.html'; //After successful login, user will be redirected to portfolio.html 
    } else {
        // No user is signed in.
        console.log("Not logged in");
        // window.location = "index.html"
      }

});

