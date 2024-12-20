import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';
import Profile from '../models/Profile.js';
import Remark from '../models/Remark.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
async function resetDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Drop only Profile and Remark tables, preserving User table
    await Profile.drop();
    await Remark.drop();
    console.log('Profile and Remark tables dropped.');

    // Recreate only the dropped tables
    await Profile.sync();
    await Remark.sync();
    console.log('Profile and Remark tables recreated.');

  } catch (error) {
    console.error('Unable to reset database:', error);
  } finally {
    await sequelize.close();
  }
}

resetDb();
