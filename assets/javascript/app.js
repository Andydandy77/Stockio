$(document).ready(function() {

    // var timeNow = moment();
    // if(timeNow)
    $(document).on("click", ".price", function(){
        console.log(showSharesxPrices);
        showSharesxPrices = !showSharesxPrices;
        var multiplier = 1;
        for (var stockName in user.stocks) {
            if(showSharesxPrices) {
                multiplier = user.stocks[stockName][1];
                

            } 
            var stockPrice = user.stocks[stockName][0] * multiplier;
            $("#" + stockName).text("$"+ stockPrice);

        }
    });

    var showSharesxPrices = false;
    var dayIndex = 77;


    var alphaVantageKey = "QEX4QCA7O8Q6PC86";
    var user = {

        buyingPower: 10000,
        numStocks: 3,
        stocks : {

            "AAPL" : [0, 4],
            "AMZN" : [0, 2],
            "GOOGL": [0, 8],

        },

        portfolio: 10000,

    }


    portfolioHistoryDay = [];

    // function pullStockData() {

    // function pullStockData = return new Promise((resolve, reject) => {
        
    // })
    //  const pullStockData = (period) => {
        
    //     return new Promise((resolve, reject) => {
            
    //         const interval = setInterval(() => { 

    var callStocks = function() {
        console.log("hi")
                
                
                user.portfolio = 0;
                
                portfolioHistoryDay = [];
                for(var i = 0; i < 78; i++) {
                    portfolioHistoryDay.push(0);
                }

                
                for (var stock in user.stocks) {
                        // console.log(portfolioHistoryDay)
                            //stock[2] = 0
                            //console.log(ticker);
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
                                //console.log(prices);
                                var meta = response["Meta Data"];
                                var stock = meta["2. Symbol"];
                                //["Symbol"];
                                //console.log(meta)
                                //console.log(stock);

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


                            // console.log(portfolioHistoryDay);
                            
                                //console.log(prices[mostRecentTime]);
                                //console.log(price)
                                price = prices[mostRecentTime]["4. close"];
                                //console.log(price);

                                console.log(user.portfolio);
                                var sharesxPrices =  price * user.stocks[stock][1];
                                
                                user.portfolio = user.portfolio + sharesxPrices;
                                user.stocks[stock][0] = price


                                if(!showSharesxPrices) {

                                    $("#"+ stock).text("$"+ user.stocks[stock][0]);
                                } else {
                                    $("#"+ stock ).text("$"+ sharesxPrices);
                                }
                                

                                var fiveMinsAfter = moment(mostRecentTime, "YYYY-MM-DD HH:mm:ss" ).set("hour", 9);
                                fiveMinsAfter = fiveMinsAfter.set("minute" , 30);
                                // var afterMarket = moment(mostRecentTime, "YYYY-MM-DD HH:mm:ss" ).set("hour", 16);
                                // afterMarket = afterMarket.set("minute", 0);

                                //console.log(fiveMinsAfter.format("HH:mm:ss"));
                                //console.log(afterMarket.format("HH:mm:ss"));
                                //console.log(beforeMarket.format("YYYY-MM-DD HH:mm:ss"));
                                
                                // daily portfolio values
                                while(fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss") !== mostRecentTime){
                                    //console.log(mostRecentTime);
                                    // console.log(fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss"))
                                    //console.log(portfolioHistoryDay);

                                    //console.log(prices[fiveMinsBefore.format("YYYY-MM-DD HH:mm:ss")]["4. close"]);
                                    //console.log(portfolioHistoryDay[dayIndex]);
                                    portfolioHistoryDay[dayIndex] = portfolioHistoryDay[dayIndex] + parseInt(prices[fiveMinsAfter.format("YYYY-MM-DD HH:mm:ss")]["4. close"]) * user.stocks[stock][1] ;
                                    //console.log("portfolio at index" + dayIndex + " is " + portfolioHistoryDay[dayIndex] )
                                    //console.log(portfolioHistoryDay);
                                    
                                    fiveMinsAfter = fiveMinsAfter.add('5' ,"minutes");
                                    //console.log("index " + dayIndex + ": " + portfolioHistoryDay[dayIndex]);

                    
                                    dayIndex++;

                                }
                                temp++;
                                console.log(portfolioHistoryDay);
                                console.log(temp);
                                
                            }).then(function() {
                                    if (temp === user.numStocks) {
                                        portfolioHistoryDay.length = dayIndex;
                                        afterPromise();
                                        console.log(portfolioHistoryDay)

                                        console.log("done")
                                        //resolve("Success!")
                                    }

                            });   
                        

                


                }
                //console.log(temp === user.numStocks);
                // console.log(temp);
                // console.log(user.numStocks);

                
            
        // console.log("index 2 after all 3 api calls" + portfolioHistoryDay[2]);
            //afterAPI();
        
           // }, period);

        //})
   //};
    };
    callStocks();
    setInterval(callStocks, 60000);
        

    //pullStockData(60000).then(afterPromise()).catch((error) => {console.log(error)});



    function afterPromise() {
        console.log("entered afterPromise")
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




    var displayName = "haha";
    var totalAmount = 2;
    
    if($("#" + name).length == 0) {
        if (totalAmount === 1){
        $("#holding").append("<div class = 'holding'> <div class= 'stockName'> <p>" + 
        displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " share </p> </div> <div class = 'price' id = '" +
        displayName + "'> </div> </div> " )}
        
        else {  
        $("#holding").append("<div class = 'holding'> <div class= 'stockName'> <p>" + 
        displayName + "</p> </div> <div class = 'shareNumber'> <p>" + totalAmount + " shares </p> </div> <div class = 'price' id = '" +
        displayName + "'> </div> </div> " )}
        
        
        };
        
    



});

