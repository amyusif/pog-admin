import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const parsePrice = (val?: string | null): number => {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const activeBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
    
    // Calculate total revenue from approved (CONFIRMED / COMPLETED) bookings
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      select: {
        quotedPrice: true,
        clientBudget: true,
        budget: true,
        date: true
      }
    });

    const totalRevenue = confirmedBookings.reduce((acc, curr) => {
      const amount = parsePrice(curr.quotedPrice) || parsePrice(curr.clientBudget) || parsePrice(curr.budget);
      return acc + amount;
    }, 0);

    res.json({
      totalRevenue,
      activeBookings,
      totalClients: totalBookings,
      bookingsData: confirmedBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
