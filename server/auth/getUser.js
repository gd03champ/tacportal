import User from '../models/User.js';

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // Do something with the user object
        res.status(200).json(user);
    } catch (error) {
        // Handle error
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
    
export default getUser;