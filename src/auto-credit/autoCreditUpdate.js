const cron = require("node-cron");
const db = require("../db/pool");

const scheduleCreditAddition = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await db.query(`
        UPDATE credits
        SET credits = credits + 5,
            last_updated = NOW()
      `);
      console.log(`Added 5 credits to all users at ${new Date().toISOString()}`);
    } catch (error) {
      console.error("Failed to add daily credits:", error.message);
    }
  }, {
    timezone: "UTC"
  });
};

module.exports = scheduleCreditAddition;
