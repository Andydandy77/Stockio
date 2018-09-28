$(document).ready(function() {

    var alphaVantageKey = "QEX4QCA7O8Q6PC86";
    var user = {

        buyingPower: 10000,
        stocks: ["AAPL"]

    }

    var intervalId = setInterval(pullStockData, 5000);


    function pullStockData() {

        for(var i = 0; i < user.stocks.length; i++) {
            var ticker = user.stocks[i];
            //console.log(ticker);
            var queryUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + ticker + "&interval=5min&outputsize=full&apikey=" + alphaVantageKey;

            $.ajax({
                url: queryUrl,
                method: 'GET'

            }).then(function (response){

                //console.log(response);
                //console.log(response[0]);
                //console.log(response);
                var prices = response["Time Series (5min)"];
                //console.log(prices);

                var min = 100000000000000;
                var mostRecentTime = "";
                for (var timeStamp in prices) {
                    var diff =moment().diff(moment(timeStamp, "YYYY-MM-DD HH:mm:ss") , "minutes");

                    if (diff < min) {
                        min = diff;
                        mostRecentTime = timeStamp;
                    }
                
                }
                console.log(mostRecentTime);

                console.log(prices[mostRecentTime]);
                var price = prices[mostRecentTime]["4. close"];
                console.log(price);

                

            });

        }


    }



});