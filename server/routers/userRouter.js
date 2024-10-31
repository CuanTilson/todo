import { pool } from '../helper/db.js';
import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const router = Router();

const invalid_message = 'Invalid credentials';

// Register route
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
        if (existingUser.rowCount > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert the new user
        const result = await pool.query(
            'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Respond with the newly created user's ID and email
        res.status(201).json({
            id: result.rows[0].id,
            email: result.rows[0].email
        });
    } catch (error) {
        console.error("Registration error:", error);
        next(error); // Pass any errors to the error handling middleware
    }
});

// Login route
router.post('/login', (req, res, next) => {
    try {
        // Query the user based on the email
        pool.query(
            'SELECT * FROM account WHERE email = $1',
            [req.body.email],
            (error, result) => {
                if (error) return next(error);  // Database error handling

                // Check if no user was found with the provided email
                if (result.rowCount === 0) return next(new Error(invalid_message));

                // Compare the password provided with the stored hashed password
                compare(req.body.password, result.rows[0].password, (error, match) => {
                    if (error) return next(error);

                    if (!match) return next(new Error(invalid_message)); // Incorrect password

                    // Generate a JWT token if the credentials are valid
                    const token = sign({ user: req.body.email }, process.env.JWT_SECRET);
                    const user = result.rows[0];

                    // Respond with the user ID, email, and token
                    return res.status(200).json({
                        id: user.id,
                        email: user.email,
                        token: token
                    });
                });
            }
        );
    } catch (error) {
        return next(error);  // General server error handling
    }
});

export { router as userRouter };