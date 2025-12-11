import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: admin._id,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.email = req.body.email || admin.email;
      const updatedAdmin = await admin.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedAdmin._id,
          email: updatedAdmin.email,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
