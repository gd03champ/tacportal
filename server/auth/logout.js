import BlackToken from "../models/BlackToken.js";

const logout = async (req, res) => {
  
    const token = req.headers.authorization.split(' ')[1];

    const blacklistedToken = await BlackToken.findOne({ token });
    if (!blacklistedToken) {
  
    const blackToken = new BlackToken({ token });
    //await blackToken.save(); //will uncommend when in production
  } else { console.log("token already black listed") }

  res.status(200).json({ message: 'You have been successfully logged out.' });

}

export default logout;