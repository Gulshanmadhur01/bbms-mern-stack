import Newsletter from "../models/newsletterModel.js";

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Please provide an email address."
            });
        }

        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            if (!existingSubscriber.active) {
                existingSubscriber.active = true;
                await existingSubscriber.save();
                return res.status(200).send({
                    success: true,
                    message: "Welcome back! You have been re-subscribed to our newsletter."
                });
            }
            return res.status(200).send({
                success: true,
                message: "You are already subscribed to our newsletter."
            });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).send({
            success: true,
            message: "Thank you for subscribing to our newsletter!"
        });
    } catch (error) {
        console.error("Newsletter error:", error);
        res.status(500).send({
            success: false,
            message: "Error subscribing to newsletter. Please try again later.",
            error: error.message
        });
    }
};

export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            subscribers
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching subscribers",
            error: error.message
        });
    }
};
