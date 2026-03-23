const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { default: Category } = require('./models/Category.js');
const { default: categoryRouter } = require('./routes/categoryRouter.js');
const { default: productRouter } = require('./routes/productRouter.js');
require('dotenv').config();

const app = express();
connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/categories', categoryRouter); 
app.use('/api/products', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));