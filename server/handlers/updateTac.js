import Tac from "../models/Tac.js";

const updateTac = async (req, res) => {
    try {
        const { 
            tacUid,
            action,
            remarks,
         } = req.body;

        console.log(req.body);

        let tac = await Tac.findById(tacUid);
        if (!tac) {
            return res.status(404).json({ message: "Tac not found!" });
        }

        if (action === "approve") {

            const approvedTacsCount = await Tac.countDocuments({ status: "approved" });

            tac.tacID = `TAC-${approvedTacsCount + 1}`;
            tac.status = "approved";
            tac.approvedDate = new Date();
            
        } else if (action === "reject") {
            tac.status = "rejected";
            tac.remarks = remarks;

        } else {
            return res.status(400).json({ message: "Invalid action!" });
        }

        await tac.save();

        res.status(200).json({ message: "Tac updated successfully!" });

        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

export default updateTac;