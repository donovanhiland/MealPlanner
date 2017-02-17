const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/googlede23b79ac9d8f481.html', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'app', 'assets', 'googlede23b79ac9d8f481.html'));
});

router.get('/api', (req, res) => {
  res.status(200).send('API WORKS');
});

module.exports = router;
