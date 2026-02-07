import Note from "../models/Note.js";


//Fetching the notes
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({
      user: req.user._id   //  only logged user notes
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);

  } catch (error) {
    console.error("Error in getAllNotes Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Fetching a note by ID(fetching a specific single note)
export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id    // ownership check
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found or not authorized"
      });
    }

    res.status(200).json({
      message: "Fetched Note successfully",
      note
    });

  } catch (error) {
    console.error("Error in getNoteByID Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Creating a note
export async function createNote(req, res) {
  try {
    const { title, description } = req.body;

    const note = await Note.create({
      title,
      description,
      user: req.user._id   // attach logged in user
    });

    res.status(201).json({
      message: "Note Created successfully",
      note
    });

  } catch (error) {
    console.error("Error in createNote Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Updating a note
export async function updateNote(req, res) {
  try {
    const { title, description } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id   // ownership check
      },
      { title, description },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or not authorized"
      });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote
    });

  } catch (error) {
    console.error("Error in updateNote Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Deleting a note
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id    // ownership check
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found or not authorized"
      });
    }

    res.status(200).json({
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error("Error in deleteNote Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
