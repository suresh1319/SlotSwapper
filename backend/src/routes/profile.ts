import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { auth, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get user profile
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('currentPassword').optional().isLength({ min: 1 }).withMessage('Current password is required'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;