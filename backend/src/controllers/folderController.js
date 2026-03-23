import Folder from "../models/Folder.js";

export const getFolder = async (req, res) => {
  const userId = req.user._id;

  try {
    const folders = await Folder
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
}

export const getFolderById = async (req, res) => {
  const folderId = req.params.id;
  const userId = req.user._id;

  try {
    const folder = await Folder.findOne({
      _id: folderId,
      user: userId
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createFolder = async (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const newFolder = new Folder({
      name,
      icon,
      user: req.user._id
    });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteFolder = async (req, res) => {
  const folderId = req.params.id;
  const userId = req.user._id;

  try {
    const folder = await Folder.findOne({
      _id: folderId,
      user: userId
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found or unauthorized" });
    }

    await folder.deleteOne();

    res.status(200).json({ message: "Folder deleted successfully" });

  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};