import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST new booking
router.post('/', async (req, res) => {
  try {
    const { client, event, date, location, budget, clientBudget, bookingType, subType, customSpec, phone, email, assignedTo, time } = req.body;
    
    // Create the booking
    const newBooking = await prisma.booking.create({
      data: {
        client,
        event,
        date: new Date(date),
        location,
        budget,
        clientBudget,
        bookingType,
        subType,
        customSpec,
        phone,
        email,
        assignedTo
      }
    });

    // Also automatically create an event on the calendar
    await prisma.event.create({
      data: {
        title: `${client} (${subType || bookingType || 'Booking'})`,
        date: new Date(date),
        time: time || 'TBD',
        venue: location,
        type: event,
        staff: 0,
        color: '#f59e0b'
      }
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedTo !== undefined && { assignedTo })
      }
    });
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id } });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
