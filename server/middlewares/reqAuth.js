import BlackToken from "../models/BlackToken.js";
import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, 'mySecretKey', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
  
      //check if token is black listed
      const blackToken = await BlackToken.findOne({ token }).exec();
      if (blackToken) return res.status(401).json({ message: 'Token expired' });
  
      req.user = decoded;
      //console.log("Decoded user data from middleware: "+ await req.user);
      next();
    });

    // const token = req.headers.authorization.split(' ')[1];
  };

export default requireAuth;