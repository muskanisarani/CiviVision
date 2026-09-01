const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyAuth } = require('../middleware/auth');

router.use(verifyAuth);

router.put('/', async (req, res) => {
  try {
    const user = req.user;
    const { name, mobile, ward, language, avatarType, avatarBadge, avatarUrl } = req.body;

    if (mobile && mobile !== user.mobile) {
      const existingMobile = await prisma.user.findFirst({
        where: {
          mobile,
          id: { not: user.id }
        }
      });
      if (existingMobile) {
        return res.status(400).json({ error: 'Mobile number is already registered' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        mobile: mobile !== undefined ? mobile : user.mobile,
        ward: ward !== undefined ? ward : user.ward,
        language: language !== undefined ? language : user.language,
        avatarType: avatarType !== undefined ? avatarType : user.avatarType,
        avatarBadge: avatarBadge !== undefined ? avatarBadge : user.avatarBadge,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl
      }
    });

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        city: updatedUser.city,
        state: updatedUser.state,
        ward: updatedUser.ward,
        role: updatedUser.role,
        avatarType: updatedUser.avatarType,
        avatarBadge: updatedUser.avatarBadge,
        avatarUrl: updatedUser.avatarUrl,
        language: updatedUser.language
      }
    });
  } catch (error) {
    console.error('Profile PUT Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
