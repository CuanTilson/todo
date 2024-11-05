import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken as a default import

const __dirname = path.resolve(); // Adjusted to get the current directory for ESM modules

// Initialize the test database
const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../todo.sql'), 'utf-8');
    await pool.query(sql); // Await the query to ensure it completes
    console.log('Test database initialized successfully.');
};

// Insert a test user with a hashed password
const insertTestUser = async (email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password
        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log(`Test user ${email} inserted successfully.`);
    } catch (error) {
        console.error('Error inserting test user:', error);
    }
};

const getToken = (email) => {
    return jwt.sign({ user: email }, process.env.JWT_SECRET_KEY);
}

export { initializeTestDb, insertTestUser, getToken };