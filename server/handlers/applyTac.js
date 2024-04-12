import Tac from "../models/Tac.js";

const applyTac = async (req, res) => {

    try {

        //Sconsole.log("Request body: ", req.body)
        //req.body.students.forEach(student => {console.log(student)});

        const {
            title,
            description,
            domain,
            students,       // array of objects
            documentLink,    // will be uploaded to frontend and link will be passed
        } = req.body;

        //appliedDate = today

        const tac = new Tac({
            title,
            description,
            domain,
            studentsCount: students.length,
            students,
            documentLink,
            appliedDate: new Date(),
        });


        await tac.save();
        res.status(201).json({ message: "Tac applied successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: "+err.message });
    }


}

export default applyTac;