import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import UserProfile from "../models/UserProfile.js";

const APP_ID = process.env.FACEBOOK_APP_ID;

const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

const register = async ({ userName, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  // Create user
  const user = new User({ userName, email, password: hashedPassword });
  await user.save();
  
  // Automatically create UserProfile for new user
  const userProfile = new UserProfile({
    userId: user._id,
    name: userName,
    email: email,
    jobTitle: 'New Member', // Default job title
    bio: '',
    website: '',
    location: '',
    skills: [],
    avatarUrl: '',
    coverImageUrl: '',
  });
  await userProfile.save();
  
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },

    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { accessToken, refreshToken, user: userWithoutPassword };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw new Error("User not found");
  }
  const profile = await UserProfile.findOne({ userId: user._id }).lean();

  const userWithProfile = {
    ...user,
    profile: profile || null,
  };
  return userWithProfile;
};

const refreshAccessToken = (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return newAccessToken;
};

// Verify access token and return decoded payload
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const getFacebookAuthUrl = async (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  // lưu state vào session/redis/cookie để đối chiếu
  const stateJwt = jwt.sign(
    { state: state },

    process.env.JWT_SECRET,
    { expiresIn: "5m" } // state chỉ hợp lệ 5 phút
  );
  console.log(stateJwt);

  const authUrl = new URL(process.env.FACEBOOK_AUTH_URL);
  authUrl.searchParams.set("client_id", APP_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("state", stateJwt);
  authUrl.searchParams.set("scope", "email,public_profile");
  return authUrl.toString();
};

const handleFacebookCallback = async (code) => {
  // 1) Lấy access token
  const tokenUrl = new URL(
    "https://graph.facebook.com/v19.0/oauth/access_token"
  );
  tokenUrl.searchParams.set("client_id", APP_ID);
  tokenUrl.searchParams.set("client_secret", APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenJson = await tokenRes.json();

  if (!tokenJson.access_token) {
    throw new Error("Failed to obtain access token");
  }

  // 2) Lấy profile
  const meRes = await fetch(
    "https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=" +
      tokenJson.access_token
  );
  const me = await meRes.json();
  if (!me.id) {
    throw new Error("Failed to fetch user profile");
  }

  // 3) Tạo người dùng mới
  const existingUser = await User.findOne({ email: me.email });
  let user;
  if (existingUser) {
    user = existingUser;
  } else {
    user = new User({
      username: me.name,
      email: me.email,
      imageUrl: me.picture.data.url,
      facebookId: me.id,
    });
    await user.save();
  }

  // 4) Trả về access token và refresh token cho fe

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },

    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken, user };
};

const updateUserType = async (userId, type) => {
  const validTypes = ["freelancer", "hirer", "both"];
  if (!validTypes.includes(type)) {
    throw new Error(
      "Invalid user type. Must be 'freelancer', 'hirer', or 'both'"
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { type },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserTopics = async (userId, topics) => {
  if (!Array.isArray(topics)) {
    throw new Error("Topics must be an array");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { topics },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const authService = {
  register,
  login,
  getProfile,
  refreshAccessToken,
  verifyToken,
  getFacebookAuthUrl,
  handleFacebookCallback,
  updateUserType,
  updateUserTopics,
};

export default authService;
