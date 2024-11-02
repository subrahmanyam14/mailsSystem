const {sendMail, markAsRead, editBodyOrSubject, getAllSentMails, getAllRecievedMails, deleteSentMail, deleteRecievedMail} = require("../controller/mailBoxController.js");
const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Ensure 'uploads' directory exists
    },
    filename: (req, file, cb) => {
        // Generate a unique suffix with the current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Create the unique filename with original extension
        const uniqueName = `${uniqueSuffix}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage })

const route = express.Router();

route.  post("/send", upload.array("attachments", 15), sendMail);  // Allow up to 10 attachments

route.put("/read", markAsRead);

route.put("/edit/:id", editBodyOrSubject);

route.get("/getSent/:email", getAllSentMails);

route.get("/getRecieved/:email", getAllRecievedMails);

route.delete("/deleteSent", deleteSentMail);

route.delete("/deleteRecieved", deleteRecievedMail);

module.exports = route;