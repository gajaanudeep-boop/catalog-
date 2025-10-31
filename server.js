const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*", // Allow frontend to send requests from anywhere
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/cateringDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// ✅ Schema & Model
const preferenceSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: String, required: true },
  foodType: String,
  mealType: String,
  members: Number,
}, { timestamps: true });

const Preference = mongoose.model("Preference", preferenceSchema);

// ✅ Route: POST /preference
app.post("/preference", async (req, res) => {
  console.log("📩 Received data:", req.body);

  try {
    const { name, email, phone, foodType, mealType, members } = req.body;

    if (!phone) {
      return res.status(400).send("❌ Phone number is required.");
    }

    const newPref = new Preference({ name, email, phone, foodType, mealType, members });
    await newPref.save();

    console.log("✅ Preference saved:", newPref);
    res.status(200).send("✅ Preference saved successfully!");
  } catch (error) {
    console.error("❌ Error saving preference:", error);
    res.status(500).send("❌ Error saving preference.");
  }
});

// ✅ Route: Serve contacts.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "contacts.html"));
});

// ✅ Start Server (Binds to all interfaces)
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on all interfaces!`);
  console.log(`   Access locally:  http://localhost:${PORT}/contacts.html`);
  console.log(`   Or from your network: http://YOUR_LOCAL_IP:${PORT}/contacts.html`);
  console.log(`   (Replace YOUR_LOCAL_IP with this device's actual Wi-Fi/LAN IP)`);
});
