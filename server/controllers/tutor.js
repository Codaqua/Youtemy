import User from "../models/user";
import Course from "../models/course";
import AWS from 'aws-sdk';
require('dotenv').config();

const SES = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const { EMAIL_BACKEND } = process.env;

export const makeTutor = async (req, res) => {
  try {
    //  find user from db
    const user = await User.findById(req.auth._id).exec();
    // console.log("This is the Tutor USER => ", user);

    // if user dont have in database field "role" the value "Tutor" then add it
    if(!user.role.includes("Tutor")) {
      user.role.push("Tutor");
      await user.save();
    }
    
    // send email message with confirmation that now has the role "Tutor" to user

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Congratulations</h1>
                <p>You have been granted the Tutor role on our platform. You can now start publishing your own courses.</p>
                <i>Youtemy.com</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "You're now a Tutor on Youtemy",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    // 4. send email message to backend manager with the information that a new tutor has been added to the platform

    // new block of code to send an email to the backend manager
    const managerParams = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [EMAIL_BACKEND], // Send to the backend manager's email
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>New Tutor Alert!</h1>
                  <p>This user just became a Tutor:</p>
                  <p>Name: ${user.name}</p>
                  <p>Email: ${user.email}</p>
                  <i>Youtemy.com</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New Tutor Notification",
        },
      },
    };

    const emailToManagerSent = SES.sendEmail(managerParams).promise();
    emailToManagerSent
      .then((data) => {
        // console.log('Email sent to backend manager', data);
      })
      .catch((err) => {
        console.log('Email failed', err);
      });




    // await SES.sendEmail(params).promise();

    // Redirect to welcome tutor page
    // res.redirect('/user/welcome-tutor');
    res.json({ success: true, message: 'Tutor role added successfully' });
  } catch (err) {
    console.log("MAKE TUTOR ERR ", err);
    res.status(500).send({ error: "Failed to create tutor." });
  }
};


export const getAccountStatus = async (req, res) => {
try {
  // find user from db
  const user = await User.findById(req.auth._id).exec();
  
  // if user does not have the role "Tutor", return Unauthorized
  if(!user.role.includes("Tutor")) {
    return res.status(401).send("Unauthorized");
  } else {
    // if user has the role "Tutor", update the user role in the db (if needed)
    // let updatedUser = { ...user._doc, role: "Tutor" };
    // await User.findByIdAndUpdate(
    //   user._id,
    //   {
    //     $addToSet: { role: "Tutor" },
    //   },
    //   { new: true }
    // )

    // if user has the role "Tutor", update the user role in the db (if needed)
    let updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { role: "Tutor" },
      },
      { new: true }
    )
      .select("-password")
      .exec();

    res.json(updatedUser);
  }
} catch (err) {
  console.log(err);
  res.status(500).send("Error getting account status.");
}
};

export const currentTutor = async (req, res) => {
  try {
    let user = await User.findById(req.auth._id).select("-password").exec();
    if (!user.role.includes("Tutor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const tutorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ tutor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};