import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', express.static(path.join(__dirname, '../public')));

router.get('/api', (req, res) => {
  res.status(200).send('API WORKING');
});

export default router;
