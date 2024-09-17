const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/save-points', (req, res) => {
  const points = req.body;
  const filePath = path.join(__dirname, 'points.json');

  fs.writeFile(filePath, JSON.stringify(points, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Error saving points');
    }
    res.send('Points saved successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
