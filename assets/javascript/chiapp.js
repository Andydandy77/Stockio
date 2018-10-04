//API
  var config = {
    apiKey: "AIzaSyBNei_vN8GvML5kPGoD6tfVqAs4GSWaCEw",
    authDomain: "ishallpass-b8571.firebaseapp.com",
    databaseURL: "https://ishallpass-b8571.firebaseio.com",
    projectId: "ishallpass-b8571",
    storageBucket: "ishallpass-b8571.appspot.com",
    messagingSenderId: "160785092414"
  };

// Initialize FIREBASE. 
  firebase.initializeApp(config);
  var database = firebase.database();

  //Initial amount of money. CHANGE ACCORDINGLY +++++++++++++++++++++++++++++++++++++++

  //var money = 10000 only when user creates the id/pass for the first time.++++++++++++++++++++++++
  var money = 10000;
  $(".moneyGoesHere").html("<div class='minorFont'> My Wallet : "+ money +"</div>");
  
  //empty variable to put currently searched stock name. CHANGE ACCORDINGLY++++++++++++++++
  var displayName ="";


  //What gets put in from response.timeseries. shows the value of stock according to change in time. 
  var prices= "";
  //setting up standard of a comaprable value.
  var min = 100000000000000;
  //most recent time to catch the latest time + stock price.
  var mostRecentTime = "";
  //emtpy array to push in ...
  var timeArray = [];

  //pulling data from firebase and put into the variables so we can display.

  var hasName ="";
  var hasShare = 0;
  var hasMoney = 0;

  //Searching for new stock. CHANGE ACCORDINGLY+++++++++++++++++++++++++++++++++++++++++++++++++
  //upon search, grabs user input and displays on HTML.
