import jwt from 'jsonwebtoken';

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    // Check if the authorization header is present
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({ message: authorizationRequired });
    } else {
        try {
            // Extract the token from the header
            const token = req.headers.authorization.split(' ')[1]; // Split to get the token part
            // Verify the token using the JWT secret key
            jwt.verify(token, process.env.JWT_SECRET);
            next(); // Token is valid, proceed to the next middleware or route handler
        } catch (err) {
            // Token verification failed
            res.statusMessage = invalidCredentials;
            return res.status(403).json({ message: invalidCredentials });
        }
    }
};

export { auth };
