const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = 8081;

const publicFolder = path.join(__dirname, "public");

app.use(express.static(publicFolder));

const storage = multer.diskStorage({
  destination: publicFolder,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const fileLocation = path.join(publicFolder, filename);

  res.download(fileLocation, (err) => {
    if (err) {
      console.error("Error downloading the file:", err);
      res.status(404).send("File not found");
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

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
  console.log(`FTP server running at port ${port}`);
});
