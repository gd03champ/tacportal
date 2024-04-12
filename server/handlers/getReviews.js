import Tac from "../models/Tac.js";

const getReviews = async (req, res) => {
    try {

        //get all the tacs whose appointmentDate is today and in the future
        let tacs = await Tac.find({ appointmentDate: { $gte: new Date() } });
        if (!tacs) {
            return res.status(404).json({ message: "No tacs found!" });
        }

        res.status(200).json(tacs);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

export default getReviews;
