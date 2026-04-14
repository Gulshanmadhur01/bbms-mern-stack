import Contact from "../models/contactModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).send({
                success: false,
                message: "Please fill in all mandatory fields (Name, Email, Message)."
            });
        }

        const newMessage = new Contact({ name, email, phone, message });
        await newMessage.save();

        res.status(201).send({
            success: true,
            message: "Your message has been received. We will get back to you shortly."
        });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).send({
            success: false,
            message: "Error processesing your message. Please try again later.",
            error: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching messages",
            error: error.message
        });
    }
};
