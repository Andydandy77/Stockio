$(document).ready(function () {

    console.log("linked mannn");

    var userName = $(".userName").val();
    var password = $(".passWord").val();

    $(".signUpButton").on("click", function() {
        userName = $(".userName").val();
        password = $(".passWord").val();
        console.log(userName);
        console.log(password);
    });

    $(".loginButton").on("click", function() {
        userName = $(".userName").val();
        password = $(".passWord").val();
        console.log(userName);
        console.log(password);
    });

    // now that I have the username and password I want th
});