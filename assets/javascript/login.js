$(document).ready(function() {

    //                       Trae's Code                   //
    /*******************************************************/
    var config = {
        apiKey: "AIzaSyC0tz_bNSxnWAANS4j6XKDzHIDz9WFGI70",
        authDomain: "fir-practice-7e0ed.firebaseapp.com",
        databaseURL: "https://fir-practice-7e0ed.firebaseio.com",
        projectId: "fir-practice-7e0ed",
        storageBucket: "fir-practice-7e0ed.appspot.com",
        messagingSenderId: "10233592685"
    };

    //var userTable = {};

    firebase.initializeApp(config);
    var database = firebase.database();
    var newAccount = false;

    $(document).on("click", "#loginButton", login);
    $(document).on("click", "#signUpButton", signUp);
    $(document).on("click", "#logoutButton", logout);

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

    function logout(event) {

        console.log("logout")
        //window.location = 'index.html'
        firebase.auth().signOut()
        // window.location = 'index.html';
            // Sign-out successful.
        $(".userEmail").empty();
        console.log("They signed out Trae");
        
        
        

    };

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
    //localStorage.setItem("userTable", []); 
    // if(localStorage.getItem("userTable").length === 0) {
    //     console.log("it's null")
    //     userTable = [];
    // } else {
    //     console.log("it's not empty")
    //     userTable = localStorage.getItem("userTable");
    // }
   console.log(userTable);
    
    firebase.auth().onAuthStateChanged(function (user) {
        //console.log(JSON.stringify(userTable))
        if(user) {
            window.location = 'portfolio.html'

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
                // var newUserIdTable = {
                //     'uid' : uid,
                //     'key' : key
                // }
                // console.log(userTable);
                // userTable.push(newUserIdTable);
                // console.log(userTable)
                // localStorage.setItem("userTable", JSON.stringify(userTable));
                // console.log(JSON.parse(localStorage.getItem("userTable")));

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

                
                
                // localStorage.setItem("key", key);
                
                key = userTable[""+ uid + ""];
                console.log(key)
                localStorage.setItem("key", key);
                
            }

        
        
        
            //console.log(user)
            $(".userEmail").text(email); 
            //window.location = 'portfolio.html'// display user email at top of page when logged in

        } else {
            // No user is signed in.
            console.log("Not logged in");
            
        }  

    });

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