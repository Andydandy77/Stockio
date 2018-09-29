//MINE
  
  var config = {
    apiKey: "AIzaSyBNei_vN8GvML5kPGoD6tfVqAs4GSWaCEw",
    authDomain: "ishallpass-b8571.firebaseapp.com",
    databaseURL: "https://ishallpass-b8571.firebaseio.com",
    projectId: "ishallpass-b8571",
    storageBucket: "ishallpass-b8571.appspot.com",
    messagingSenderId: "160785092414"
  };

  // Initialize FIREBASE 나중에 실행 +++++++++++++++++++++++++++++++++++++++++++++++
  // firebase.initializeApp(config);
  // var database = firebase.database();

  //Initial amount of money
  var money = 10000;
  $(".moneyGoesHere").html("<div> My Wallet : "+ money +"</div>");
  
  //empty variable to put currently searched stock name
  var displayName ="";

  var newSearch= "";
  //Searching for new stock. 
$(".searchButton").on("click", function(event) {
  event.preventDefault();

   // Grabs user input
   displayName = $(".form-control").val();
   // Clears all of the text-boxes
   $(".form-control").val("");

    // Display newly serached result on to screen.
  $("#newSearchName").html(displayName.toUpperCase());
  
  var APIkeyChi = "QFHI6KS6J07ERWBA"
  var queryURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+displayName+"&interval=5min&apikey="+APIkeyChi;

  // Performing our AJAX GET request
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After the data comes back from the API
    .then(function(response) {
     
      var prices = response["Time Series (5min)"];
      console.log(prices);

      var min = 100000000000000;
      var mostRecentTime = "";
      var array = [];

      
      array.push(prices);

      for (i = 0;i<prices.length; i++){
        array.push(prices[i])
      };

      console.log(array);
          for (var timeStamp in prices) {
              var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

              if (diff < min) {
                  min = diff;
                  mostRecentTime = timeStamp;
              }
          
          }
          console.log(timeStamp);
          //2018-09-27 14:10:00
    
          price = prices[mostRecentTime]["4. close"];
          console.log(price);
  
      //somehow making the graph display?
      //buy
     

      //1. needs to click buy + needs to indicate how many shares + needs to click executeTrade
      //2. needs to add on to Dave's databse to go on portfolio.
      //I DONT NEED TO put everything i searched into database. I just need to put the name when putting'

      $(".moneyGoesHere").html("<div> My Wallet : "+ money +"</div>");

      var buyPressed = false;
      // Grabs share amount from user
      var shareAmount = 0;
      var boughtStock = 0;

      //calculating the total amount to be deducted from my wallet.
      $("#buyStock").on("click", function(event){
        buyPressed = true;
        shareAmount = $(".shareBox").val();
        // Clears all of the text-boxes
        $(".shareBox").val("");
        boughtStock = shareAmount * price
      });

      //deducting from my wallet.
      $("#tradeStock").on("click", function(event) {
        console.log(buyPressed);
        if(buyPressed){
          money -= boughtStock;
          console.log(money);
          $(".moneyGoesHere").html("<div> My Wallet : "+ money +"</div>");
        };
        
          
          

           //putting data into database. new databse, not for searching, storing money amount, share, 
          //  database.ref().push({
          //    stockName: newSearch,
          //    stockShare: shareAmount
          //  });
          
        
          });
        

    
    //sell
    //1. needs to click sell + needs to indicate how many shares + needs to click executeTrade
    //2. needs to be removed from Portfolio if the user doesn't own it anymore

    //share



        });


        //also need to pull news article

 }); //end
  
     

