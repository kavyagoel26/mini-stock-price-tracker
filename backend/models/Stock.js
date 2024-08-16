// const mongoose = require("mongoose");


// //mongoose.connect("mongodb+srv://username:HlWclZ2IcmHhtsIZ@cluster0.g94hiue.mongodb.net/StockTable ")
// const StockSchema = new mongoose.Schema({
//     symbol:{
//         type: String,
//         required: true
//     },
//     name: {
//         type:String,
//         required: true,
//         unique: true
//     },
//     price:{
//         type:Number,
//         require: true
//     }
// })

// const Stock = mongoose.model('Stock', StockSchema);

// module.exports = {
//     Stock
// }

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },   // Name of the stock
  symbol: { type: String, required: true, unique: true },  // Symbol of the stock
  price: { type: Number, required: true },  // Price of the stock
  lastUpdated: { type: Date, default: Date.now }  // When the price was last updated
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;