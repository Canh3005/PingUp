import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');
        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((total, booking) => total + booking.amount, 0),
            activeShows: activeShows.length,
            totalUsers: totalUser
        };
        return res.status(200).json(dashboardData);
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ message: "Error fetching dashboard data" });
    }
}
