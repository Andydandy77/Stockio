# Stockio


## About Stockio

Stockio is a practice stock investment web application, that utilizes the Alpha Vantage real-time and historical stock API, and the Wall Street Journal API to gather data for Stockio. Stockio is meant for those who are afraid or unaware that they will lose money because they are unfamiliar with investing. This app will help people get the feel for how the stock market works.

## How to use Stockio

The user begins at our login page with a Login or Sign option. The user is then redirected to a portfolio page upon successful email and password authentication. The user will start off with shares of AAPL, GOOGL, and AMZN and $10,000 in their wallet. A real-time graph of all the user’s current hourly stock price for the most recent day the market was open is displayed using the historical data feature from Alpha Vantage and the D3 JavaScript library.


Link to application: https://andydandy77.github.io/Stockio/

![Alt text](assets/images/Login.JPG?raw=true "Login page screenShot")


![Alt text](assets/images/Portfolio.png?raw=true "Portfolio page screenShot")

The user is then instructed to begin buying and trading shares on the discover page. Within the discover page the user may search current real time stock prices from the Alpha vantage API, in addition the user will be shown the top 20 Washington Street Journal articles relevant to their search term at the bottom of the page.

The search field accepts any stock symbol that is traded on the public market. Example of stock symbols: AAPL, AMZON, GOOGL, FB, TPL, UUUU, TSLA, etc.

![Alt text](assets/images/Discover.png?raw=true "Discover page screenShot")

Using a firebase database, the user has the ability to logout and come back to their portfolio page to check on their shares and overall earnings and loses over time. 

## Built with

Alpha Vantage API

Wall Street Journal API

Firebase real-time database

Firebase user authentication

D3 JavaScript library

Moment.js

Bootstrap

## Contributors

Dave Anderson: https://github.com/Andydandy77

Chi Kim: https://github.com/wondlek

Trae Shanks: https://github.com/shankstee


## Possible future adds

1. Use TensorFlow.js library to predict selected stock prices in the future.
2. Feature to favorite desired news articles on portfolio page.
3. Expand stock history to show daily, monthly, and yearly price history.
