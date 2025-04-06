import Subscription from "../collection-models/Subscription.js";
import moment from "moment";

const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      subscription_status: "Active",
    });

    // Log current system time to verify
    const currentTime = moment();
    console.log("Current System Time: ", currentTime.format());

    for (const subscription of subscriptions) {
      // Check if the current time is after the subscription end date
      if (currentTime.isAfter(moment(subscription.end_date, "MM-DD-YYYY"))) {
        subscription.subscription_status = "Inactive";
        await subscription.save();
      }
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export default checkSubscriptionStatus;
