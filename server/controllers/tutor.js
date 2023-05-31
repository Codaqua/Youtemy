import User from "../models/user";
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
        // 1. find user from db
    const user = await User.findById(req.auth._id).exec();
    console.log("This is the Tutor USER => ", user);

    // 2. if user dont have in database field "role" the value "Tutor" then add it
    if(!user.role.includes("Tutor")) {
      user.role.push("Tutor");
      await user.save();
    }
    
// 3. send email message with confirmation that now has the role "Tutor" to user

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
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

  // 4. send email message to backend manager with the information that a new tutor has been added to the platform

    // After updating the user role to Tutor
    await User.findByIdAndUpdate(user._id, { role: "Tutor" }).exec();

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
        console.log('Email sent to backend manager', data);
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
