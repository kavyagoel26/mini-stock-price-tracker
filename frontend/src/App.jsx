import  { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import {LineChart} from "recharts"
import {ResponsiveContainer ,CartesianGrid} from "recharts"
import {XAxis,Tooltip, Legend, Line} from "recharts"
import {YAxis} from "recharts"



const App = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [price, setPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  // Fetch the list of stocks from the backend API
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stocks');
        console.log('Fetched stocks:', response.data);
        setStocks(response.data);
        // Set default stock if available
        if (response.data.length > 0) {
          setSelectedStock(response.data[0].symbol);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  // Fetch stock price when the selected stock changes
  useEffect(() => {
    if (!selectedStock) return;

    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/stocks/${selectedStock}`);

        const newPrice = response.data.price || 'Data not available';
        setPrice(newPrice);

        // Add the new price to the price history
        setPriceHistory((prevHistory) => [
          ...prevHistory,
          { time: new Date().toLocaleTimeString(), price: newPrice },
        ]);
      } catch (error) {
        console.error('Error fetching stock price:', error);
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedStock]);

  const handleChange = (event) => {
    setSelectedStock(event.target.value);
  };

  return (
    <div className="body">
    
    <div className="">
      <h1>Stock Price Tracker</h1>
      <hr/>
      <div className="dropdown">
      <select className="dropdown-update" value={selectedStock} onChange={handleChange}>
        {stocks.map((stock) => (
          <option className="dropdown-text" key={stock.symbol} value={stock.symbol}>
            {stock.name}
          </option>
        ))}
      </select>
      </div>
      <h2>Current Price: ${price}</h2>
      </div>
      <div className="LineGraph" >
      <ResponsiveContainer width="95%" height={300}>
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      </div>
  
    </div>
  );
};

export default App;