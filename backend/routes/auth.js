const router = require("express").Router();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
//SIGN up

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
      const existingUser=await User.findOne({email});
      if(existingUser)
        {
          return res
          .status(200)
          .json({message:"User with this email already exists"});
        }
    const hashpassword = bcrypt.hashSync(password);
    const user = new User({ email, username, password: hashpassword });
    await user
      .save()
      .then(() => res.status(200).json({ message: "sign up successfull" }));
  } catch (error) {
    res.status(200).json({ message: "User Already Exists" });
  }
});

//LOG IN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Please Signup First" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(200).json({ message: "Incorrect password" });
    }
    const { password, ...others } = user._doc;
    res.status(200).json({ user: others });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
