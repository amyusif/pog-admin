import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const activeBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
    
    // Calculate total revenue (naive sum of budgets)
    const bookings = await prisma.booking.findMany({ select: { budget: true, date: true } });
    const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);

    const totalClients = new Set(bookings.map(b => b.budget)).size; // simplified

    res.json({
      totalRevenue,
      activeBookings,
      totalClients: totalBookings, // approx
      bookingsData: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
