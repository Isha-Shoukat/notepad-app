let notes = JSON.parse(localStorage.getItem("notes")) || [];
let selectedColor = "#FFD580";
let currentEditingNote = null;

// DOM Elements
const addNoteBtn = document.getElementById("addNoteBtn");
const colorPicker = document.getElementById("colorPicker");
const notesContainer = document.getElementById("notesContainer");

// Initialize color options
document.querySelectorAll(".color-option").forEach(option => {
  option.style.backgroundColor = option.dataset.color;
  option.addEventListener("click", () => {
    selectedColor = option.dataset.color;
    colorPicker.classList.add("hidden");
    createNewNote();
  });
});

// Event Listeners
addNoteBtn.addEventListener("click", () => {
  colorPicker.classList.toggle("hidden");
});

// Functions
function createNewNote() {
  // Create new note element
  const noteDiv = document.createElement("div");
  noteDiv.className = "note-card";
  noteDiv.style.backgroundColor = selectedColor;
  
  noteDiv.innerHTML = `
    <div class="note-header">
      <input type="text" class="note-title" placeholder="Title" value="">
      <div class="note-actions">
        <button class="star-btn" data-important="false">☆</button>
        <button class="delete-btn">🗑️</button>
      </div>
    </div>
    <textarea class="note-content" placeholder="Write your note..."></textarea>
    <div class="note-footer">
      <small class="note-date">${new Date().toLocaleDateString()}</small>
    </div>
  `;
  
  // Add to DOM first so we can focus
  notesContainer.prepend(noteDiv);
  
  // Focus on title
  const titleInput = noteDiv.querySelector(".note-title");
  titleInput.focus();
  
  // Set up event listeners
  const deleteBtn = noteDiv.querySelector(".delete-btn");
  const starBtn = noteDiv.querySelector(".star-btn");
  const contentTextarea = noteDiv.querySelector(".note-content");
  
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    noteDiv.remove();
    saveNotes();
  });
  
  starBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isImportant = starBtn.dataset.important === "false";
    starBtn.dataset.important = isImportant;
    starBtn.textContent = isImportant ? "★" : "☆";
    saveNotes();
  });
  
  // Save on blur
  titleInput.addEventListener("blur", saveNotes);
  contentTextarea.addEventListener("blur", saveNotes);
  
  currentEditingNote = noteDiv;
}

function saveNotes() {
  const noteCards = document.querySelectorAll(".note-card");
  notes = [];
  
  noteCards.forEach(card => {
    notes.push({
      id: card.id || Date.now(),
      title: card.querySelector(".note-title").value,
      content: card.querySelector(".note-content").value,
      important: card.querySelector(".star-btn").dataset.important === "true",
      color: card.style.backgroundColor,
      date: card.querySelector(".note-date").textContent
    });
    
    // Set ID if not already set
    if (!card.id) card.id = Date.now();
  });
  
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  notes.forEach(note => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note-card";
    noteDiv.style.backgroundColor = note.color;
    noteDiv.id = note.id;
    
    noteDiv.innerHTML = `
      <div class="note-header">
        <input type="text" class="note-title" placeholder="Title" value="${note.title}">
        <div class="note-actions">
          <button class="star-btn" data-important="${note.important}">${note.important ? "★" : "☆"}</button>
          <button class="delete-btn">🗑️</button>
        </div>
      </div>
      <textarea class="note-content" placeholder="Write your note...">${note.content}</textarea>
      <div class="note-footer">
        <small class="note-date">${note.date}</small>
      </div>
    `;
    
    notesContainer.appendChild(noteDiv);
    
    // Set up event listeners
    const deleteBtn = noteDiv.querySelector(".delete-btn");
    const starBtn = noteDiv.querySelector(".star-btn");
    const titleInput = noteDiv.querySelector(".note-title");
    const contentTextarea = noteDiv.querySelector(".note-content");
    
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      noteDiv.remove();
      saveNotes();
    });
    
    starBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isImportant = starBtn.dataset.important === "false";
      starBtn.dataset.important = isImportant;
      starBtn.textContent = isImportant ? "★" : "☆";
      saveNotes();
    });
    
    titleInput.addEventListener("blur", saveNotes);
    contentTextarea.addEventListener("blur", saveNotes);
  });
}

// Initialize
loadNotes();