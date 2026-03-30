const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const { default: categoryRouter } = require('./routes/categoryRouter.js');
const { default: productRouter } = require('./routes/productRouter.js');
import authRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors());

app.get("/", (req, res) => res.send("API is running "));
app.use("/api/auth", authRoutes);
app.use('/api/categories', categoryRouter); 
app.use('/api/products', productRouter); 

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
