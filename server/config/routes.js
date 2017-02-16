const express = require('express');

const router = express.Router();

// router.get('/', (req, res) => {
//
// });

router.get('/api', (req, res) => {
  res.status(200).send('API WORKS');
});

module.exports = router;
