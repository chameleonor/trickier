const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = 3000;

// Define the public folder where the files are located
const publicFolder = path.join(__dirname, "public");

// Use express.static middleware to serve static files
app.use(express.static(publicFolder));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: publicFolder,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route for file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

// Route for file deletion
app.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const fileLocation = path.join(publicFolder, filename);

  fs.unlink(fileLocation, (err) => {
    if (err) {
      console.error("Error deleting the file:", err);
      return res.status(404).send("File not found or could not be deleted.");
    }
    res.send(`File ${filename} deleted successfully.`);
  });
});

app.listen(port, () => {
  console.log(`FTP server running at http://localhost:${port}`);
});
