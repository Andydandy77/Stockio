$(document).ready(function() {

    //                       Firebase                  //
    /*******************************************************/
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
    var newAccount = false;

    $(document).on("click", "#loginButton", login);
    $(document).on("click", "#signUpButton", signUp);

    // User is able to login if the user has already signed up
    function login() {  
        console.log("entered login");
    
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

   
    // This lets the user make an account
    function signUp() {
        newAccount = true;

        var userName = $(".userName").val();
        var password = $(".passWord").val();
        
        firebase.auth().createUserWithEmailAndPassword(userName, password).catch(function(error) {
            console.log("Signed Up")
            // Handle Errors here.

            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("Error: " + errorMessage);

        });

    };

    

    var key;
    var uid;
    var userTable = {};
   
   console.log(userTable);


    // This happens whenever the user logs in or signs up.
    // If the user is signing up, this pushes a new user to the firebase database
    // and stores the firebase key to another table based off the uid
    // If the user is logging, it grabs the user key from the userkeys table.
    // In both of these cases, login.js sets the user key to local storage so that app_final.js can
    // find the user's information in firebase
    firebase.auth().onAuthStateChanged(function (user) {
        //console.log(JSON.stringify(userTable))
        if(user) {
            window.location = "portfolio.html"
            console.log("hello");
            var user = firebase.auth().currentUser;
            console.log("user is " + user);
            console.log("user id is " + user.uid)
            console.log("user email is " + user.email)
            var  email = user.email;
            uid = user.uid;
            var random = Math.floor(Math.random() * Math.floor(1000000000));
            
            
            if (newAccount) {
                console.log("newUser")
                var newUser = database.ref("/users").push();
                console.log(newUser);
               // console.log(JSON.stringify(newUser))
                console.log(newUser);
                //localStorage.setItem("dataBaseUser" , newUser);
                key = newUser.key

                localStorage.setItem("key", key);
                newAccount = false;
                var newUserId = database.ref("/userKeys").push()
               

                newUserId.set({ 
                    'uid' : uid,
                    'key' : key
                })
                newUser.set({
                    name : email,
                    wallet : 10000,
                    numStocks : 3,
                    stocks :{
                        "AAPL" : [0, 20],
                        "GOOGL" : [0, 20],
                        "AMZN" : [0, 3]

                    },
                    portfolio : 0,
                   
                })

                
            } else {

          
                key = userTable[""+ uid + ""];
                console.log(key)
                localStorage.setItem("key", key);
                
            }

        
        

            $(".userEmail").text(email); 

        } else {
            // No user is signed in.
            console.log("Not logged in");
            
        }  

    });

    // When a userkey is added, this adds it to a local userkeys table 
    // and sets it to local storage.
    database.ref('/userKeys').on("value", function(snapshot) {
        snapshot.forEach((child) => {
            console.log(child.val());
            console.log(child.val()["uid"]);
            console.log(child.val()["key"]);

            userTable[child.val()["uid"]] = child.val()["key"];
        
        });

        localStorage.setItem("userTable", JSON.stringify(userTable));

        console.log(userTable);

    });

   

});