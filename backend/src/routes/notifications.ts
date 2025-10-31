import express, { Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import SwapRequest from '../models/SwapRequest';

const router = express.Router();

// Get notification count
router.get('/count', auth, async (req: AuthRequest, res: Response) => {
  try {
    const pendingCount = await SwapRequest.countDocuments({
      targetUserId: req.userId,
      status: 'PENDING'
    });

    res.json({ count: pendingCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent notifications
router.get('/recent', auth, async (req: AuthRequest, res: Response) => {
  try {
    const recentRequests = await SwapRequest.find({
      $or: [
        { targetUserId: req.userId },
        { requesterUserId: req.userId }
      ]
    })
    .populate('requesterUserId', 'name')
    .populate('targetUserId', 'name')
    .populate('requesterSlotId', 'title startTime')
    .populate('targetSlotId', 'title startTime')
    .sort({ createdAt: -1 })
    .limit(10);

    const notifications = recentRequests.map(request => {
      const requesterUser = request.requesterUserId as any;
      const targetUser = request.targetUserId as any;
      const requesterSlot = request.requesterSlotId as any;
      const targetSlot = request.targetSlotId as any;
      
      return {
        id: request._id,
        type: targetUser._id.toString() === req.userId ? 'incoming' : 'outgoing',
        status: request.status,
        message: targetUser._id.toString() === req.userId 
          ? `${requesterUser.name} wants to swap "${requesterSlot.title}" for your "${targetSlot.title}"`
          : `Your swap request for "${targetSlot.title}" is ${request.status.toLowerCase()}`,
        createdAt: request.createdAt,
        isRead: request.status !== 'PENDING'
      };
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;