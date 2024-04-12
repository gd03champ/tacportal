import Tac from "../models/Tac.js";
import User from "../models/User.js";

const getAnalytics = async (req, res) => {
    try {
        const totalTacs = await Tac.countDocuments();
        const totalSoftwareTacs = await Tac.countDocuments({ domain: "software" });
        const totalHardwareTacs = await Tac.countDocuments({ domain: "hardware" });
        const totalApprovedTacs = await Tac.countDocuments({ status: "approved" });
        const totalRejectedTacs = await Tac.countDocuments({ status: "rejected" });
        const totalPendingTacs = await Tac.countDocuments({ status: "initiated" });

        const totalTacAppliedDayBefore = await Tac.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)), $lt: new Date(new Date().setDate(new Date().getDate() - 1)) }});
        const totalTacAppliedYesterday = await Tac.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)), $lt: new Date() } });
        const totalTacAppliedToday = await Tac.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate())), $lt: new Date() } });

        const totalUsers = await User.countDocuments();
        const totalAppointments = await Tac.countDocuments({ isAppointmentBooked: true });
        const totalEarlyAppointments = await Tac.countDocuments({ isEarlyAppointment: true });

        res.status(200).json({
            totalTacs,
            totalSoftwareTacs,
            totalHardwareTacs,
            totalApprovedTacs,
            totalRejectedTacs,
            totalPendingTacs,
            totalUsers,
            totalAppointments,
            totalEarlyAppointments,
            totalTacAppliedDayBefore,
            totalTacAppliedYesterday,
            totalTacAppliedToday
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

export default getAnalytics;