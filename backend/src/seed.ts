import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './modules/auth/user.model';
import { Lead } from './modules/leads/lead.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_leads';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️ Cleared existing users and leads.');

    // Create Users
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const salesPassword = await bcrypt.hash('sales123', salt);

    const admin = await User.create({
      name: 'Admin Sharma',
      email: 'admin@smartleads.com',
      passwordHash: adminPassword,
      role: 'Admin',
    });

    const salesUser = await User.create({
      name: 'Rahul Verma (Sales)',
      email: 'rahul@smartleads.com',
      passwordHash: salesPassword,
      role: 'Sales User',
    });

    console.log('👥 Created Admin (admin@smartleads.com / admin123) & Sales User (rahul@smartleads.com / sales123)');

    // Create Mock Leads
    const mockLeads = [
      {
        name: 'Aarav Mehta',
        email: 'aarav@techcorp.in',
        status: 'New',
        source: 'Website',
        createdBy: admin._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@designstudio.com',
        status: 'Qualified',
        source: 'Instagram',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan@guptasolutions.com',
        status: 'Contacted',
        source: 'Referral',
        createdBy: admin._id,
        assignedTo: admin._id,
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@iyerassociates.in',
        status: 'Lost',
        source: 'Website',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram@malhotragroup.com',
        status: 'Qualified',
        source: 'Instagram',
        createdBy: admin._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Sneha Joshi',
        email: 'sneha.j@innovatech.io',
        status: 'New',
        source: 'Referral',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Karan Patel',
        email: 'karan@patellogistics.com',
        status: 'Contacted',
        source: 'Website',
        createdBy: admin._id,
        assignedTo: admin._id,
      },
      {
        name: 'Neha Sharma',
        email: 'neha@sharmaretail.in',
        status: 'Qualified',
        source: 'Instagram',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Amit Deshmukh',
        email: 'amit@deshmukhinfra.com',
        status: 'New',
        source: 'Referral',
        createdBy: admin._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Divya Singh',
        email: 'divya@singhconsulting.com',
        status: 'Lost',
        source: 'Website',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
      {
        name: 'Rajesh Khanna',
        email: 'rajesh@khannafoods.com',
        status: 'Contacted',
        source: 'Instagram',
        createdBy: admin._id,
        assignedTo: admin._id,
      },
      {
        name: 'Pooja Hegde',
        email: 'pooja@hegdeventures.in',
        status: 'Qualified',
        source: 'Referral',
        createdBy: salesUser._id,
        assignedTo: salesUser._id,
      },
    ];

    await Lead.insertMany(mockLeads);
    console.log(`✅ Successfully seeded ${mockLeads.length} leads.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
