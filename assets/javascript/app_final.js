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

    firebase.initializeApp(config);
    var database = firebase.database();

     var userTable = {
        

     }

    var showSharesxPrices = false;
    var dayIndex = 77;
    var displayName ="";
    var hasName ="";
    var hasShare = 0;
    var hasMoney = 0;
    portfolioHistoryDay = [];
    var currentUser;
    var alphaVantageKey = "QEX4QCA7O8Q6PC86";
    var newAccount = false;
    var dataBaseUserSnap;


    var user = {

        wallet: 0,
        numStocks: 0,
        portfolio: 0,
        stocks : {
        

        }, 
        name : ""

    }

    $(document).on("click", "#logoutButton", logout);

    function logout() {

        console.log("logout")
        window.location = 'index.html'
        firebase.auth().signOut()
        // window.location = 'index.html';
            // Sign-out successful.
        $(".userEmail").empty();
        console.log("They signed out Trae");


    };

    // maybe i dont need this
    database.ref('/userKeys').on("value", function(snapshot) {
        snapshot.forEach((child) => {
            console.log(child.val());
            userTable[child.val()["uid"]] = child.val()["key"];
            localStorage.setItem("userTable", userTable);


            
        });

        console.log(user);
        //callStocks();

    });

    // when page loads, get which user it is by getting the key from the local storage and using that to grab 
    // user information
    database.ref('/users').once("value", function(snapshot) {
        var key = localStorage.getItem("key");
         dataBaseUserSnap = snapshot.val()[key];
        user.wallet = dataBaseUserSnap.wallet;
        user.numStocks = dataBaseUserSnap.numStocks;
        user.portfolio = dataBaseUserSnap.portfolio;
        user.stocks = dataBaseUserSnap.stocks;
        user.name = dataBaseUserSnap.name;
        if (user.stocks != null) {
            callStocks();
        }

    });



    // whenever anything is changed in the database, changed the local object
    // database.ref().on("child_changed", function(snapshot) {
    //     console.log("child was changed");
    //     var key = localStorage.getItem("key");


    //     dataBaseUserSnap = snapshot.val()[key];
    //     console.log(dataBaseUserSnap);
        
    //     //  user.wallet = dataBaseUserSnap.wallet;
    //     //  user.numStocks = dataBaseUserSnap.numStocks;
    //     //  user.portfolio = dataBaseUserSnap.portfolio;
    //     //  user.stocks = dataBaseUserSnap.stocks;

    //     //console.log(dataBaseUserSnap);
    //     console.log(user);


        

    // }, function(errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // });

    


    $(document).on("click", ".price", function(){
        console.log(showSharesxPrices);
        showSharesxPrices = !showSharesxPrices;
        var multiplier = 1;
        for (var stockName in user.stocks) {
            if(showSharesxPrices) {
                multiplier = user.stocks[stockName][1];
                

            } 
            var stockPrice = Math.round(user.stocks[stockName][0] * multiplier);
            $("#" + stockName).text("$"+ stockPrice);

        }
    });


   

    var callStocks = function() {
        var  dataBaseUser = database.ref('/users').child(localStorage.getItem("key"));
        console.log(dataBaseUser);    
      // console.log(dataBaseUserSnap)            
        user.portfolio = 0;
        
        portfolioHistoryDay = [];
        for(var i = 0; i < 77; i++) {
            portfolioHistoryDay.push(0);
        }

        
        for (var stock in user.stocks) {
        
            var queryUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stock + "&interval=5min&outputsize=full&apikey=" + alphaVantageKey;
            var price = 0;
            var temp = 0
            
            //console.log(stock);
            $.ajax({
                url: queryUrl,
                method: 'GET'

            }).then(function (response){
                //console.log(response);
                
                dayIndex = 0;
                var prices = response["Time Series (5min)"];
               // console.log(prices);
                var meta = response["Meta Data"];
                var stock = meta["2. Symbol"];


                var min = 100000000000000;
                var mostRecentTime;
                
                for (var timeStamp in prices) {
                    //console.log(timeStamp);
                    //portfolioHistoryDay.push(prices[timeStamp]["4. close"]);
                    var diff = moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

                    if (diff < min) {
                        min = diff;
                        mostRecentTime = timeStamp;
                    }
                
                }

                price = prices[mostRecentTime]["4. close"];
                //console.log(price);

                //console.log(user.portfolio);

                // NEED TO SET OBJECT AND THEN SET FIREBASE
                var sharesxPrices =  price * user.stocks[stock][1];
                user.portfolio = user.portfolio + sharesxPrices;
                user.stocks[stock][0] = price;
                console.log(user)


                // CHECK IF THIS WORKS!
                console.log(user.portfolio)
                dataBaseUser.set({
                    portfolio : user.portfolio,
                    stocks : user.stocks,
                    wallet : user.wallet,
                    numStocks : user.numStocks,
                    name : user.name,

                    
                });
               // console.log(dataBaseUserSnap);

                if(!showSharesxPrices) {

                    $("#"+ stock).text("$"+ Math.round(user.stocks[stock][0]));
                } else {
                    $("#"+ stock ).text("$"+ Math.round(sharesxPrices));
                }
                

                var fiveMinsAfter = moment(mostRecentTime, "YYYY-MM-DD HH:mm:ss" ).set("hour", 9);
                fiveMinsAfter = fiveMinsAfter.set("minute" , 30);
            
                
                // daily portfolio values
                while(fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss") !== mostRecentTime){
                    //console.log("here")
                    portfolioHistoryDay[dayIndex] = portfolioHistoryDay[dayIndex] + parseInt(prices[fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss")]["4. close"]) * user.stocks[stock][1] ;
                    
                    fiveMinsAfter = fiveMinsAfter.add('5' ,"minutes");

    
                    dayIndex++;

                }
                temp++;
                // console.log(portfolioHistoryDay);
                // console.log(temp);
                
            }).then(function() {
                    if (temp === user.numStocks) {
                       // console.log("after")
                        portfolioHistoryDay.length = dayIndex;
                        afterPromise();
                        // console.log(portfolioHistoryDay)

                        // console.log("done")
                        //resolve("Success!")
                    }

            });   
        

        }
                
    };
    
    setInterval(callStocks, 60000);

 
       
    function afterPromise() {
        //console.log("entered afterPromise")
         //console.log(value);
       //  console.log(portfolioHistoryDay[1]);

         var arr = [];
         var time = moment("9:30", "hh:mm");
         for (var i = 0; i < portfolioHistoryDay.length; i++) {
            // var converted = d3.time.format("%H-%M");
            // console.log(converted(time.format("hh:mm")))

            //console.log(portfolioHistoryDay[i]);
            dataPoint = {
                date: new Date(),
                value: portfolioHistoryDay[i]
            }
            dataPoint.date.setHours(time.hours())
            dataPoint.date.setMinutes(time.minutes());
            console.log(dataPoint);
             arr.push(dataPoint);
             
             time.add('5', "minutes");
         }
         console.log(arr);
 
         drawChart(arr);
    }

 
     function drawChart(data) {
         $("#portfolioGraph").empty();
         $("#portfolioGraph").append("<svg></svg");
         //d3.select("svg").

         console.log("entered drawChart")
         var svgWidth = 600, svgHeight = 400;
         var margin = { top: 20, right: 20, bottom: 30, left: 50 };
         var width = svgWidth - margin.left - margin.right;
         var height = svgHeight - margin.top - margin.bottom;
         var svg = d3.select('svg')
           .attr("width", svgWidth)
           .attr("height", svgHeight);
         var g = svg.append("g")
         .attr("transform", 
             "translate(" + margin.left + "," + margin.top + ")"
         );
         var x = d3.scaleTime().rangeRound([0, width]);
         var y = d3.scaleLinear().rangeRound([height, 0]);
 
         var line = d3.line()
         .x(function(d) { return x(d.date)})
         .y(function(d) { return y(d.value)})
         x.domain(d3.extent(data, function(d) { return d.date }));
         y.domain(d3.extent(data, function(d) { return d.value }));
 
         g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x))
         .select(".domain")
         .remove();
 
         g.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("fill", "#000")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
        //  .text("Price ($)");
 
         g.append("path")
         .datum(data)
         .attr("fill", "none")
         .attr("stroke", "#5de27c")
         .attr("stroke-linejoin", "round")
         .attr("stroke-linecap", "round")
         .attr("stroke-width", 2)
         .attr("d", line);
 
 
     }

     
     //                  Chi's Code                           */
     //****************************************************** */
    //  $(".moneyGoesHere").html("<div class='minorFont'> My Wallet : "+ money +"</div>");

    //  $(".searchButton").on("click", function(event) {
    //     event.preventDefault();
      
    //     // //deletes newly appended stock name. this code won't be necessary once we figure out login with data. but still needs to update. 
    //     // $("#holding").html("");
      
    //     // Grabs user input, put it in var displayname.
    //      displayName = $(".form-control").val();
    //     // Clears all of the text-boxes
    //      $(".form-control").val("");
    //     // Display newly searched result on to screen.
    //     $("#newSearchName").html(displayName.toUpperCase());
      
      
      
    //     //upon search, it displays whether i have that stock, if i do, how many, etc.
    //     database.ref().on("child_added", function(childSnapshot) {
        
    //       hasShare = 0;
    //       hasName = (childSnapshot.val().stockName);
          
    //    //QQQQ   //pulling from exisiting source, not searched value. currently, every time i search, the value goes into "stockShare", thus on page, display every single number i searched.++++++
    //       //i guess once we figure out how to update our saved share amount, we might be able to pull the latest share value. 
    //       hasShare = (childSnapshot.val().stockShare);
    //       hasMoney = (childSnapshot.val().myMoney);
      
    //       if (displayName === hasName && hasShare === 1 ){
    //         $(".initialStatus").html("You currently have <br>" + hasShare + " share of " + hasName + ". <br> You have $"+ hasMoney +" <br> in your My Wallet." )
    //       } else if (displayName === hasName && hasShare > 1 ) {
    //         $(".initialStatus").html("You currently have <br>" + hasShare + " shares of " + hasName + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
    //       } else {
    //         $(".initialStatus").html("You currently have <br> 0 share of " + displayName + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
    //       }
        
    //       hasShare = 0;
    //   //QQQ    //should this be = 0?
      
    //     });
      
      
      
      
      
      
    //     //API KEY, DISPLAY GRAPH, MAYBE DUPLICATE, til 242?????++++++++++++++++++++++++++++++++=
    //     var APIkeyChi = "QFHI6KS6J07ERWBA"
    //     var queryURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+displayName+"&interval=5min&apikey="+APIkeyChi;
    //     var historyDay = [];
      
    //     // Performing our AJAX GET request
    //     $.ajax({
    //       url: queryURL,
    //       method: "GET"
    //     })
        
    //     // After the data comes back from the API
    //       .then(function(response) {
           
      
    //         //API call, putting time value into variable prices. 
    //         prices = response["Time Series (5min)"];
      
    //         //pushing pries into timeArray array 
    //         timeArray.push(prices);
    //         for (i = 0;i<prices.length; i++){
    //           timeArray.push(prices[i])
    //         };
      
          
      
    //         //Pulling and Comparing most recent time and stock price. DUPLICATE ++++++++++++++++++++++++++++++++++
    //             for (var timeStamp in prices) {
    //                 var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");
      
    //                 if (diff < min) {
    //                     min = diff;
    //                     mostRecentTime = timeStamp;
    //                 }
                
    //             };
      
    //             //Stock Price of the current time.
    //             price = prices[mostRecentTime]["4. close"];
             
          
      
    //       for(var i = 0; i < 77; i++) {
    //         historyDay.push(0);
    //       }
      
      
    //       var fiveMinsAfter = moment(mostRecentTime, "YYYY-MM-DD HH:mm:ss" ).set("hour", 9);
    //       fiveMinsAfter = fiveMinsAfter.set("minute" , 30);
      
    //       var dayIndex = 0;
    //       while(fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss") !== mostRecentTime){
    //           historyDay[dayIndex] = historyDay[dayIndex] + parseInt(prices[fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss")]["4. close"]) ;
    //           fiveMinsAfter = fiveMinsAfter.add('5' ,"minutes");
    //           dayIndex++;
              
    //       }
      
    //     }).then(function() {
    //       afterPromise();
      
    //     });
      
    //     // These two functions will be deleted when we combine Chi and My javascript files
    //     function afterPromise() {
    //       console.log("entered afterPromise")
    //        //console.log(value);
    //      //  console.log(historyDay[1]);
      
    //        var arr = [];
    //        var time = moment("9:30", "hh:mm");
    //        for (var i = 0; i < historyDay.length; i++) {
    //           // var converted = d3.time.format("%H-%M");
    //           // console.log(converted(time.format("hh:mm")))
      
    //           //console.log(historyDay[i]);
    //           dataPoint = {
    //               date: new Date(),
    //               value: historyDay[i]
    //           }
    //           dataPoint.date.setHours(time.hours())
    //           dataPoint.date.setMinutes(time.minutes());
    //           console.log(dataPoint);
    //            arr.push(dataPoint);
               
    //            time.add('5', "minutes");
    //        }
    //        console.log(arr);
      
    //        drawChart(arr);
    //   }
      
      
    //    function drawChart(data) {
    //        $("#portfolioGraph").empty();
    //        $("#portfolioGraph").append("<svg></svg");
    //        //d3.select("svg").
      
    //        console.log("entered drawChart")
    //        var svgWidth = 600, svgHeight = 400;
    //        var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    //        var width = svgWidth - margin.left - margin.right;
    //        var height = svgHeight - margin.top - margin.bottom;
    //        var svg = d3.select('svg')
    //          .attr("width", svgWidth)
    //          .attr("height", svgHeight);
    //        var g = svg.append("g")
    //        .attr("transform", 
    //            "translate(" + margin.left + "," + margin.top + ")"
    //        );
    //        var x = d3.scaleTime().rangeRound([0, width]);
    //        var y = d3.scaleLinear().rangeRound([height, 0]);
      
    //        var line = d3.line()
    //        .x(function(d) { return x(d.date)})
    //        .y(function(d) { return y(d.value)})
    //        x.domain(d3.extent(data, function(d) { return d.date }));
    //        y.domain(d3.extent(data, function(d) { return d.value }));
      
    //        g.append("g")
    //        .attr("transform", "translate(0," + height + ")")
    //        .call(d3.axisBottom(x))
    //        .select(".domain")
    //        .remove();
      
    //        g.append("g")
    //        .call(d3.axisLeft(y))
    //        .append("text")
    //        .attr("fill", "#000")
    //        .attr("transform", "rotate(-90)")
    //        .attr("y", 6)
    //        .attr("dy", "0.71em")
    //        .attr("text-anchor", "end")
    //       //  .text("Price ($)");
      
    //        g.append("path")
    //        .datum(data)
    //        .attr("fill", "none")
    //        .attr("stroke", "#5de27c")
    //        .attr("stroke-linejoin", "round")
    //        .attr("stroke-linecap", "round")
    //        .attr("stroke-width", 2)
    //        .attr("d", line);
      
      
    //    }
      
      
      
    //         //BUY     
      
    //         //2. needs to add on to Dave's databse to go on portfolio.
      
    //         $(".moneyGoesHere").html("<div> My Wallet : "+ money +"</div>");
      
    //         //whehter user wants to buy or sell
    //         var buySell = "";
    //         //total number of shares chosen.
    //         var shareAmount = 0;
    //         //total amount of stock chosen. (price x share)
    //         var totalStock = 0;
    //         //whether buy or sell has been choosen
    //         var buttonPressed = false;
            
    //         var currentMoney = 0;
      
    //         var totalAmount = 0;
      
    //         //whehter user can proceed with current money + selected share or not. 
    //         var proceed = false;
      
    //         //calculating the total amount to be deducted from my wallet.
    //         $(".dropdown-item").on("click", function(event){
    //           buttonPressed = true;
    //           shareAmount = $(".shareBox").val();
    //           totalStock = shareAmount * price
      
    //           //deciding whether user is buying or selling stock
    //           if(this.id ==="buyStock" && money > totalStock ){
    //             proceed = true;
    //             buySell = "buying";
    //             //minus totalstock price since we are paying
    //             totalStock = -totalStock;
    //             //adding shareamount to our totalamount since we are buying more shares
    //             totalAmount += shareAmount;
    //           } else if (this.id ==="buyStock" && money < totalStock ){
    //             proceed = false;
    //             alert("Not Enough Money");
      
    //           } else if (this.id ==="sellStock" && totalAmount > shareAmount ){
    //             proceed = true;
    //             buySell = "selling";
    //             //subtracting shareamount from the totalamount since we are selling.
    //             totalAmount -= shareAmount;
    //           } else {
    //             proceed = false;
    //             alert("Don't have enough Share");
    //           };
             
    //           //calculating change in money. 
    //           currentMoney = money + totalStock;
             
        
            
    //         //Displaying what the user is doing before clicking trade button.
      
    //           if (shareAmount === "1" && proceed)
    //           { console.log("one")
    //             $(".currentStatus").html("You are "+ buySell + "<br> " + shareAmount + " share of "+ displayName + " stock. <br> The total is $" + totalStock + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".")
    //           } else if (shareAmount > 1 && proceed) {
    //           $(".currentStatus").html("You are "+ buySell + "<br> " +  shareAmount + " shares of "+ displayName + " stock.<br>  The total is $" + totalStock + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".") }
    //             else {
    //               return;
    //             }
    //         });
      
      
            
      
    //         //deducting from my wallet.
    //         $("#tradeStock").on("click", function(event) {
    //           if(buttonPressed && proceed){
    //           $(".moneyGoesHere").html("<div> My Wallet : "+ currentMoney +"</div>");
    //           // user.stocks.push(displayName, price, shareAmount); THIS CAN BE DELETED ONCE LINKED TO TRAE;s  ------------------------------------------------------
    //           database.ref().push({
    //             stockName: displayName,
    //             stockShare: totalAmount,
    //             myMoney: currentMoney
    //           });
      
    //           shareAmount = 0;
    //           money = currentMoney;
           
              
    //   //QQQQ  //Removing stock name from portfolio page IF totalamount reaches 0
    //           if("totalAmount in our database === 0"){
    //               //how do i target that specific #holding div with stockname (displayName)???++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //           };
      
      
    //           // Clears all of the text-boxes
    //           $(".shareBox").val("");
    //           $(".currentStatus").html("");  
      
    //         } else {
    //           alert("Please Fix Share Amount");
    //         };
      
      
    //             //separate variable to speficially target exisitng share amount in our database
    //               var existingShare = user.stocks[displayName.toUpperCase()]
    //               console.log(existingShare);
      
    //             //Putting newly bought stock onto portfolio page. 
    //             //if stock name DOESN'T exsit, create a new div and display on portfolio page. +++++ STILL NEEDS to connect this to portfolio page. 
    //               if(user.stocks[displayName.toUpperCase()] == null) {
      
    //             if (totalAmount === 1){
    //             $("#holding").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
    //             displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " share </p> </div> <div class = 'price' id = '" +
    //             displayName + "'> </div> </div> " )}
                
    //             else {  
    //             $("#holding").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
    //             displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " shares </p> </div> <div class = 'price' id = '" +
    //             displayName + "'> </div> </div> " )}
    //               } else {
      
      
    //                 //If stock name exists, just update the total share amount on database. displaying on Portfolio is done via Dave's app.js code.
    //                 existingShare[1] = totalAmount;
    //                 console.log(existingShare[1]);
                    
    //               };
   
    //           });
      
    //    });
    





});
