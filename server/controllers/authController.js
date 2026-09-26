const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Users, posts, likes, follows } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_postarea_2026_modern";

const register = async (req, res, next) => {
  try {
    const { userName, password, fullName } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name (First and Last Name) is required." });
    }

    if (!userName || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    if (userName.trim().length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters." });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters." });
    }

    const existingUser = await Users.findOne({ where: { userName: userName.trim() } });
    if (existingUser) {
      return res.status(409).json({ error: "Username is already taken. Please choose another." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      userName: userName.trim(),
      fullName: fullName.trim(),
      password: hashedPassword,
      bio: "",
      avatar: "",
      hideUsername: false,
      isPrivate: false,
    });

    // Auto-login: issue token immediately on registration
    const accessToken = sign(
      { id: newUser.id, userName: newUser.userName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      success: true,
      accessToken: accessToken,
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        userName: newUser.userName,
        fullName: newUser.fullName || "",
        bio: newUser.bio || "",
        avatar: newUser.avatar || "",
        hideUsername: false,
        isPrivate: false,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await Users.findOne({ where: { userName: userName.trim() } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const accessToken = sign(
      { id: user.id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      accessToken: accessToken,
      userName: user.userName,
      fullName: user.fullName || "",
      id: user.id,
      bio: user.bio || "",
      avatar: user.avatar || "",
      hideUsername: !!user.hideUsername,
      isPrivate: !!user.isPrivate,
    });
  } catch (err) {
    next(err);
  }
};

const checkAuth = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }
    return res.status(200).json({
      authenticated: true,
      id: user.id,
      userName: user.userName,
      fullName: user.fullName || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
      hideUsername: !!user.hideUsername,
      isPrivate: !!user.isPrivate,
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userPosts = await posts.findAll({
      where: { UserId: id },
      include: [likes],
      order: [["createdAt", "DESC"]],
    });

    const totalLikes = userPosts.reduce(
      (acc, curr) => acc + (curr.likes ? curr.likes.length : 0),
      0
    );

    const [followerCount, followingCount] = await Promise.all([
      follows.count({ where: { followingId: id } }),
      follows.count({ where: { followerId: id } }),
    ]);

    let isFollowing = false;
    const isOwner = req.user && req.user.id === parseInt(id, 10);
    if (req.user && req.user.id && !isOwner) {
      const followRecord = await follows.findOne({
        where: { followerId: req.user.id, followingId: id },
      });
      isFollowing = !!followRecord;
    }

    const isPrivate = !!user.isPrivate;
    const canViewContent = !isPrivate || isOwner || isFollowing;

    return res.status(200).json({
      id: user.id,
      userName: user.userName,
      fullName: user.fullName || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
      hideUsername: !!user.hideUsername,
      isPrivate: isPrivate,
      canViewContent: canViewContent,
      createdAt: user.createdAt,
      postCount: userPosts.length,
      totalLikesReceived: totalLikes,
      followerCount: followerCount,
      followingCount: followingCount,
      isFollowing: isFollowing,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar, fullName, hideUsername, isPrivate } = req.body;

    if (bio && typeof bio === "string" && bio.length > 250) {
      return res.status(400).json({ error: "Bio cannot exceed 250 characters." });
    }

    if (fullName && typeof fullName === "string" && fullName.length > 100) {
      return res.status(400).json({ error: "Full Name cannot exceed 100 characters." });
    }

    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (typeof fullName === "string") {
      user.fullName = fullName.trim();
    }
    if (typeof bio === "string") {
      user.bio = bio.trim();
    }
    if (typeof avatar === "string") {
      user.avatar = avatar.trim();
    }

    if (typeof isPrivate === "boolean") {
      user.isPrivate = isPrivate;
    }

    // Constraint: User cannot hide their username if they don't have a Full Name
    if (hideUsername === true) {
      if (!user.fullName || !user.fullName.trim()) {
        return res.status(400).json({
          error: "You must provide a Full Name before you can hide your username.",
        });
      }
      user.hideUsername = true;
    } else if (hideUsername === false) {
      user.hideUsername = false;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        hideUsername: !!user.hideUsername,
        isPrivate: !!user.isPrivate,
      },
    });
  } catch (err) {
    next(err);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json([]);
    }
    const query = q.trim();

    // Privacy rule:
    // If a user has hideUsername = true, they CANNOT be searched by userName!
    // They can only be found by fullName!
    // If hideUsername = false, they can be matched by fullName OR userName.
    const matchingUsers = await Users.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${query}%` } },
          {
            [Op.and]: [
              { hideUsername: false },
              { userName: { [Op.like]: `%${query}%` } },
            ],
          },
        ],
      },
      attributes: ["id", "userName", "fullName", "avatar", "bio", "hideUsername", "isPrivate"],
      limit: 20,
    });

    return res.status(200).json(matchingUsers);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  checkAuth,
  getUserProfile,
  updateProfile,
  searchUsers,
};
