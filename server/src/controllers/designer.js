const jwt = require("jsonwebtoken");
const DesignerModel = require("../db/models/designer");
const EventModel = require("../db/models/order");
const UserModel = require("../db/models/user");
const sendEmail = require("../utils/email");
const welcomeTemplate = require("../emailTemplates/welcome");

const DesignerController = {};
require("dotenv").config();

const generateJWT = (designer, jwtExp) =>
  jwt.sign(
    {
      id: designer.id,
      name: designer.name,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
const checkErorrCode = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(500)
      .json({ error: `${Object.keys(err.keyValue)} already used` });
  }
  return res.status(400).json({ error: err.message });
};
// Sign Up
DesignerController.createAccount = async (req, res) => {
  const jwtExp = Math.floor(Date.now() / 1000) + 86400; // 1 day expiration
  const {
    name,
    email,
    password,
    confirmPassword,
    description,
    phoneNumber,
    image,
  } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    let designer = await DesignerModel.findOne({ email });
    if (designer) {
      return res.status(400).json({ error: `${email} is already used` });
    }
    designer = await DesignerModel.create({
      name,
      email,
      password,
      description,
      phoneNumber,
      image,
    });
    // Save the designer
    await designer.save();
    const token = await generateJWT(designer, jwtExp);
    const emailText = welcomeTemplate(designer.name);
    sendEmail(email, "Welcome onboard", emailText);
    res.cookie("jwt", token, { httpOnly: false });
    res.json(token);
  } catch (err) {
    console.log(err);
    checkErorrCode(err, res);
  }
};
// Sign In
DesignerController.signin = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const designer = await DesignerModel.findOne({
      $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
    });
    if (!designer) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    // Compare the provided password with the hashed password in the designer object
    const passwordMatches = await designer.comparePassword(password);
    if (!passwordMatches) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    const token = await generateJWT(designer, jwtExp);
    res.cookie("jwt", token, { httpOnly: false });
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Sign out
DesignerController.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect(`${process.env.DOMAIN}/api-docs`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Update designer account
DesignerController.updateAccount = async (req, res) => {
  try {
    console.log(req.designer); // Make sure req.designer is properly defined when calling the function
    const { name, email, description, image, phone_number } = req.body;
    // Find the designer by ID
    const updatedDesigner = await DesignerModel.findById(req.designer._id);
    if (!updatedDesigner) {
      return res.status(404).json({ error: "designer not found" });
    }
    // Update designer details
    updatedDesigner.name = name;
    updatedDesigner.email = email;
    updatedDesigner.description = description;
    updatedDesigner.image = image;
    updatedDesigner.phone_number = phone_number;
    // Save the updated designer
    await updatedDesigner.save();
    res.json({
      message: "designer details updated successfully",
      designer: updatedDesigner,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while updating designer details", error });
  }
};
// Delete designer account
DesignerController.deleteAccount = async (req, res) => {
  const { designer } = req;
  try {
    // Find the designer by ID
    const deletedDesigner = await DesignerModel.findByIdAndDelete(designer.id);
    if (!deletedDesigner) {
      return res.status(404).json({ error: "designer not found" });
    }
    res.clearCookie("jwt");
    // res.json({ message: "designer account deleted successfully" });
    res.redirect(`${process.env.DOMAIN}/api-docs`);
  } catch (error) {
    res.status(422).json({ error: "Error while deleting designer account" });
  }
};
// Create an Event
DesignerController.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      start_date,
      end_date,
      image,
    } = req.body;

    // Check if the designer exists
    const designer = await DesignerModel.findById(req.designer.id);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }

    // Create a new event using the EventModel
    const event = new EventModel({
      title,
      organizer: designer._id, // Assign the designer's ID as the organizer
      description,
      location,
      category,
      start_date,
      end_date,
      image,
    });

    // Save the event
    await event.save();
    // Update the designer's events array with the new event
    designer.events.push(event._id);
    await designer.save();
    res.json({
      message: "Event successfully created",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating event",
      error: error.message,
    });
  }
};
// Gets every events from the DesignerId
DesignerController.getDesignerEvents = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    // Check if the designer exists
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    // Find all events created by the designer
    const events = await EventModel.find({ organizer: DesignerId });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting events",
      error,
    });
  }
};
// Updates an existing event
DesignerController.updateEvent = async (req, res) => {
  try {
    const { eventId } = req;
    const {
      title,
      description,
      location,
      category,
      start_date,
      end_date,
      image,
    } = req.body;
    // Check if the designer exists
    const designer = await DesignerModel.findById(req.designer.id);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    // Check if the event exists and is created by the designer
    const event = await EventModel.findOne({
      _id: eventId,
      organizer: designer.id,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Update the event data
    // Object.assign(event, eventDataToUpdate);

    (event.title = title),
      (event.description = description),
      (event.location = location),
      (event.category = category),
      (event.start_date = start_date),
      (event.end_date = end_date),
      (event.image = image),
      await event.save();
    res.json({
      message: "Event successfully updated",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating event",
      error: error.message,
    });
  }
};
// Deletes an existing event
DesignerController.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.eventId;

    // Check if the designer exists
    const designer = await DesignerModel.findById(req.designer.id);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    // Check if the event exists and is created by the designer
    const event = await EventModel.findOne({
      id: eventId,
      organizer: designer.id,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Remove the event from the designer's events array
    const deletedEvent = await EventModel.findById(event._id);
    if (!deletedEvent) {
      return res.json({ message: "Event has already been deleted" });
    }

    // Delete the event from the EventModel collection
    await EventModel.deleteOne({ _id: event._id });

    res.json({ message: "Event successfully deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting event",
      error: error.message,
    });
  }
};
// Get oranization by id
DesignerController.getDesignerById = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    res.json(designer);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting designer",
      error,
    });
  }
};
DesignerController.getAttendingUsersOfOrgEvents = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    // Check if the designer exists
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    // Find all events created by the designer
    const events = await EventModel.find({ organizer: DesignerId });
    if (events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }
    // Fetch attendees for each event
    const eventsWithAttendees = await Promise.all(
      events.map(async (event) => {
        const attendees = await UserModel.find(
          { _id: { $in: event.attendees } },
          { username: 1 }
        ).lean();

        return {
          eventName: event.title, // Use 'title' field as the event name
          attendees: attendees.map((user) => user.username),
        };
      })
    );

    res.json(eventsWithAttendees);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching attending users",
      error,
    });
  }
};
DesignerController.notifyAttendingUsers = async (req, res) => {
  try {
    const { designer } = req;
    const { message } = req.body;

    const events = await EventModel.find({ organizer: designer.id });
    if (events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }

    const attendees = await UserModel.find({
      _id: { $in: events.flatMap((event) => event.attendees) },
    });

    attendees.forEach((user) => {
      console.log(
        `Notifying user ${user.name} (${user.email}) - Message: ${message}`
      );
    });

    res.json({ message: "Notification sent to attending users" });
  } catch (error) {
    res.status(500).json({
      message: "Error while notifying attending users",
      error,
    });
  }
};
DesignerController.notifyEventChanges = async (req, res) => {
  try {
    const { eventId } = req;
    const { message } = req.body;

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Fetch users attending the designer's events
    const attendees = await UserModel.find({
      _id: { $in: event.attendees },
    });
    // Simulate notification for demonstration purposes (You will likely use a notification service or other method in a real application)
    attendees.forEach((user) => {
      console.log(
        `Notifying user ${user.username} (${user.email}) about changes to event ${eventId} - Message: ${message}`
      );
    });
    res.json({
      message: "Notification sent to attending users about event changes",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while notifying attending users about event changes",
      error,
    });
  }
};
DesignerController.filterEvents = async (req, res) => {
  try {
    const DesignerId = req.designer.id;
    const { category, location, date } = req.query;

    // Create a base query with the common filter for the designer and not expired events
    const baseQuery = {
      organizer: DesignerId,
      expired: false,
    };

    // Add additional filters based on the provided query parameters
    if (category) {
      const regex = new RegExp(category, "i");
      baseQuery.category = regex;
    }

    if (location) {
      baseQuery.location = location;
    }

    if (date) {
      baseQuery.start_date = { $gte: new Date(date) };
    }

    // Find events based on the combined query
    const events = await EventModel.find(baseQuery);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events",
      error: error.message,
    });
  }
};
DesignerController.searchEvents = async (req, res) => {
  try {
    const DesignerId = req.designer.id;
    const { query } = req.query;

    // Find events created by the designer matching the search query in the title or description
    const events = await EventModel.find({
      organizer: DesignerId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while searching for events",
      error,
    });
  }
};
// Add a rating for an designer
DesignerController.addRating = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    const { rating, review } = req.body;
    const { user } = req;
    // Validate rating value (assuming the rating is a number between 1 and 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Invalid rating value. Please provide a number between 1 and 5.",
      });
    }
    // Find the designer by ID
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ error: "designer not found" });
    }

    // Add the rating to the designer's ratings array
    designer.ratings.push({ user: user.username, rating, review });
    await designer.save();
    res.json({
      message: "Rating added successfully",
      ratings: designer.ratings,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while adding rating for the designer",
      error: error.message,
    });
  }
};
// Get ratings for an designer
DesignerController.getRatings = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    const designer = await DesignerModel.findById(DesignerId);
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }

    const { ratings } = designer;
    if (ratings.length === 0) {
      // If there are no ratings, return 0 as the average
      return res.json(
        "There is no previews rating of this designer, feel free to leave a review"
      );
    }

    // Calculate the total sum of ratings
    const totalRatings = ratings.reduce(
      (sum, ratingObj) => sum + ratingObj.rating,
      0
    );

    // Calculate the average rating
    const average = totalRatings / ratings.length;

    res.json({ average, ratings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while getting ratings", error: error.message });
  }
};
module.exports = DesignerController;
