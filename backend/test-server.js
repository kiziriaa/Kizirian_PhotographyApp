const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test server running');
});

app.post('/api/verify-phone', (req, res) => {
  res.json({ message: 'Phone verification endpoint working', phone: req.body.phone });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});