const router = require("express").Router();
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const CryptoJS = require("crypto-js"); //cho password
const jwt = require("jsonwebtoken");
let { uuid } = require("uuidv4");
let multer = require("multer");
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

//REGISTER EMPLOYEE
router.post("/register/employee", upload.single("img"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const newUser = new Employee({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    username: req.body.username,
    age: req.body.age,
    role: req.body.role,
    email: req.body.email,
    img: req.file ? url + "/public/" + req.file.filename : "",
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN EMPLOYEE
router.post("/login/employee", async (req, res) => {
  try {
    const user = await Employee.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      return res.status(401).json("Sai tên tài khoản!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Nhập sai mật khẩu!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//REGISTER CUSTOMER
router.post("/register/customer", upload.single("img"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  console.log(req);
  const newUser = new Customer({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    username: req.body.username,
    age: req.body.age,
    role: req.body.role,
    email: req.body.email,
    hospitalId: req.body.hospitalId,
    img: req.file ? url + "/public/" + req.file.filename : "",
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN CUSTOMER
router.post("/login/customer", async (req, res) => {
  console.log(req.body);
  try {
    const user = await Customer.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      return res.status(401).json("Sai tên tài khoản!");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if(OriginalPassword !== req.body.password)
      return res.status(401).json("Nhập sai mật khẩu!");
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
