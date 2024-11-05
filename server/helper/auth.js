import jwt from 'jsonwebtoken';
const { verify } = jwt;
const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({ message: authorizationRequired });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part after "Bearer "
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (err) {
        res.statusMessage = invalidCredentials;
        return res.status(403).json({ message: invalidCredentials });
    }
};

export { auth };
