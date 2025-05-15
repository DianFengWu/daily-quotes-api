const express = require('express');
const dotenv = require('dotenv');
const quotesRouter = require('./routes/quotes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/quotes', quotesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
