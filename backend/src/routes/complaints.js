const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyAuth } = require('../middleware/auth');

router.use(verifyAuth);

router.get('/', async (req, res) => {
  try {
    const user = req.user;
    const complaints = await prisma.complaint.findMany({
      where: user.role === 'admin' ? {} : { userId: user.id },
      include: { user: { select: { name: true, email: true, mobile: true, ward: true, city: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, complaints });
  } catch (e) {
    console.error('Complaints GET Error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = req.user;
    const { category, details, photoUrl, latitude, longitude, locationName, durationDays, wasteType, wasteVolume, severity, aiSummary } = req.body;
    if (!category || !details) return res.status(400).json({ error: 'Category and details are required' });

    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        category,
        details,
        photoUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        locationName: locationName || 'Live GPS Coordinates',
        durationDays: durationDays || 'Today',
        wasteType: wasteType || null,
        wasteVolume: wasteVolume || null,
        severity: severity || 'Medium',
        aiSummary: aiSummary || null,
        status: 'Pending',
        userId: user.id
      }
    });

    const newCredits = (user.credits || 0) + 50;
    const newReports = (user.verifiedReportsCount || 0) + 1;
    const newRank = newCredits >= 1000 ? 'Platinum Legend' : (newCredits >= 500 ? 'Gold Champion' : (newCredits >= 250 ? 'Green Guardian' : 'Civic Scout'));

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: newCredits, verifiedReportsCount: newReports, rankTitle: newRank }
    });

    await prisma.notification.create({
      data: {
        title: `Ticket Raised: #${ticketNumber} (+50 Credits)`,
        message: `Your report for "${category}" is registered. You earned +50 Swachh Credits! Total: ${newCredits} (${newRank}).`,
        userId: user.id
      }
    });

    return res.json({
      success: true,
      complaint,
      gamification: { creditsEarned: 50, totalCredits: newCredits, rankTitle: newRank }
    });
  } catch (e) {
    console.error('Complaints POST Error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
    const { status } = req.body;
    if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id: req.params.id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status }
    });

    await prisma.notification.create({
      data: {
        title: `Issue Status Update: ${status}`,
        message: `Your ticket for "${complaint.category}" is now marked as "${status}". ${status === 'Resolved' ? 'Please share your feedback on the View Status page.' : ''}`,
        userId: complaint.userId
      }
    });

    return res.json({ success: true, complaint: updatedComplaint });
  } catch (e) {
    console.error('Complaint Status Update Error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
});

router.post('/:id/feedback', async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to review this complaint' });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { rating: parseInt(rating), comment: comment || '' }
    });

    return res.json({ success: true, complaint: updatedComplaint });
  } catch (e) {
    console.error('Complaint Feedback Error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
});

module.exports = router;
