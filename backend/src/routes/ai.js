const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyAuth } = require('../middleware/auth');
const { analyzeImageBuffer, classifyCivicDefect } = require('../services/imageAuditService');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const isNear = (lat1, lon1, lat2, lon2, thresh = 0.0015) => 
  lat1 && lon1 && lat2 && lon2 && Math.abs(lat1 - lat2) < thresh && Math.abs(lon1 - lon2) < thresh;

router.post('/verify', verifyAuth, async (req, res) => {
  try {
    const { image, description, latitude, longitude, category: clientCat } = req.body;
    if (!image) return res.status(400).json({ error: 'Image is required for AI verification' });
    if (!latitude || !longitude) return res.status(400).json({ error: 'Live GPS location is required first.' });

    // Step 1: Run On-Device Computer Vision & Anti-Spoofing Audit
    const audit = analyzeImageBuffer(image);
    if (!audit.isValid) {
      return res.json({
        success: false,
        isValid: false,
        hasCivicIssue: false,
        rejectionReason: audit.rejectionReason || 'Strict AI Mode: Fake/digital screenshot or screen-replay photo detected.'
      });
    }

    let r = {
      isValid: true,
      hasCivicIssue: true,
      rejectionReason: '',
      category: clientCat || 'Garbage / Waste',
      wasteType: 'Solid municipal waste',
      wasteVolume: 'Medium dump',
      severity: 'Medium',
      priority: 'Medium',
      durationDays: 'Today',
      authenticityScore: audit.realismScore || 92,
      details: audit.antiSpoofDetails || 'Verified authentic on-site capture.'
    };
    let aiUsed = false;

    if (GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const model = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash' });
        const base64Data = image.split(',')[1] || image;
        const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';

        const prompt = `You are CiviVision Municipal AI Auditor. Analyze photo & description: "${description || ''}".
1. Authenticity: Reject (isValid = false, hasCivicIssue = false) if indoor, selfie, person, animal, vehicle, wallpaper, stock, meme, photo of computer/phone screen, or non-civic.
2. Auto-Classify (if valid):
   - category: EXACTLY one of ["Garbage / Waste", "Road Damage", "Water Issue", "Streetlights", "Drainage & Sewerage", "Public Toilet Issue"]
   - wasteType: defect subtype (e.g. Dry recyclables/Organic, Pothole/Sinkhole, Clean/Sewage water, Dead bulb/Flickering, Silt/Plastics, Dirty cabin/Dry tap)
   - wasteVolume: scale (e.g. Small pile/Medium dump/Large blockage, Low/Medium/High risk, Slow seepage/Active burst)
   - severity: "High" | "Medium" | "Low"
   - priority: "High" | "Medium" | "Low"
   - durationDaysRecommendation: "Today" | "1-2 days ago" | "3-5 days ago" | "More than a week ago"
   - authenticityScore: 0-100 integer
   - details: concise 1-sentence diagnostic
   - hasCivicIssue: boolean
   - rejectionReason: reason string if invalid.
Respond ONLY with JSON object.`;

        const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType } }]);
        const match = result.response.text().trim().match(/\{[\s\S]*\}/);
        if (match) {
          const ai = JSON.parse(match[0]);
          if (ai.isValid === false || ai.hasCivicIssue === false || (ai.authenticityScore !== undefined && ai.authenticityScore < 60)) {
            r.isValid = false;
            r.hasCivicIssue = false;
            r.rejectionReason = ai.rejectionReason || 'Strict AI Mode: Photo rejected (low civic defect confidence or stock/non-civic image detected).';
          } else {
            r.isValid = true;
            r.hasCivicIssue = true;
            if (ai.category) r.category = ai.category;
            if (ai.wasteType) r.wasteType = ai.wasteType;
            if (ai.wasteVolume) r.wasteVolume = ai.wasteVolume;
            if (ai.severity) r.severity = ai.severity;
            if (ai.priority) r.priority = ai.priority;
            if (ai.durationDaysRecommendation) r.durationDays = ai.durationDaysRecommendation;
            if (ai.authenticityScore !== undefined) r.authenticityScore = Math.max(r.authenticityScore, ai.authenticityScore);
            if (ai.details) r.details = ai.details;
          }
          aiUsed = true;
        }
      } catch (err) {
        console.warn('Gemini vision note:', err.message);
      }
    }

    if (!aiUsed) {
      const classified = classifyCivicDefect(description, '', audit);
      r = {
        ...r,
        ...classified,
        authenticityScore: audit.realismScore
      };
    }

    if (!r.isValid || !r.hasCivicIssue) {
      return res.json({
        success: false,
        isValid: false,
        hasCivicIssue: false,
        rejectionReason: r.rejectionReason || 'Image rejected by AI verification.'
      });
    }

    // Spatial Deduplication Check (150m)
    const existing = await prisma.complaint.findMany({
      where: { status: { in: ['Pending', 'In Progress'] } },
      select: { id: true, category: true, latitude: true, longitude: true, ticketNumber: true }
    });
    const duplicate = existing.find(c => c.category === r.category && isNear(latitude, longitude, c.latitude, c.longitude, 0.0015));

    return res.json({
      success: true,
      isValid: true,
      hasCivicIssue: true,
      authenticityScore: r.authenticityScore,
      authenticityMessage: `Verified Authentic: Real on-site capture (${r.authenticityScore}% AI Confidence)`,
      isDuplicate: !!duplicate,
      duplicateMessage: duplicate ? `Potential match: Similar ${r.category} ticket #${duplicate.ticketNumber || duplicate.id.slice(0, 6)} nearby.` : 'Unique incident: No duplicate reports found in this sector.',
      aiDetails: r
    });
  } catch (error) {
    console.error('AI Verify Route Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during verification' });
  }
});

module.exports = router;
