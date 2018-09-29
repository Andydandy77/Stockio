$(document).ready(function() {



    var alphaVantageKey = "QEX4QCA7O8Q6PC86";
    var user = {

        buyingPower: 10000,
        stocks : {

            "AAPL" : [0, 4],
            "AMZN" : [0, 2],
            "GOOGL": [0, 8],

        },

        portfolio: 10000,

    }

    var intervalId = setInterval(pullStockData, 60000);


    function pullStockData() {
        user.portfolio = 0;

        for (var stock in user.stocks) {
            
            //console.log(ticker);
            var queryUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stock + "&interval=5min&outputsize=full&apikey=" + alphaVantageKey;
            var price = 0;
            //console.log(stock);
            var j = 0
            $.ajax({
                url: queryUrl,
                method: 'GET'

            }).then(function (response){
                //console.log(response);
                

                var prices = response["Time Series (5min)"];
                //console.log(prices);
                var meta = response["Meta Data"];
                var stock = meta["2. Symbol"];
                //["Symbol"];
                console.log(meta)
                console.log(stock);

                var min = 100000000000000;
                var mostRecentTime = "";
                for (var timeStamp in prices) {
                    var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

                    if (diff < min) {
                        min = diff;
                        mostRecentTime = timeStamp;
                    }
                
                }
               // console.log(mostRecentTime);
              
                //console.log(prices[mostRecentTime]);
                console.log(price)
                price = prices[mostRecentTime]["4. close"];

                //console.log(user.portfolio);
                
                user.portfolio = user.portfolio + price * user.stocks[stock][1];
                user.stocks[stock][0] = price

                console.log(user.portfolio);
                //console.log(user.portfolio);
                
                //console.log(user.stockPrices);

                $("#"+ stock + "Price").text("$"+ user.stocks[stock][0]);
                

                    
            
               

                
            });

            

            

            
            


        }
        console.log(user.portfolio);
        


    }
    



});