import Tac from "../models/Tac.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

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

        // Create notification for all students in the TAC
        // First, find their user IDs based on their roll numbers
        for (const student of tac.students) {
            try {
                // Find the user by roll number
                const user = await User.findOne({ rollno: student.rollNumber });
                
                if (user) {
                    // Create notification
                    const notification = new Notification({
                        userId: user._id,
                        title: action === "approve" ? "TAC Application Approved" : "TAC Application Rejected",
                        message: action === "approve" 
                            ? `Your TAC application "${tac.title}" has been approved. TAC ID: ${tac.tacID}`
                            : `Your TAC application "${tac.title}" has been rejected. Reason: ${remarks}`,
                        type: action === "approve" ? "success" : "error",
                        relatedId: tac._id,
                    });
                    
                    await notification.save();
                }
            } catch (notifError) {
                console.error("Error creating notification:", notifError);
                // We don't want to fail the whole request if notification creation fails
                // So we just log the error and continue
            }
        }

        res.status(200).json({ message: "Tac updated successfully!" });

        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

export default updateTac;
