import User from "../models/user";
import queryString from "query-string";

// let queryString;
// import('query-string').then((qs) => {
//   queryString = qs;
// });

// import stripe from "stripe";

export const makeTutor = async (req, res) => {
  try {
    // 1. find user from db
    //  *************************************************************
    // const user = await User.findById(req.user._id).exec();
    const user = await User.findById(req.auth._id).exec();
    console.log("This is the Tutor USER => ", user);
    
    // 2. if user dont have stripe_account_id yet, then create new
    if (!user.stripe_account_id) {
      // const account = await stripe.accounts.create({ type: "express" });
      // console.log('ACCOUNT => ', account.id)
      // user.stripe_account_id = account.id;
      const account = 5
      user.stripe_account_id = account;
      user.save();
    }
    // 3. create account link based on account id (for frontend to complete onboarding)
    // let accountLink = await stripe.accountLinks.create({
    //   account: user.stripe_account_id,
    //   refresh_url: process.env.STRIPE_REDIRECT_URL,
    //   return_url: process.env.STRIPE_REDIRECT_URL,
    //   type: "account_onboarding",
    // });
    //   console.log(accountLink)
    // 4. pre-fill any info such as email (optional), then send url resposne to frontend
    // accountLink = Object.assign(accountLink, {
    //   "stripe_user[email]": user.email,
    // });
    // 5. then send the account link as response to frontend
    // res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    res.send(`${queryString.stringify(user.email)}`);
  } catch (err) {
    console.log("MAKE TUTOR ERR ", err);
  }
};
