const MailBoxSchema = require("../model/mailBoxModel.js");
const AuthSchema = require("../model/authModel.js");
const { io, getReceiverSocketId } = require("../../socketio.js");
// const mailBoxModel = require("../model/mailBoxModel.js");

// Function to validate email addresses in the Auth collection
const path = require("path");

// Function to validate email addresses in the Auth collection
// Function to validate email addresses in the Auth collection
const validateEmails = async (emailArray) => {
    const result = await AuthSchema.find({ mail: { $in: emailArray } }, { mail: 1 });
    const foundEmails = result.map((auth) => auth.mail);
    const notFoundEmails = emailArray.filter(email => !foundEmails.includes(email));
    return notFoundEmails;
};

const checkEmails = (to, cc, bb) => {
    const usersSet = [];
    if (to) to.forEach(email => usersSet.push(email));
    if (cc) cc.forEach(email => usersSet.push(email));
    if (bb) bb.forEach(email => usersSet.push(email));
    return usersSet;
};


const getAllSentMailsByEmail = async ( email ) => {
    const existingData = await MailBoxSchema.find({ from: email });
    return existingData;
}

const getAllRecievedMailsByEmail = async ( email ) => {
    const existingReceivedMails = await MailBoxSchema.find({
        $or: [
            { bcc: { $in: [email] } },
            { cc: { $in: [email] } },
            { to: { $in: [email] } }
        ]
    });
    return existingReceivedMails;
}

const sendMail = async (req, res) => {
    try {
        const { organisationId, from, sub, body, isExternal } = req.body;
        
        // Parse the recipient fields as arrays (assuming they are sent as JSON strings)
        const to = req.body.to ? JSON.parse(req.body.to) : [];
        const cc = req.body.cc ? JSON.parse(req.body.cc) : [];
        const bb = req.body.bb ? JSON.parse(req.body.bb) : [];

        const attachments = req.files ? req.files.map(file => file.path) : []; // Add file paths to attachments array

        // Check for required fields and ensure at least one recipient in to, cc, or bb
        if (!organisationId || !from || !body) {
            return res.status(400).send({ error: "Some fields are mandatory", status: false });
        }

        if ((!to || to.length === 0) && (!cc || cc.length === 0) && (!bb || bb.length === 0)) {
            return res.status(400).send({ error: "At least one recipient in 'to', 'cc', or 'bb' is required.", status: false });
        }

        // Validate emails
        if (to && to.length > 0) {
            const invalidToEmails = await validateEmails(to);
            if (invalidToEmails.length > 0) {
                return res.status(400).send({ error: `Invalid 'to' emails: ${invalidToEmails.join(", ")}`, status: false });
            }
        }
        if (cc && cc.length > 0) {
            const invalidCcEmails = await validateEmails(cc);
            if (invalidCcEmails.length > 0) {
                return res.status(400).send({ error: `Invalid 'cc' emails: ${invalidCcEmails.join(", ")}`, status: false });
            }
        }
        if (bb && bb.length > 0) {
            const invalidBbEmails = await validateE+mails(bb);
            if (invalidBbEmails.length > 0) {
                return res.status(400).send({ error: `Invalid 'bb' emails: ${invalidBbEmails.join(", ")}`, status: false });
            }
        }

        // Save mail to database
        const newMail = new MailBoxSchema({
            organisationId,
            from,
            sub,
            body,
            attachments,
            to,
            cc,
            bb,
            isExternal
        });

        await newMail.save();

        // Notify users
        const users = await checkEmails(to, cc, bb);
        users.forEach(email => {
            const receiverSocketId = getReceiverSocketId(email);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMail", newMail);
            }
        });

        return res.status(200).send({ message: "Mail sent successfully with attachments.", status: true });

    } catch (error) {
        console.log("Error in sendMail:", error);
        return res.status(500).send({ error: "Internal server error.", status: false });
    }
};



