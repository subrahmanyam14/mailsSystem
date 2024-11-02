const AuthModel = require("../model/authModel.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { organisationName, personalMail, mail, firstname, lastname, phoneNo, empId, password } = req.body;

        // Check if all required fields are present
        if (!organisationName || !personalMail || !mail || !firstname || !lastname || !phoneNo || !empId || !password) {
            return res.status(400).send({ error: "All fields are required.", status: false });
        }

        // Check if `mail` is already in use
        const isEmailExisting = await AuthModel.findOne({ mail });
        if (isEmailExisting) {
            return res.status(509).send({ error: "Requested mail is already present, please try with another email.", status: false });
        }

        // Check if `personalMail` is already in use
        const isPersonalEmailExisting = await AuthModel.findOne({ personalMail });
        if (isPersonalEmailExisting) {
            return res.status(509).send({ error: "Personal email is already in use.", status: false });
        }
        const isPhoneNoExist = await AuthModel.findOne({phoneNo});
        if(isPhoneNoExist)
        {
            return res.status(509).send({error: "Provided phone number is already existing..."});
        }
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt);

        // Create and save new user registration
        const newRegistration = new AuthModel({ organisationName, personalMail, mail, firstname, lastname, phoneNo, empId, password: hashPassword });
        const savedData = await newRegistration.save();

        return res.status(201).send({ message: "Registered successfully.", status: true });
    } catch (error) {
        console.log("Error in the register function:", error);
        return res.status(500).send({ error: "Internal server error.", status: false });
    }
};

const checkEmail = async( req, res ) => {
    try {
        const {mail} = req.body;
        if(!mail)
        {
            return res.status(400).send({error: "Please provide the mail...", status: false});
        }
        const isExists = await AuthModel.findOne({mail});
        if(isExists)
        {
            return res.status(509).send({message: "Email is already existing...", status: false});
        }
        return res.status(200).send({message: "You can create the email which have provided...", status: true});
    } catch (error) {
        console.log("Error in the checkEmail...", error);
        return res.status(500).send({error: "Internal server error", status: false});
    }
}

const login = async( req, res ) => {
    try {
        const {mail, password} = req.body;
        if(!mail || !password)
        {
            return res.status(400).send({error: "All fileds are required...", status: false});
        }
        const existingDetails = await AuthModel.findOne({mail});
        if(!existingDetails)
        {
            return res.status(404).send({error: "Provided mail is not found or invalid credientials...", status: false});
        }
        const check = await bcrypt.compare(password, existingDetails.password);
        if(!check)
        {
            return res.status(401).send({error: "Invalid credentials are provided...", status: false});
        }
        return res.status(200).send({message: "Login is successfull", status: true});
    } catch (error) {
        console.log("Error in the login,,,", error);
        return res.status(500).send({error: "Internal server error...", status: false});
    }
}


const addAppPasword = async( req, res ) => {
    try {
        const {mail} = req.params;
        const {appPaassword} = req.body;
        if(!mail || !appPaassword)
        {
            return res.status(400).send({error: "All fileds are required...", status: false});
        }
        const existingDetails = await AuthModel.findOne({mail});
        if(!existingDetails)
        {
            return res.status(404).send({error: "Provided mail is not found...", status: false});
        }
        const id = existingDetails._id;
        const update = await AuthModel.findByIdAndUpdate(id, {appPaassword}, {new: true});
        if(!update)
        {
            return res.status(500).send({error: "Internal server error...", status: false});
        }
        return res.status(200).send({message: "App password added successfully...", status: true});
        } catch (error) {
        console.log("Error in the addAppPasword...", error);
        return res.status(500).send({error: "Internal server error...", status: false});
    }
}

module.exports = {register, checkEmail, login, addAppPasword};