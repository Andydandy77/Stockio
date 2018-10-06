// WSJ API code- Trae
console.log("linked");
$(document).ready(function () {
    $("#searchButton").on("click", function (event) {
        event.preventDefault();
        
        var userSearched = $("#searchBox").val();
        console.log("linked");
        var WSJapiKey = 'fb343e74a520490caf474136e57f431f';
        var WSJqueryURL = 'https://newsapi.org/v2/everything?' +'q='+userSearched+'&' +'apiKey=' + WSJapiKey;

        $.ajax({
            url: WSJqueryURL,// my ajax call
            method: "GET"
        })

        .then(function(response) { // After the data from the AJAX request comes back
            console.log(response.articles);
            var newsHeadLink = $("<a class=linkText>");
            var smallDescription = $("<small>"); 
            smallDescription.text(response.articles[0].description)
            newsHeadLink.text(response.articles[0].title);
            newsHeadLink.attr("href", response.articles[0].url);
            $("#news").append(newsHeadLink);
            $("#news").append("<br></br>");
            $("#news").append(smallDescription);
            $("#news").append("<br></br>");
        

            // grab the title and put it into a h3 element, then add a href attr to that h3 element with the url


        });

    })

    

});  