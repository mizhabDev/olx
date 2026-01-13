import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../types/auth";
import { User } from "../model/userModel";
import { Message } from "../model/messageModel";
import { Conversation } from "../model/conversationModel";
import { Product } from "../model/prodectModel";

// ✅ Get all conversations for the logged-in user
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    const userId = req.user._id;

    // Find all conversations where user is either buyer or seller
    const conversations = await Conversation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("sellerId", "name photo")
      .populate("buyerId", "name photo")
      .populate("productId", "productName productPhotoSrc productPrice")
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversations",
    });
  }
};

// ✅ Get messages for a specific conversation
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    const { conversationId } = req.params;

    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.user._id.toString();
    if (
      conversation.buyerId.toString() !== userId &&
      conversation.sellerId.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    // Fetch messages for this conversation
    const messages = await Message.find({ conversationId })
      .populate("senderId", "name email")
      .populate("sellerId", "name email")
      .populate("buyerId", "name email")
      .sort({ createdAt: 1 });

    // Mark messages as read if user is not the sender
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: req.user._id },
        status: { $ne: "read" },
      },
      { $set: { status: "read" } }
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};

// ✅ Send a new message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    // Verify conversation exists and user is part of it
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.user._id.toString();
    if (
      conversation.buyerId.toString() !== userId &&
      conversation.sellerId.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    // Create the message with sellerId, buyerId from conversation and senderId as current user
    const newMessage = new Message({
      conversationId,
      sellerId: conversation.sellerId,
      buyerId: conversation.buyerId,
      senderId: req.user._id, // The actual sender
      message: message.trim(),
      status: "sent",
    });

    await newMessage.save();

    // Update conversation's last message
    conversation.lastMessage = message.trim().substring(0, 100);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate sender info before returning
    await newMessage.populate("senderId", "name email");
    await newMessage.populate("sellerId", "name email");
    await newMessage.populate("buyerId", "name email");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
};

// ✅ Start or get existing conversation (when user clicks "Chat" on a product)
export const startConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find the product to get seller info
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const sellerId = product.createdBy._id;
    const buyerId = req.user._id;

    // Check if user is trying to chat with themselves
    if (sellerId?.toString() === buyerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation about your own product",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      sellerId,
      buyerId,
      productId,
    })
      .populate("sellerId", "name photo")
      .populate("buyerId", "name photo")
      .populate("productId", "productName productPhotoSrc productPrice");

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        sellerId,
        buyerId,
        productId,
      });
      await conversation.save();

      // Populate after save
      await conversation.populate("sellerId", "name email photo");
      await conversation.populate("buyerId", "name email photo");
      await conversation.populate(
        "productId",
        "productName productPhotoSrc productPrice"
      );
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Error starting conversation",
    });
  }
};

// 🔹 Legacy functions (keeping for backward compatibility)
export const adminChatPage = async (req: AuthRequest, res: Response) => {
  try {
    const emailId = req.params.id;

    if (!emailId || typeof emailId !== "string") {
      return res.status(400).json({ message: "Invalid email ID" });
    }

    const user = await User.findOne({ email: emailId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log(user);
    res.render("admin-chat", {
      user,
      admin: {
        email: "adminolx@gmail.com",
      },
    });
  } catch (error) {
    console.error("Error loading chat page:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const userChat = (req: AuthRequest, res: Response) => {
  try {
    const user = req?.user;

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing or invalid.",
      });
    }

    return res.render("user-chat", {
      user: {
        name: user.name,
        email: user.email,
      },
      admin: {
        name: "AdminOlx",
        email: "adminolx@gmail.com",
      },
    });
  } catch (error) {
    console.error("❌ Error rendering user chat:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while loading chat.",
    });
  }
};