$(".searchButton").on("click", function(event) {
  event.preventDefault();

  // Grabs user input, put it in var displayname.
   displayName = $(".form-control").val();
  // Clears all of the text-boxes
   $(".form-control").val("");
  // Display newly searched result on to screen.
  $("#newSearchName").html(displayName.toUpperCase());



  //upon search, it displays whether i have that stock, if i do, how many, etc.
  database.ref().on("child_added", function(childSnapshot) {
  
    hasName = (childSnapshot.val().stockName);
    hasShare = (childSnapshot.val().stockShare);
    hasMoney = (childSnapshot.val().myMoney);
    console.log(displayName);
    console.log(hasName);

    if (displayName === hasName && hasShare === 1 ){
      $(".initialStatus").html("You currently have <br>" + hasShare + " share of " + hasName + ". <br> You have $"+ hasMoney +" <br> in your My Wallet." )
    } else if (displayName === hasName && hasShare > 1 ) {
      $(".initialStatus").html("You currently have <br>" + hasShare + " shares of " + hasName + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
    } else {
      $(".initialStatus").html("You currently have <br> 0 share of " + displayName + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
    }
    
  });






  //API KEY
  var APIkeyChi = "QFHI6KS6J07ERWBA"
  var queryURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+displayName+"&interval=5min&apikey="+APIkeyChi;

  // Performing our AJAX GET request
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  
  // After the data comes back from the API
    .then(function(response) {
     

      //API call, putting time value into variable prices. 
      prices = response["Time Series (5min)"];

      //지워지워
      console.log(prices);

      //pushing pries into timeArray array 
      timeArray.push(prices);
      for (i = 0;i<prices.length; i++){
        timeArray.push(prices[i])
      };

      //지워지워
      console.log(timeArray);


      //Pulling and Comparing most recent time and stock price. DUPLICATE ++++++++++++++++++++++++++++++++++
          for (var timeStamp in prices) {
              var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

              if (diff < min) {
                  min = diff;
                  mostRecentTime = timeStamp;
              }
          
          };

          //지워지워
          console.log(timeStamp);
          console.log(mostRecentTime);
          console.log(min);
          console.log(diff);
          
          //Stock Price of the current time.
          price = prices[mostRecentTime]["4. close"];
          console.log(price);
  
      //GRAPHHH??????



      //BUY     

      //2. needs to add on to Dave's databse to go on portfolio.
      //I DONT NEED TO put everything i searched into database. I just need to put the name when putting'

      $(".moneyGoesHere").html("<div> My Wallet : "+ money +"</div>");

      //whehter user wants to buy or sell
      var buySell = "";
      //total number of shares chosen.
      var shareAmount = 0;
      //total amount of stock chosen. (price x share)
      var totalStock = 0;
      //whether buy or sell has been choosen
      var buttonPressed = false;
      
      var currentMoney = 0;

      var totalAmount = 0;

      //whehter user can proceed with current money + selected share or not. 
      var proceed = false;

      //calculating the total amount to be deducted from my wallet.
      $(".dropdown-item").on("click", function(event){
        buttonPressed = true;
        shareAmount = $(".shareBox").val();
        totalStock = shareAmount * price

        //deciding whether user is buying or selling stock
        if(this.id ==="buyStock" && money > totalStock ){
          proceed = true;
          buySell = "buying";
          totalStock = -totalStock;
        } else if (this.id ==="buyStock" && money < totalStock ){
          proceed = false;
          alert("Not Enough Money");

        } else if (this.id ==="sellStock" && totalAmount > shareAmount ){
          proceed = true;
          buySell = "selling";
        } else {
          proceed = false;
          alert("Don't have enough Share");
        };
       
        //calculating change in money. 
        currentMoney = money + totalStock;

        //putting share amount into total amount to put into firebase
        totalAmount += shareAmount;
  
      
      //Displaying what the user is doing before clicking trade button.

        if (shareAmount === "1" && proceed)
        { console.log("one")
          $(".currentStatus").html("You are "+ buySell + "<br> " + shareAmount + " share of "+ displayName + " stock. <br> The total is $" + totalStock + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".")
        } else if (shareAmount > 1 && proceed) {
        $(".currentStatus").html("You are "+ buySell + "<br> " +  shareAmount + " shares of "+ displayName + " stock.<br>  The total is $" + totalStock + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".") }
          else {
            return;
          }
      });


      var user = {

        buyingPower: 10000,
        stocks : {

            "AAPL" : [0, 4],
            "AMZN" : [0, 2],
            "GOOGL": [0, 8],

        },

        portfolio: 10000,

    }
      
      //deducting from my wallet.
      $("#tradeStock").on("click", function(event) {
        if(buttonPressed && proceed){
        $(".moneyGoesHere").html("<div> My Wallet : "+ currentMoney +"</div>");
        // user.stocks.push(displayName, price, shareAmount);
        database.ref().push({
          stockName: displayName,
          stockShare: totalAmount,
          myMoney: currentMoney
        });

        shareAmount = 0;
        money = currentMoney;
       
        // Clears all of the text-boxes
        $(".shareBox").val("");
        $(".currentStatus").html("");  

        //how do you check for duplicates?
        //msg saying you have bought/sold how many. and currently you have whatever.

      } else {
        alert("Please Fix Share Amount");
      }
        //  putting data into database. new databse, not for searching, storing money amount, share, 
       
        //appending this to the html. checks if particular ID exists or not. 
// if(displayName == false) {
  console.log("doesnt exist");

  console.log(user.stocks);

 //condition that checks if the stockname exists//
  // if (){

    if(user.stocks[displayName.toUpperCase()] == null) {
  
  if (totalAmount === 1){
  $("#holding").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
  displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " share </p> </div> <div class = 'price' id = '" +
  displayName + "'> </div> </div> " )}
  
  else {  
  $("#holding").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
  displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " shares </p> </div> <div class = 'price' id = '" +
  displayName + "'> </div> </div> " )}
    } else {
      //updating existing stockname's share amount.
    };
// };
  
  // }
        
      
        });


   

        
        });


        //also need to pull news article

 }); //end
  
     

//TODO
//1. Graph
//2. News Article
//3. SEll - Remove from database if nothing left.
//4. BUY - Put that into portfolio.


