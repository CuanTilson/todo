import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const { sign } = jwt;
const __dirname = path.resolve(); // Get the current directory

// Function to initialize the test database
const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, 'todo.sql'), 'utf8');
    try {
        await pool.query(sql);
        console.log('Test database initialized successfully.');
    } catch (error) {
        console.error('Error initializing the test database:', error);
    }
};

// Function to insert a test user with hashed password
const insertTestUser = async (email, password) => {
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            hash(password, 10, (error, hashedPassword) => {
                if (error) reject(error);
                else resolve(hashedPassword);
            });
        });
        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log(`Test user ${email} inserted successfully.`);
    } catch (error) {
        console.error('Error inserting test user:', error);
    }
};

// Function to generate a token for a given email
const getToken = (email) => {
    return sign({ user: email }, process.env.JWT_SECRET);
};

export { initializeTestDb, insertTestUser, getToken };