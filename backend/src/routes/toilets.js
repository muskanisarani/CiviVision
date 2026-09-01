const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  try {
    const toilets = await prisma.toilet.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json({ success: true, toilets });
  } catch (error) {
    console.error('Toilets GET Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
