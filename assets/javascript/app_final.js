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

     // dynamically adds holdings based on user's stocks
     function setHoldings() {
        for (var stock in user.stocks) {
            var holding = $("<div class = 'holding' ></div>");
            var name = $("<div class = 'stockName'></div>");
            var num = $("<div class = 'shareNumber'></div>");
            var price = $("<div class = 'price'></div>");
            name.text(stock);
             console.log(user.stocks)

            num.text(user.stocks[stock][1] + " shares");
            price.attr("id", stock);
            holding.append(name);
            holding.append(num);
            holding.append(price);


            $("#holdings").append(holding);

        }


     }


    var showSharesxPrices = false;
    var dayIndex = 77;
    var displayName ="";
    var hasName = false;
    var hasShare = 0;
    var hasMoney = 0;
    var portfolioHistoryDay = [];
    var currentUser;
    var alphaVantageKey = "QEX4QCA7O8Q6PC86";
    var dataBaseUserSnap;
    var wallet = 10000;
    var key = "";
    var price = 0;
    var moneyHere = 0;
    var searched = false;
    var user = {

        wallet: 0,
        numStocks: 0,
        portfolio: 0,
        stocks : {
        

        }, 
        name : ""

    }
        

    // maybe i dont need this
    database.ref('/userKeys').on("value", function(snapshot) {
        snapshot.forEach((child) => {
          
            userTable[child.val()["uid"]] = child.val()["key"];
            localStorage.setItem("userTable", userTable);
            
        });


    });

    // when page loads, get which user it is by getting the key from the local storage and using that to grab 
    // user information
    database.ref('/users').once("value", function(snapshot) {
        
        key = localStorage.getItem("key");
      

         dataBaseUserSnap = snapshot.val()[key];
        user.wallet = dataBaseUserSnap.wallet;
        user.numStocks = dataBaseUserSnap.numStocks;
        user.portfolio = dataBaseUserSnap.portfolio;
        user.stocks = dataBaseUserSnap.stocks;
        user.name = dataBaseUserSnap.name;
        
        if (user.stocks != null) {
            callStocks();
            setHoldings();
        } else {
            console.log("user has no stocks so call stocks isn't called")
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
        if (user.stocks != null) {
            // console.log("here")

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
            
            console.log(stock);
            $.ajax({
                url: queryUrl,
                method: 'GET'
           
            }).then(function (response){
        
                console.log(response);
                
                dayIndex = 0;
                prices = response["Time Series (5min)"];
               console.log(prices);
               console.log(moneyHere);
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
                moneyHere = price;
                console.log(price);
                console.log(moneyHere);
                console.log("i hate my life");
                console.log(user.portfolio);

                // NEED TO SET OBJECT AND THEN SET FIREBASE
                var sharesxPrices =  price * user.stocks[stock][1];
                user.portfolio = user.portfolio + sharesxPrices;
                user.stocks[stock][0] = price;
                console.log(user);
              

            
                // CHECK IF THIS WORKS!
                // console.log(user.portfolio)
                dataBaseUser.set({
                    portfolio : user.portfolio,
                    stocks : user.stocks,
                    wallet : user.wallet,
                    numStocks : user.numStocks,
                    name : user.name,
                    
                });
               // console.log(dataBaseUserSnap);
               console.log(user.wallet);

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
                console.log(temp + "" + user.numStocks)
                    if (temp === user.numStocks) {
                       // console.log("after")
                        portfolioHistoryDay.length = dayIndex;
                        afterPromise(portfolioHistoryDay, "#portfolioGraph");
                        // console.log(portfolioHistoryDay)

                        // console.log("done")
                        //resolve("Success!")
                    }

            });   
        }

        } else {
            console.log("user has no stocks so call stocks isn't called")

        }
                
    };

    console.log(price);
    
    //setInterval(callStocks, 60000);

    console.log(user.wallet);
       
    function afterPromise(array, graph) {
        //console.log("entered afterPromise")
     
       //  console.log(portfolioHistoryDay[1]);

         var arr = [];
         var time = moment("9:30", "hh:mm");
         for (var i = 0; i < array.length; i++) {
            // var converted = d3.time.format("%H-%M");
            // console.log(converted(time.format("hh:mm")))

            //console.log(portfolioHistoryDay[i]);
            dataPoint = {
                date: new Date(),
                value: array[i]
            }
            dataPoint.date.setHours(time.hours())
            dataPoint.date.setMinutes(time.minutes());
         
             arr.push(dataPoint);
             
             time.add('5', "minutes");
         }
      
         drawChart(arr, graph);
    }

 
     function drawChart(data, graph) {
         $(graph).empty();
         $(graph).append("<svg></svg");
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

     //                  WSJ API search results code                           */
     //****************************************************** */

     $("#searchButton").on("click", function (event) {
        event.preventDefault();
        
        
        var userSearched = $("#searchBox").val();
        var WSJapiKey = 'fb343e74a520490caf474136e57f431f';
        var WSJqueryURL = 'https://newsapi.org/v2/everything?' +'q='+userSearched+'&' +'apiKey=' + WSJapiKey;

        $.ajax({
            url: WSJqueryURL,// my ajax call
            method: "GET"
        })

        .then(function(response) { // After the data from the AJAX request comes back
            console.log(response)
            for (let i = 0; i < response.articles.length; i++) {
                var newsHeadLink = $("<a class=linkText style='color: #28a745'>");
                var smallDescription = $("<small>"); 
                smallDescription.text(response.articles[i].description)
                newsHeadLink.text(response.articles[i].title);
                newsHeadLink.attr("href", response.articles[i].url);
                $("#news").append(newsHeadLink);
                $("#news").append("<br></br>");
                $("#news").append(smallDescription);
                $("#news").append("<br></br>");
                $('html, body').scrollTop( $(document).height() );
            }

            // grab the title and put it into a h3 element, then add a href attr to that h3 element with the url


        });

    })

     
     //                  Chi's Code                           */
     //****************************************************** */

     //pretending user.wallet works. 
 
    console.log(user.wallet);

     $("#searchButton").on("click", function(event) {
        event.preventDefault();
        
        searched = true;
        // Grabs user input, put it in var displayname.
         name = $(".form-control").val();
        // Clears all of the text-boxes
         $(".form-control").val("");
        // Display newly searched result on to screen.
        $("#newSearchName").html(name.toUpperCase());
      
      
      
        //upon search, it displays whether i have that stock, if i do, how many, etc.
        database.ref().on("child_added", function(childSnapshot) {
        
            console.log(user.stocks)
          
            database.ref('/users/'+key+'/stocks/'+name.toUpperCase()).once("value", function(snapshot) {
                snapshot.val()
                  
               hasShare = snapshot.val()[1];
               console.log(hasShare);
               
             
              });

            database.ref('/users/'+key+'/stocks/'+name.toUpperCase()).once("value", function(snapshot) {
              snapshot.exists()
                
              hasName = snapshot.exists();
              console.log(hasName);
              console.log(hasShare);
           
            });
            
         //QQQQ   //pulling from exisiting source, not searched value. currently, every time i search, the value goes into "stockShare", thus on page, display every single number i searched.++++++
            //i guess once we figure out how to update our saved share amount, we might be able to pull the latest share value. 
            hasMoney = user.wallet;
         
            console.log(user.wallet);
            
            if (hasName === true && hasShare === 1 ){
                console.log(hasName)
              $(".initialStatus").html("You currently have <br>" + hasShare + " share of " + name + ". <br> You have $"+ hasMoney +" <br> in your My Wallet." )
            } else if (hasName === true && hasShare > 1 ) {
              $(".initialStatus").html("You currently have <br>" + hasShare + " shares of " + name + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
            } else {
              $(".initialStatus").html("You currently have <br> 0 share of " + name + ". <br> You have $"+ hasMoney +"<br> in your My Wallet." )
            }
          
          //   hasShare = 0;
        //QQQ    //should this be = 0?
        
          });
      
      
      console.log(moneyHere);
      
      
      
        //API KEY, DISPLAY GRAPH, MAYBE DUPLICATE, til 242?????++++++++++++++++++++++++++++++++=
        var APIkeyChi = "QFHI6KS6J07ERWBA"
        var queryURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+name+"&interval=5min&apikey="+APIkeyChi;
        var historyDay = [];
      
        // Performing our AJAX GET request
        $.ajax({
          url: queryURL,
          method: "GET"
        })
        
        // After the data comes back from the API
          .then(function(response) {
           
            var mostRecentTime;
                
            
            //API call, putting time value into variable prices. 
            prices = response["Time Series (5min)"];
            var timeArray = [];
            var dayIndex = 0;
            var min = 1000000000000;
            for (var timeStamp in prices) {
                //console.log(timeStamp);
                //portfolioHistoryDay.push(prices[timeStamp]["4. close"]);
                var diff = moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

                if (diff < min) {
                    min = diff;
                    mostRecentTime = timeStamp;
                }
            
                
            
            }
            //pushing pries into timeArray array 
            var fiveMinsAfter = moment(mostRecentTime, "YYYY-MM-DD HH:mm:ss" ).set("hour", 9);
            fiveMinsAfter = fiveMinsAfter.set("minute" , 30);
            while(fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss") !== mostRecentTime){
                //console.log("here")
                timeArray.push(parseInt(prices[fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss")]["4. close"])) ;
                
                fiveMinsAfter = fiveMinsAfter.add('5' ,"minutes");


                

            }
            
            console.log(timeArray);

            //timeArray.length = prices.length;
            afterPromise(timeArray, "#discoverGraph");


      
        
       });
      
      
       console.log(price);
      console.log(moneyHere);
         
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

                if (searched = true){
                buttonPressed = true;
                shareAmount = $(".shareBox").val();
                totalStock = shareAmount * moneyHere
                //to display on our calculation page without the minus.
                moneyDisplay = totalStock;
                //deciding whether user is buying or selling stock
                if(this.id ==="buyStock" && user.wallet > totalStock ){
                  proceed = true;
                  buySell = "buying";
                  //minus totalstock price since we are paying
                  totalStock = -totalStock;
                  //adding shareamount to our totalamount since we are buying more shares
                  totalAmount = parseInt(hasShare) + parseInt(shareAmount);
                } else if (this.id ==="buyStock" && user.wallet < totalStock ){
                  proceed = false;
                  alert("Not Enough Money");
        
                } else if (this.id ==="sellStock" && hasShare >= shareAmount ){
                  proceed = true;
                  buySell = "selling";
                  //subtracting shareamount from the totalamount since we are selling.
                  totalAmount = parseInt(hasShare) - parseInt(shareAmount);
                } else if (this.id ==="sellStock" && hasShare < shareAmount ){ 
                  proceed = false;
                  alert("Don't have enough Share");
                };
            } else if (searched = false){
                alert("Search Your Stock!");
            };
               
                //calculating change in money. 
                currentMoney = user.wallet + totalStock;
               
          
              
              //Displaying what the user is doing before clicking trade button.
        
              if (shareAmount === "1" && proceed)
              { console.log("one")
                $(".currentStatus").html("You are "+ buySell + "<br> " + shareAmount + " share of "+ name + " stock. <br> The total is $" + moneyDisplay + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".")
              } else if (shareAmount > 1 && proceed) {
              $(".currentStatus").html("You are "+ buySell + "<br> " +  shareAmount + " shares of "+ name + " stock.<br>  The total is $" + moneyDisplay + ". <br> Your Wallet balance will change to <br> $" + currentMoney + ".") }
                else {
                  return;
                }
            });

      
 
            //deducting from my wallet.
            $("#tradeStock").on("click", function(event) {
                console.log(currentMoney);
              if(buttonPressed && proceed){
              $(".moneyGoesHere").html("<div> My Wallet : "+ currentMoney +"</div>");
              var setArray = [moneyHere, totalAmount]
            database.ref('/users/'+key+'/stocks/'+name.toUpperCase()).update(setArray)
            database.ref('/users/'+key).update({
                wallet: currentMoney,
              });
                //           shareAmount = 0;
    //           money = currentMoney;
           

      
              // Clears all of the text-boxes
              $(".shareBox").val("");
              $(".currentStatus").html("");  
              $(".initialStatus").html("");
              searched = false;
      
            } else {
              alert("Please Fix Share Amount");
            };
      
      
                // //separate variable to speficially target exisitng share amount in our database
                //   var existingShare = user.stocks[displayName.toUpperCase()]
                //   console.log(existingShare);
      
                //Putting newly bought stock onto portfolio page. 
                //if stock name DOESN'T exsit, create a new div and display on portfolio page. +++++ STILL NEEDS to connect this to portfolio page. 
                  if(user.stocks[name.toUpperCase()] == null) {
      
                if (totalAmount === 1){
                $("#holdings").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
                name + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " share </p> </div> <div class = 'price' id = '" +
                name + "'> </div> </div> " )}
                
                else if (totalAmount > 1) {  
                $("#holdings").append("<div class = 'holding minorFont'> <div class= 'stockName'> <p>" + 
                name + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " shares </p> </div> <div class = 'price' id = '" +
                name + "'> </div> </div> " )}
                  } else {
                      return;
                  };
   
              });
      
       });
    

     // When user is logged in add username to navbar
    firebase.auth().onAuthStateChanged(function (user) {
        //console.log(JSON.stringify(userTable))
        if(user) {
            var user = firebase.auth().currentUser;
            $(".userEmail").append("<span style='color: white'>User:</span> " + user.email);
            
        }

    });
        
    
});

// Logout function
function logout() {

    console.log("logout")
    window.location = 'index.html'
    firebase.auth().signOut()
        // Sign-out successful.
    $(".userEmail").empty();
    console.log("They signed out Trae");


};


