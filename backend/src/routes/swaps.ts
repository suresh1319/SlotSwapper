import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, AuthRequest } from '../middleware/auth';
import Event, { EventStatus } from '../models/Event';
import SwapRequest, { SwapStatus } from '../models/SwapRequest';
import mongoose from 'mongoose';

const router = express.Router();

// Get swappable slots from other users
router.get('/swappable-slots', auth, async (req: AuthRequest, res: Response) => {
  try {
    const swappableSlots = await Event.find({
      status: EventStatus.SWAPPABLE,
      userId: { $ne: req.userId }
    }).populate('userId', 'name email').sort({ startTime: 1 });

    res.json(swappableSlots);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create swap request
router.post('/swap-request', auth, [
  body('mySlotId').isMongoId().withMessage('Valid slot ID is required'),
  body('theirSlotId').isMongoId().withMessage('Valid target slot ID is required')
], async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      return res.status(400).json({ errors: errors.array() });
    }

    const { mySlotId, theirSlotId } = req.body;

    // Verify both slots exist and are swappable
    const [mySlot, theirSlot] = await Promise.all([
      Event.findOne({ _id: mySlotId, userId: req.userId }).session(session),
      Event.findById(theirSlotId).session(session)
    ]);

    if (!mySlot || mySlot.status !== EventStatus.SWAPPABLE) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Your slot is not available for swapping' });
    }

    if (!theirSlot || theirSlot.status !== EventStatus.SWAPPABLE) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Target slot is not available for swapping' });
    }

    if (theirSlot.userId.toString() === req.userId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot swap with your own slot' });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      $or: [
        { requesterSlotId: mySlotId, status: SwapStatus.PENDING },
        { targetSlotId: mySlotId, status: SwapStatus.PENDING },
        { requesterSlotId: theirSlotId, status: SwapStatus.PENDING },
        { targetSlotId: theirSlotId, status: SwapStatus.PENDING }
      ]
    }).session(session);

    if (existingRequest) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'One of the slots already has a pending swap request' });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterUserId: req.userId,
      targetUserId: theirSlot.userId,
      requesterSlotId: mySlotId,
      targetSlotId: theirSlotId
    });

    // Update slot statuses to SWAP_PENDING
    await Promise.all([
      Event.findByIdAndUpdate(mySlotId, { status: EventStatus.SWAP_PENDING }).session(session),
      Event.findByIdAndUpdate(theirSlotId, { status: EventStatus.SWAP_PENDING }).session(session),
      swapRequest.save({ session })
    ]);

    await session.commitTransaction();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requesterUserId', 'name email')
      .populate('targetUserId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId');

    res.status(201).json(populatedRequest);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Server error' });
  } finally {
    session.endSession();
  }
});

// Respond to swap request
router.post('/swap-response/:requestId', auth, [
  body('accept').isBoolean().withMessage('Accept field must be boolean')
], async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      return res.status(400).json({ errors: errors.array() });
    }

    const { accept } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.requestId).session(session);

    if (!swapRequest) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Swap request not found' });
    }

    if (swapRequest.targetUserId.toString() !== req.userId) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    if (swapRequest.status !== SwapStatus.PENDING) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Swap request is no longer pending' });
    }

    if (accept) {
      // Accept the swap - exchange slot ownership
      const [requesterSlot, targetSlot] = await Promise.all([
        Event.findById(swapRequest.requesterSlotId).session(session),
        Event.findById(swapRequest.targetSlotId).session(session)
      ]);

      if (!requesterSlot || !targetSlot) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'One or both slots no longer exist' });
      }

      // Swap the ownership
      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requesterSlotId, {
          userId: swapRequest.targetUserId,
          status: EventStatus.BUSY
        }).session(session),
        Event.findByIdAndUpdate(swapRequest.targetSlotId, {
          userId: swapRequest.requesterUserId,
          status: EventStatus.BUSY
        }).session(session)
      ]);

      swapRequest.status = SwapStatus.ACCEPTED;
    } else {
      // Reject the swap - revert slots to SWAPPABLE
      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requesterSlotId, { status: EventStatus.SWAPPABLE }).session(session),
        Event.findByIdAndUpdate(swapRequest.targetSlotId, { status: EventStatus.SWAPPABLE }).session(session)
      ]);

      swapRequest.status = SwapStatus.REJECTED;
    }

    swapRequest.respondedAt = new Date();
    await swapRequest.save({ session });

    await session.commitTransaction();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requesterUserId', 'name email')
      .populate('targetUserId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId');

    res.json(populatedRequest);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Server error' });
  } finally {
    session.endSession();
  }
});

// Get incoming swap requests
router.get('/incoming', auth, async (req: AuthRequest, res: Response) => {
  try {
    const incomingRequests = await SwapRequest.find({
      targetUserId: req.userId
    })
      .populate('requesterUserId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId')
      .sort({ createdAt: -1 });

    res.json(incomingRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get outgoing swap requests
router.get('/outgoing', auth, async (req: AuthRequest, res: Response) => {
  try {
    const outgoingRequests = await SwapRequest.find({
      requesterUserId: req.userId
    })
      .populate('targetUserId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId')
      .sort({ createdAt: -1 });

    res.json(outgoingRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;