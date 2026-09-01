const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyAuth } = require('../middleware/auth');

router.use(verifyAuth);

router.get('/', async (req, res) => {
  try {
    const user = req.user;
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications GET Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/', async (req, res) => {
  try {
    const user = req.user;
    const { id, all } = req.body;

    if (all) {
      await prisma.notification.updateMany({
        where: { userId: user.id },
        data: { read: true }
      });
    } else if (id) {
      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification || notification.userId !== user.id) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Notifications PUT Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
