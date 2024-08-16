
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Stock = require('./models/Stock');
const cron = require('node-cron');
const app = express();

const finnhubApiKey = 'cqvg9c9r01qkoahg292gcqvg9c9r01qkoahg2930'; // Replace with your Finnhub API key

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stockdb');

// Function to fetch stock price from Finnhub and save it to MongoDB
const fetchAndSaveStock = async (symbol, name) => {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
    
    const response = await axios.get(url);
    // Log the response to see what the API returns
    console.log(`Response for ${symbol}:`, response.data);

    if (!response.data || !response.data.c) {
      console.error(`Failed to fetch valid data for ${symbol}`);
      return;
    }

    const price = parseFloat(response.data.c); // 'c' is the current price in Finnhub's response

    if (!price) {
      console.error(`Failed to fetch data for ${symbol}`);
      return;
    }

    const stock = await Stock.findOneAndUpdate(
      { symbol },
      { name, symbol, price, lastUpdated: new Date() },
      { new: true, upsert: true } // Update existing or create a new document
    );

    console.log(`Saved data for ${name} (${symbol}): $${price}`);
  } catch (error) {
    console.error(`Error fetching or saving stock data for ${symbol}:`, error);
  }
};

// Schedule the task to fetch stock data every minute
cron.schedule('* * * * *', () => {
  console.log('Fetching stock data...');
  fetchAndSaveStock('AAPL', 'Apple Inc.');
  fetchAndSaveStock('GOOGL', 'Alphabet Inc.');
  fetchAndSaveStock('MSFT', 'Microsoft Corporation');
});


app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to get the price of a specific stock
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (stock) {
      res.json({ price: stock.price });
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Basic route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Stock Price Tracker is running!');
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


    

   