const markAsRead = async (req, res) => {
    try {
        const { id, email } = req.query;

        // Check if required parameters are provided
        if (!id || !email) {
            return res.status(400).send({ error: "Both 'id' and 'email' parameters are required.", status: false });
        }

        // Update the 'seen' array by adding the email if it doesn't already exist
        const updatedData = await MailBoxSchema.findByIdAndUpdate(
            id,
            { $addToSet: { seen: email } },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).send({ error: "Mail ID not found.", status: false });
        }
        const receiverSocketId = getReceiverSocketId(email);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("mailSeen", updatedData);
        }

        return res.status(200).send({ message: "Mail seen data updated.", data: updatedData, status: true });
    } catch (error) {
        console.log("Error in markAsRead:", error);
        return res.status(500).send({ error: "Internal server error.", status: false });
    }
};


const editBodyOrSubject = async (req, res) => {
    try {
        const { id } = req.params;  // Assuming `id` is passed as a route parameter
        const { body, sub, mail } = req.body; // Assuming new values are in the request body

        // Validate presence of id and at least one field to update
        if (!id || (!body && !sub) || !mail) {
            return res.status(400).send({ error: "Mail ID and at least one field (body or subject) to update are required.", status: false });
        }

        // Create an update object based on provided fields
        const updateData = {};
        if (body) updateData.body = body;
        if (sub) updateData.sub = sub;
        updateData.isEdited = true; // Mark as edited

        // Update the document in the database
        const updatedMail = await MailBoxSchema.findOneAndUpdate({ _id: id, from: email }, updateData, { new: true });

        if (!updatedMail) {
            return res.status(404).send({ error: "Mail ID not found.", status: false });
        }

        return res.status(200).send({ message: "Mail updated successfully.", status: true, data: updatedMail });
    } catch (error) {
        console.log("Error in the editBodyOrSubject:", error);
        return res.status(500).send({ error: "Internal server error", status: false });
    }
};


const getAllSentMails = async (req, res) => {
    try {
        const { email } = req.params;
        console.log("email....", email)
        if (!email) {
            return res.status(400).send({ error: "Parameter is required...", status: false });
        }
        const existingData = await getAllSentMailsByEmail(email);
        // console.log("sent mails , ", existingData);
        return res.status(200).send({ message: "Data is fetched successfully...", sentMails: existingData, status: true });
    } catch (error) {
        console.log("error in the getAllSentMails, ", error);
        return res.status(500).send({ error: "Internal server error...", status: false });
    }
}


const getAllRecievedMails = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).send({ error: "Parameter is required...", status: false });
        }
        const existingReceivedMails = await getAllRecievedMailsByEmail(email);
        return res.status(200).send({ message: "mails are fetched successfully...", recievedMails: existingReceivedMails, status: true });
    } catch (error) {
        console.log("error in the getAllRecievedMails, ", error);
        return res.status(500).send({ error: "Internal server error...", status: false });
    }
}


const deleteSentMail = async (req, res) => {
    try {
        const { id, email } = req.query;
        if (!id || !email) {
            return res.status(400).send({ error: "All the fields are required...", status: false });
        }

        const deletedMail = await MailBoxSchema.findOneAndDelete({ _id: id, from: email });
        if (!deletedMail) {
            return res.status(404).send({ error: "Mail ID not found...", status: false });
        }
        return res.status(200).send({ message: "Mail deleted successfully...", status: true });
    } catch (error) {
        console.log("Error in the deleteSentMail:", error);
        return res.status(500).send({ error: "Internal server error", status: false });
    }
}

const deleteRecievedMail = async (req, res) => {
    try {
        const { id, email } = req.query;
        if (!id || !email) {
            return res.status(400).send({ error: "All the fields are required...", status: false });
        }
        const existingData = await MailBoxSchema.findOneAndUpdate(
            { _id: id, $or: [{ bcc: { $in: [email] } }, { cc: { $in: [email] } }, { to: { $in: [email] } }] },
            { $addToSet: { deletedFor: email } }, // Using $addToSet to add the email to the array if it doesn’t already exist
            { new: true }
        );

        if(!existingData){
            return res.status(404).send({ error: "Mail ID not found...", status: false });
        }
        res.status(200).send({ message: "Mail marked as deleted for the user.", status: true, data: existingData });
    } catch (error) {
        console.log("Error in the deleteRecievedMail:", error);
        return res.status(500).send({ error: "Internal server error", status: false });
    }
}



module.exports = { sendMail, markAsRead, editBodyOrSubject, getAllSentMails, getAllRecievedMails, deleteSentMail, getAllRecievedMailsByEmail, getAllSentMailsByEmail, deleteRecievedMail };
