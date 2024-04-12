import Tac from "../models/Tac.js";

const bookAppointment = async (req, res) => {
    try {
        const { 
            tacUid,
            appointmentDate,
            isEarlyAppointment
         } = req.body;

        console.log(req.body);

        let tac = await Tac.findById(tacUid);
        if (!tac) {
            return res.status(404).json({ message: "Tac not found!" });
        }

        tac.isAppointmentBooked = true;
        tac.appointmentDate = appointmentDate;
        tac.isEarlyAppointment = isEarlyAppointment;

        await tac.save();

        res.status(200).json({ message: "Appointment booked successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

export default bookAppointment;