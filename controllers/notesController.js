const Note = require("../models/Note");
const User = require("../models/User");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();
  //console.log({ notes });
  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: "Computer Not found" });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.Assigned_To).lean().exec();
      const Mantained_By_user = await User.findById(note.Mantained_By)
        .lean()
        .exec();
      const Checked_By_user = await User.findById(note.Checked_By)
        .lean()
        .exec();
      const Assigned_To_user = await User.findById(note.Assigned_To)
        .lean()
        .exec();
      return {
        ...note,
        username: user.username,
        Mantained_By_name: Mantained_By_user.username,
        Assigned_To_name: Assigned_To_user.username,
        Checked_By_name: Checked_By_user.username,
      };
    })
  );

  res.json(notesWithUser);
};

// @desc Create new note
// @route POST /notes
// @access Private

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  console.log(req.body);
  const {
    Checked_By,
    Branch_Name,
    Item_Type,
    Model,
    Serial_number,
    Problem,
    Required_Equipments,
    Mantained_By,
    Assigned_To,
  } = req.body;

  // Confirm data
  /* if (!user || !Branch_Name || !Item_Type || !Model || !Serial_number) {
    return res.status(400).json({ message: "All fields are required" });
  } */

  try {
    // Check for duplicate title
    /*   const duplicate = await Note.findOne({ Serial_number })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate Computer List" });
    } */

    // Create and store the new note
    const note = new Note({ ...req.body });
    //console.log(note);

    await Note.create(note);
    // await note.save();

    // Created
    return res.status(201).json({ message: "New Computer Add" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* const createNewNote = async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create and store the new user
  const note = await Note.create({ user, title, text });

  if (note) {
    // Created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
};
 */
// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const {
    id,
    Checked_By,
    Branch_Name,
    Item_Type,
    Model,
    Serial_number,
    Problem,
    Required_Equipments,
    Mantained_By,
    Assigned_To,
    completed,
  } = req.body;

  console.log(req.body);
  /* // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  } */

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Computer Not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ Serial_number })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  /* if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Computer List" });
  } */

  note.Checked_By = Checked_By;
  note.Branch_Name = Branch_Name;
  note.Item_Type = Item_Type;
  note.Model = Model;
  note.Serial_number = Serial_number;
  note.Problem = Problem;
  note.Required_Equipments = Required_Equipments;
  note.Mantained_By = Mantained_By;
  note.Assigned_To = Assigned_To;
  note.completed = completed;

  const updatedNote = await note.save();
  console.log({ updatedNote });
  res.json(`'${updatedNote.Serial_number}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Computer ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Computer not found" });
  }

  const result = await note.deleteOne();

  const reply = `Computer '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
