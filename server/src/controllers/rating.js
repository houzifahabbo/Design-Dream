const DesignerModel = require("../db/models/designer");
const RatingModel = require("../db/models/rating");
const ratingController = {};

// Add a rating for an designer
ratingController.addRating = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    const { rating, review } = req.body;
    const user = req.user;
    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5 ||
      rating % 0.5 !== 0
    ) {
      return res.status(400).json({
        error: "Invalid rating value. Please provide a number between 1 and 5.",
      });
    }
    const ratingObj = await RatingModel.create({
      user: user._id,
      rating,
      review,
    });
    // Find the designer by ID
    const designer = await DesignerModel.findById(DesignerId)
      .select("ratings averageRating")
      .populate("ratings");
    if (!designer) {
      return res.status(404).json({ error: "designer not found" });
    }
    designer.ratings.push(ratingObj);
    designer.averageRating = await designer.calcAverageRating(designer.ratings);
    await designer.save();
    res.json(designer.ratings);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// Get ratings for an designer
ratingController.getRatings = async (req, res) => {
  try {
    const { DesignerId } = req.params;
    // Find the designer by ID
    const designer = await DesignerModel.findById(DesignerId)
      .select("ratings")
      .populate("ratings");
    if (!designer) {
      return res.status(404).json({ error: "designer not found" });
    }
    res.json(designer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.getRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    // Find the designer by ID
    const rating = await RatingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "rating not found" });
    }
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    // Find the designer by ID
    const rating = await RatingModel.findByIdAndDelete(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "rating not found" });
    }
    res.json({ message: "rating deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, review } = req.body;
    // Find the designer by ID
    const ratingObj = await RatingModel.findByIdAndUpdate(
      ratingId,
      {
        rating,
        text: review,
      },
      { new: true }
    );
    if (!ratingObj) {
      return res.status(404).json({ error: "rating not found" });
    }
    res.json(ratingObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.addReply = async (req, res) => {
  const ratingId = req.params.ratingId;
  const { reply } = req.body;
  try {
    const rating = await RatingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "rating not found" });
    }
    rating.reply.push({
      account: req.designer.id,
      modelType: "Designer",
      text: reply,
    });
    await rating.save();
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.deleteReply = async (req, res) => {
  const ratingId = req.params.ratingId;
  const replyId = req.params.replyId;
  try {
    const rating = await RatingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "rating not found" });
    }
    const reply = rating.reply.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: "reply not found" });
    }
    reply.remove();
    await rating.save();
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ratingController.editReply = async (req, res) => {
  const ratingId = req.params.ratingId;
  const replyId = req.params.replyId;
  const { reply } = req.body;
  try {
    const rating = await RatingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "rating not found" });
    }
    const replyObj = rating.reply.id(replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "reply not found" });
    }
    replyObj.text = reply;
    await rating.save();
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = ratingController;
