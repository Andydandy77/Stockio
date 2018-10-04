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
    var database = firebase.database();
    var dav = "dave";
    


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

        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);

        

    });

    var pushRef = database.ref("/users").push();
            pushRef.set({
                name : userName,
                portfolio: 10000,
                numStocks : 0,
                stocks :{}
                                
            });

      
    
    
};


function logout() {
    firebase.auth().signOut()
    // window.location = 'index.html';
        // Sign-out successful.
        $(".userEmail").empty();
        console.log("They signed out Trae");
    
    

};

firebase.auth().onAuthStateChanged(function (user) {
    if(user) {
        
    var user = firebase.auth().currentUser;

    var email, uid;

    
    email = user.email;
    uid = user.uid;  

    var usersRef = firebase.database().ref();
    var currentUser = usersRef.child("/users/" + uid);

    console.log(currentUser);

    currentUser.set({
        name : "Dave sucks dick"
    });
    

    
    $(".userEmail").text(email); // display user email at top of page when logged in

         
    } else {
        // No user is signed in.
        console.log("Not logged in");
        
      }

    

});



