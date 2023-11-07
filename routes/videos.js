const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // Add this line
const { Video } = require('../models');

//Using multer storage 
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Post route
router.post('/upload', upload.single('video'), async (req, res) => {
  const { title, description, userId } = req.body;
  const fileData = req.file.buffer;
  // Specify the local directory where you want to save the files
  const uploadDirectory = path.join(__dirname, '../uploads'); // Use path.join for cross-platform compatibility
  const filePath = path.join(uploadDirectory, req.file.originalname);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDirectory)) {
    try {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
      res.status(500).json({ message: 'Error creating directory' });
      return;
    }
  }
  // Stream the file data to the local filesystem
  
  const fileStream = fs.createWriteStream(filePath);
  fileStream.write(fileData);
  // Store metadata in the database
  try {
    await Video.create({
      title,
      description,
      userId,
      filePath,
    });
    
  } catch (err) {
    console.error(`Error creating video record: ${err}`);
    res.status(500).json({ message: 'Error creating video record' });
    return;
  }
  fileStream.end();
  res.status(201).json({ message: 'Video uploaded successfully' });
});

router.get('/video', async (req, res) => {
  try {
    // Fetch all videos from the database
    const videos = await Video.findAll();

    // Send the list of videos as a JSON response
    res.status(200).json(videos);
  } catch (err) {
    console.error(`Error fetching videos: ${err}`);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});
// Implement other video-related routes here

module.exports = router;
