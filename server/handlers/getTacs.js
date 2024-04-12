import Tac from "../models/Tac.js";
import User from "../models/User.js";

const getTacs = async (req, res) => {

    const user = await User.findOne({ email: req.user.email });
    if (user.role === "staff") {
        try {
            console.log("retrieving all the tacs for admin user");
            // returns all the tacs for admin 
            const tacs = await Tac.find({});
            res.status(200).json(tacs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    } else {
        const roll = user.rollno;
        //console.log(user);
        console.log("retrieving tacs for: " + user.rollno);

        try {
            // returns all tacs where student is part of
            const tacs = await Tac.find({ "students.rollNumber": roll });
            res.status(200).json(tacs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    }
}

export default getTacs;