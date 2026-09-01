const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyAuth } = require('../middleware/auth');

router.use(verifyAuth);

router.post('/', async (req, res) => {
  try {
    const user = req.user;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment,
        userId: user.id
      }
    });

    return res.json({ success: true, feedback });
  } catch (error) {
    console.error('Feedback POST Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            mobile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Feedback GET Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
