const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate, validateLogin } = require("../models/User");

const signupUser = async (req, res) => {
  try {
    // Validate body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Save user
    const savedUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      role: req.body.role || 'user',
    }).save();

    // Sign JWT
    const token = jwt.sign(
      {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      .status(201)
      .send({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const signinUser = async (req, res) => {
  try {
    // Validate body
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Find user
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Validate password
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!passwordCorrect) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      .send({ message: "Logged in" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    })
    .send();
};

const authenticateToken = (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
      if (err) throw err;
      const user = {
        logged: true,
        data: info
      };
      res.json(user);
    });

  } catch (err) {
    console.error(err);
    res.json(false);
  }
};

module.exports = {
  signupUser,
  signinUser,
  logout,
  authenticateToken,
};
