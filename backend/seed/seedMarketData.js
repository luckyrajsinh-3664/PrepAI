const mongoose = require('mongoose');
require('dotenv').config();
const MarketTrend = require('../models/MarketTrend');
const marketData = require('../data/all_job_post.json');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear collection and drop indexes causing duplicate constraints
    await MarketTrend.deleteMany({});
    try {
      await MarketTrend.collection.dropIndexes();
    } catch (e) {
      // Ignore if collection/indexes don't exist yet
    }

    // Map roles and deduplicate by role name
    const seenRoles = new Set();
    const formattedData = [];

    for (const item of marketData) {
      const roleName = item.role || item.job_title || item.title || item.position || "Software Engineer";
      
      if (!seenRoles.has(roleName)) {
        seenRoles.add(roleName);
        formattedData.push({
          ...item,
          role: roleName
        });
      }
    }

    await MarketTrend.insertMany(formattedData);
    console.log(`Kaggle Market Data successfully seeded! (${formattedData.length} records inserted)`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();