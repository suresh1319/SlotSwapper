import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, AuthRequest } from '../middleware/auth';
import Event, { EventStatus } from '../models/Event';

const router = express.Router();

// Get user's events
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ userId: req.userId }).sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new event
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, startTime, endTime } = req.body;

    // Validate time range
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const event = new Event({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: req.userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event status
router.patch('/:id/status', auth, [
  body('status').isIn(Object.values(EventStatus)).withMessage('Invalid status')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Prevent manual status change to SWAP_PENDING
    if (status === EventStatus.SWAP_PENDING) {
      return res.status(400).json({ error: 'Cannot manually set status to SWAP_PENDING' });
    }

    event.status = status;
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;