import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, role, department, phone, email, available, avatar, joinDate } = req.body;
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        role,
        department,
        phone,
        email,
        available: available ?? true,
        avatar,
        joinDate
      }
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id } });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
