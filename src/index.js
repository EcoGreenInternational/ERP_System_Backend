const express = require('express');
const connectDB = require('./config/db');
const supplierRouter = require('./routes/supplierRouter.js');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/api/suppliers', supplierRouter);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));