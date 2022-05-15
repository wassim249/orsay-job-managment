const express = require('express');
const app = express();
require('dotenv').config();
const authRouter = require('./routes/auth');
const scanRouter = require('./routes/scan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/scan', scanRouter);


const PORT = process.env.PORT || 5000;

// run server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    }
);