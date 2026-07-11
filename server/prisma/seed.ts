import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@powerofgrace.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        profile: {
          create: {
            firstName: 'POG',
            lastName: 'Admin'
          }
        }
      }
    });
    console.log('✅ Admin user created: admin@powerofgrace.com / admin123');
  }

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.employee.deleteMany();

  // Seed Bookings
  await prisma.booking.createMany({
    data: [
      { client: 'Adewale & Chisom Johnson', event: 'Wedding Reception', date: new Date('2026-12-15T00:00:00Z'), location: 'Eko Hotel, Lagos', budget: '1200000', status: 'CONFIRMED', assignedTo: 'The Groove Ensemble' },
      { client: 'TechCorp Nigeria Ltd.', event: 'Corporate Gala', date: new Date('2026-12-18T00:00:00Z'), location: 'Transcorp Hilton, Abuja', budget: '850000', status: 'PENDING', assignedTo: 'Unassigned' },
      { client: 'Lagos Fashion Week', event: 'Fashion Show', date: new Date('2026-11-22T00:00:00Z'), location: 'Federal Palace Hotel', budget: '600000', status: 'CONFIRMED', assignedTo: 'POG Core Band' },
      { client: 'Sterling Bank Plc', event: 'End of Year Party', date: new Date('2026-12-20T00:00:00Z'), location: 'Balmoral Hall, Lagos', budget: '950000', status: 'CANCELLED', assignedTo: 'N/A' },
      { client: 'Dangote Group', event: 'Investor Dinner', date: new Date('2027-01-10T00:00:00Z'), location: 'Radisson Blu, Lagos', budget: '1500000', status: 'PENDING', assignedTo: 'Unassigned' }
    ]
  });
  console.log('✅ Bookings seeded');

  // Seed Events
  await prisma.event.createMany({
    data: [
      { title: 'Johnson Wedding Reception', date: new Date('2026-12-15T00:00:00Z'), time: '18:00', venue: 'Eko Hotel, Lagos', type: 'Wedding', staff: 6, color: '#7f1d1d' },
      { title: 'TechCorp Annual Gala', date: new Date('2026-12-18T00:00:00Z'), time: '19:00', venue: 'Transcorp Hilton, Abuja', type: 'Corporate', staff: 8, color: '#d97706' },
      { title: 'Lagos Fashion Week After-Party', date: new Date('2026-11-22T00:00:00Z'), time: '21:00', venue: 'Federal Palace Hotel', type: 'Fashion', staff: 4, color: '#1d4ed8' }
    ]
  });
  console.log('✅ Events seeded');

  // Seed Employees
  await prisma.employee.createMany({
    data: [
      { name: 'Chukwu Emmanuel', role: 'Lead Drummer', department: 'Rhythm Section', phone: '+234 801 234 5678', email: 'emmanuel@pog.ng', available: true, events: 24, rating: 4.9, avatar: 'CE', joinDate: 'Jan 2021' },
      { name: 'Adaeze Okonkwo', role: 'Lead Vocalist', department: 'Vocals', phone: '+234 802 345 6789', email: 'adaeze@pog.ng', available: true, events: 31, rating: 5.0, avatar: 'AO', joinDate: 'Mar 2020' },
      { name: 'Tunde Fashola', role: 'Bassist', department: 'Rhythm Section', phone: '+234 803 456 7890', email: 'tunde@pog.ng', available: false, events: 19, rating: 4.7, avatar: 'TF', joinDate: 'Jun 2022' },
      { name: 'Ngozi Eze', role: 'Keyboard Player', department: 'Melody', phone: '+234 804 567 8901', email: 'ngozi@pog.ng', available: true, events: 22, rating: 4.8, avatar: 'NE', joinDate: 'Feb 2021' }
    ]
  });
  console.log('✅ Employees seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
