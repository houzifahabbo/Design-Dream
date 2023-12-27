const EventModel = require("../db/models/order");
const DesignerModel = require("../db/models/designer");
const UserModel = require("../db/models/user");
const OrderModel = require("../db/models/order");
const AccountModel = require("../db/models/account");

const adminController = {};

adminController.restoreOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderExpires: null },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order restored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

adminController.restoreUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { userExpires: null },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const account = await AccountModel.findOneAndUpdate(
      { user: userId },
      { accountExpires: null },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "User restored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

adminController.restoreDesigner = async (req, res) => {
  const designerId = req.params.id;
  try {
    const designer = await DesignerModel.findByIdAndUpdate(
      designerId,
      { designerExpires: null },
      { new: true }
    );
    if (!designer) {
      return res.status(404).json({ error: "Designer not found" });
    }
    const account = await AccountModel.findOneAndUpdate(
      { user: designerId },
      { accountExpires: null },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "Designer restored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Admin-only route example
adminController.adminOnlyRoute = (req, res) => {
  res.json({ message: "This is an admin-only route" });
};

// User Management (CRUD Operations)
adminController.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching users", error });
  }
};

adminController.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching user", error });
  }
};

adminController.updateUserById = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error while updating user", error });
  }
};

adminController.deleteUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while deleting user", error });
  }
};

// Function to get all Designers (admin privilege)
adminController.getAllDesigners = async (req, res) => {
  try {
    const Designers = await DesignerModel.find();
    res.json(Designers);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching Designers", error });
  }
};

// Function to get designer by ID (admin privilege)
adminController.getDesignerById = async (req, res) => {
  const { DesignerId } = req.params;
  try {
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    res.json(designer);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching designer", error });
  }
};

// Function to create a new designer (admin privilege)
adminController.createDesigner = async (req, res) => {
  const { name, email, description, phoneNumber, image } = req.body;
  try {
    const designer = await DesignerModel.create({
      name,
      email,
      description,
      phoneNumber,
      image,
    });
    res.json({ message: "designer created successfully", designer });
  } catch (error) {
    res.status(500).json({ message: "Error while creating designer", error });
  }
};

// Function to update an designer by ID (admin privilege)
adminController.updateDesignerById = async (req, res) => {
  const { DesignerId } = req.params;
  const updates = req.body;
  try {
    // Update the designer by the provided designer ID
    await DesignerModel.findByIdAndUpdate(DesignerId, updates);

    res.json({ message: "designer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating designer", error });
  }
};

// Function to delete an designer by ID (admin privilege)
adminController.deleteDesignerById = async (req, res) => {
  const { DesignerId } = req.params;
  try {
    // Delete the designer by the provided designer ID
    await DesignerModel.findByIdAndDelete(DesignerId);

    res.json({ message: "designer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting designer", error });
  }
};

// Function to get all events (admin privilege)
adminController.getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching events", error });
  }
};

// Function to get event by ID (admin privilege)
adminController.getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching event", error });
  }
};

// Function to create a new event (admin privilege)
adminController.createEvent = async (req, res) => {
  const { name, date, location, category, createdBy } = req.body;
  try {
    const event = await EventModel.create({
      name,
      date,
      location,
      category,
      createdBy,
    });
    res.json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error while creating event", error });
  }
};

// Function to update an event by ID (admin privilege)
adminController.updateEventById = async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;
  try {
    // Update the event by the provided event ID
    await EventModel.findByIdAndUpdate(eventId, updates);

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating event", error });
  }
};

// Function to delete an event by ID (admin privilege)
adminController.deleteEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    // Delete the event by the provided event ID
    await EventModel.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting event", error });
  }
};

module.exports = adminController;
