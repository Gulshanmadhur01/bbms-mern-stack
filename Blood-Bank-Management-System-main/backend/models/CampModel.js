import mongoose from "mongoose";

const campSchema = new mongoose.Schema({

    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        address: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            trim: true
        }
    },
    orgType: {
        type: String,
        enum: ["College", "NGO", "Hospital", "Corporate", "Religious", "Other"],
        default: "Other"
    },
    orgName: String,
    organizerName: String,
    organizerPhone: String,
    organizerEmail: String,
    startTime: {
        type: String,
        default: "09:00"
    },
    endTime: {
        type: String,
        default: "17:00"
    },
    estimatedParticipants: {
        type: Number,
        default: 0
    },
    remarks: String,
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    enddate: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    registeredDonors: [
        {
            donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            registeredAt: { type: Date, default: Date.now }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "upcoming", "completed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true }

);
campSchema.pre("save", function (next) {
    if (this.date && !this.enddate) {
        const expiration = new Date(this.collectionDate);
        expiration.setDate(expiration.getDate() + 42);
        this.expirationDate = expiration;
    }
    next();
});

export default mongoose.model("Camp", campSchema);
