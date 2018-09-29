//MINE
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

  //Initial amount of money
  var Money = 10000;
  $(".moneyGoesHere").html("<div> My Wallet : "+ Money +"</div>");
  
  //empty variable to put currently searched stock name
  var displayName ="";

  //Searching for new stock. 
$(".searchButton").on("click", function(event) {
  event.preventDefault();

   // Grabs user input
   var newSearch = $(".form-control").val();
   // Clears all of the text-boxes
   $(".form-control").val("");
   //putting data into database
   database.ref().push({
     searchname: newSearch
   });
   
    database.ref().on("child_added", function(childSnapshot) {
      // Store everything into a variable.
    displayName = childSnapshot.val().searchname;

    // Append the new row to the table
    $("#newSearchName").html(displayName);
    });

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
        });


        //also need to pull news article

 }); //end
  
     


//sell + buy + trade
$(".discoverButton").on("click", function() {

  if ($(this).id === "buyStock"){

  
  // In this case, the "this" keyword refers to the button that was clicked
  //money decrease. grab "price" and deduct from my wallet.
  //whatever i bought gets added on to the portfolio.
  } else if ($(this).id === "sellStock"){
    //calculate the differnece, whether profit or loss
    //add or subtract that much from wallet

  } else if ($(this).id === "tradeStock"){
    //swap whatever i'm buying with whatever i have
  }
  //


});





// //DAVES
// $(document).ready(function() {

//     var alphaVantageKey = "QEX4QCA7O8Q6PC86";
//     var user = {

//         buyingPower: 10000,
//         stocks: ["AAPL"]

//     }

//     var intervalId = setInterval(pullStockData, 5000);


//     function pullStockData() {

//         for(var i = 0; i < user.stocks.length; i++) {
//             var ticker = user.stocks[i];
//             console.log(ticker);
//             var queryUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + ticker + "&interval=5min&outputsize=full&apikey=" + alphaVantageKey;

//             $.ajax({
//                 url: queryUrl,
//                 method: 'GET'

//             }).then(function (response){

//                 //console.log(response);
//                 //console.log(response[0]);
//                 //console.log(response);
//                 var prices = response["Time Series (5min)"];
//                 //console.log(prices);

//                 var min = 100000000000000;
//                 var mostRecentTime = "";
//                 for (var timeStamp in prices) {
//                     var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

//                     if (diff < min) {
//                         min = diff;
//                         mostRecentTime = timeStamp;
//                     }
                
//                 }
//                 console.log(mostRecentTime);

//                 console.log(prices[mostRecentTime]);
//                 var price = prices[mostRecentTime]["4. close"];
//                 console.log(price);

                

//             });

//         }


//     }



// });
