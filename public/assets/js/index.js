// Define UI vars
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Check for active page
if (window.location.pathname === "/notes") {
  noteTitle = document.querySelector(".note-title"); // Get the note title element
  noteText = document.querySelector(".note-textarea"); // Get the note text element
  saveNoteBtn = document.querySelector(".save-note"); // Get the save note button element
  newNoteBtn = document.querySelector(".new-note"); // Get the new note button element
  noteList = document.querySelectorAll(".list-container .list-group"); // Get the list of notes element
}

// Show an element
const show = (elem) => {
  elem.style.display = "inline"; // Set the display property to inline
};

// Hide an element
const hide = (elem) => {
  elem.style.display = "none"; // Set the display property to none
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {}; // Set the activeNote to an empty object

const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); // Fetch all notes from the db

const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }); // Save a note to the db

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }); // Delete a note from the db

const renderActiveNote = () => {
  // Set the activeNote
  hide(saveNoteBtn); // Hide the save button

  if (activeNote?.id) { // If there is an activeNote, set the values of the note title and text to the values of the activeNote
    noteTitle.setAttribute("readonly", true); // Set the note title to readonly
    noteText.setAttribute("readonly", true); // Set the note text to readonly
    noteTitle.value = activeNote.title; // Set the note title value to the activeNote title
    noteText.value = activeNote.text; // Set the note text value to the activeNote text
  } else { // If there is no activeNote, set the values of the note title and text to empty strings
    noteTitle.removeAttribute("readonly"); // Remove the readonly attribute from the note title
    noteText.removeAttribute("readonly"); // Remove the readonly attribute from the note text
    noteTitle.value = ""; // Set the note title value to an empty string
    noteText.value = ""; // Set the note text value to an empty string
  }
};

const handleNoteSave = () => { // Save the note to the db and update the view
  const uuid = Math.random() // Generate a random id
    .toString(36) // Convert to a string
    .replace(/[^a-z]+/g, ""); // Remove all non-alphanumeric characters
  const newNote = { // Create a new note object
    id: uuid,
    title: noteTitle.value,
    text: noteText.value,
  };
  
  saveNote(newNote).then(() => { // Save the note to the db
    getAndRenderNotes(); // Get and render the updated list of notes
    renderActiveNote(); // Render the active note
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target; // Get the element that was clicked on
  const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).id; // Get the id of the note that was clicked on

  if (activeNote.id === noteId) { // If the note that was clicked on is the same as the activeNote, set the activeNote to an empty object
    activeNote = {}; // Set the activeNote to an empty object
  }

  deleteNote(noteId).then(() => { // Delete the note from the db
    getAndRenderNotes(); // Get and render the updated list of notes
    renderActiveNote(); // Render the active note
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault(); // Prevent the default behavior of the click event
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note")); // Set the activeNote to the note that was clicked on
  renderActiveNote(); // Render the active note
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {}; // Set the activeNote to an empty object
  renderActiveNote(); // Render the active note
};

const handleRenderSaveBtn = () => { // Show the save button if the note title and text are not empty
  if (!noteTitle.value.trim() || !noteText.value.trim()) { // If the note title or note text are empty
    hide(saveNoteBtn); // Hide the save button
  } else { // If the note title and note text are not empty
    show(saveNoteBtn); // Show the save button
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json(); // Get the notes from the db
  if (window.location.pathname === "/notes") { // If the user is on the notes page
    noteList.forEach((el) => (el.innerHTML = "")); // Empty the note list element
  }

  let noteListItems = []; // Create an array to hold the note list items

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement("li"); // Create the list item element
    liEl.classList.add("list-group-item"); // Add the list-group-item class to the list item

    const spanEl = document.createElement("span"); // Create the span element
    spanEl.classList.add("list-item-title"); // Add the list-item-title class to the span element
    spanEl.innerText = text; // Set the text of the span element to the text argument
    spanEl.addEventListener("click", handleNoteView); // Add an event listener to the span element that calls the handleNoteView function when clicked

    liEl.append(spanEl); // Append the span element to the list item

    if (delBtn) { // If the delBtn argument is true
      const delBtnEl = document.createElement("i"); // Create the delete button element
      delBtnEl.classList.add( // Add the classes to the delete button element
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      delBtnEl.addEventListener("click", handleNoteDelete); // Add an event listener to the delete button element that calls the handleNoteDelete function when clicked

      liEl.append(delBtnEl); // Append the delete button element to the list item
    }

    return liEl; // Return the list item
  };

  if (jsonNotes.length === 0) { // If there are no notes in the db
    noteListItems.push(createLi("No saved Notes", false)); // Add a list item that says "No saved Notes"
  }

  jsonNotes.forEach((note) => { // For each note in the db
    const li = createLi(note.title); // Create a list item with the note title
    li.dataset.note = JSON.stringify(note); // Add the note object to the list item as data

    noteListItems.push(li); // Add the list item to the noteListItems array
  });

  if (window.location.pathname === "/notes") { // If the user is on the notes page
    noteListItems.forEach((note) => noteList[0].append(note)); // Append the list items to the note list element
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === "/notes") { // If the user is on the notes page
  saveNoteBtn.addEventListener("click", handleNoteSave); // Add an event listener to the save button that calls the handleNoteSave function when clicked
  newNoteBtn.addEventListener("click", handleNewNoteView); // Add an event listener to the new note button that calls the handleNewNoteView function when clicked
  noteTitle.addEventListener("keyup", handleRenderSaveBtn); // Add an event listener to the note title that calls the handleRenderSaveBtn function when the keyup event is triggered
  noteText.addEventListener("keyup", handleRenderSaveBtn); // Add an event listener to the note text that calls the handleRenderSaveBtn function when the keyup event is triggered
}

getAndRenderNotes(); // Get and render the initial list of notes
