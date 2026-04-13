 // JS goes here later
// ── STATE ────────────────────────────────────────────── 
let notes  = [];   // each entry: { id, title, content } 
let nextId = 1;

// ── DOM REFERENCES ──────────────────────────────────── 
const notesContainer  = document.getElementById("notesContainer"); 
const titleInput      = document.getElementById("noteTitle"); 
const contentInput    = document.getElementById("noteContent"); 
const addBtn          = document.getElementById("addNoteBtn"); 
const clearAllBtn     = document.getElementById("clearAllBtn"); 
const noteCounterSpan = document.getElementById("noteCounter"); 
const windowSizeSpan  = document.getElementById("windowSize"); 
const userAgentSpan   = document.getElementById("userAgent"); 

function updateCounter() { 
    const count = notes.length; 
    noteCounterSpan.textContent = 
        count === 1 ? "1 note" : `${count} notes`; 
} 
function renderNotes() { 
    // ── clear container safely (no innerHTML) ── 
    while (notesContainer.firstChild) { 
        notesContainer.removeChild(notesContainer.firstChild); 
    } 
    
        // ── empty-state message ── 
    if (notes.length === 0) { 
        const emptyMsg = document.createElement("div"); 
        emptyMsg.textContent = "📭📭 No notes yet. Add your first note!"; 
        emptyMsg.style.color     = "#94a3b8"; 
        emptyMsg.style.textAlign = "center"; 
        emptyMsg.style.padding   = "1rem"; 
        notesContainer.appendChild(emptyMsg); 
        updateCounter(); 
        return; 
    }

    

    notes.forEach(note => { 
        // wrapper div 
        const noteDiv = document.createElement("div"); 
        noteDiv.classList.add("note-item"); 
        noteDiv.setAttribute("data-id", note.id); 
    
        // title row 
        const titleDiv  = document.createElement("div"); 
        titleDiv.classList.add("note-title"); 
    
        const titleSpan = document.createElement("span"); 
        titleSpan.textContent = note.title; 
            // delete button 
        const deleteBtn = document.createElement("button"); 
        deleteBtn.textContent = "🗑🗑 Delete"; 
        deleteBtn.classList.add("delete-note"); 
        deleteBtn.setAttribute("data-action", "delete"); 
        deleteBtn.setAttribute("data-id", note.id); 

        const editBtn = document.createElement("button"); 
        editBtn.textContent = "✏ Edit"; 
        editBtn.classList.add("edit-note");
        editBtn.setAttribute("data-action", "edit"); 
        editBtn.setAttribute("data-id", note.id);
    
        titleDiv.appendChild(titleSpan); 
        titleDiv.appendChild(deleteBtn); 
        titleDiv.appendChild(editBtn);
    
        // content paragraph 
        const contentP = document.createElement("p"); 
        contentP.classList.add("note-content"); 
        contentP.textContent = note.content || "(no additional content)"; 
    
        noteDiv.appendChild(titleDiv); 
        noteDiv.appendChild(contentP); 
        notesContainer.appendChild(noteDiv); 
    
        

    }); 
    
    updateCounter();
} 

function addNote() { 
    const title = titleInput.value.trim(); 
    
    // BOM: alert() for empty-title validation 
    if (title === "") { 
        alert("❌ Title cannot be empty!"); 
        titleInput.focus(); 
        return; 
    } 
    
    const content = contentInput.value.trim(); 
    notes.push({ id: nextId++, title, content }); 
    
    renderNotes(); 
    
    // clear inputs after adding 
    titleInput.value  = ""; 
    contentInput.value = ""; 
    titleInput.focus(); 
}

function deleteNoteById(id) { 
    // BOM: confirm() returns true/false 
    const ok = confirm("⚠ Are you sure you want to delete this note?"); 
    if (!ok) return; 
    
    const index = notes.findIndex(n => n.id === id); 
    if (index !== -1) { 
        notes.splice(index, 1); 
        renderNotes(); 
    }
}

function clearAllNotes() { 
    if (notes.length === 0) { 
        alert("📭📭 No notes to clear."); 
        return; 
    } 
    
    const ok = confirm( 
        `❗ Delete ALL ${notes.length} notes? Cannot be undone.` 
    ); 
    if (ok) { 
        notes  = []; 
        nextId = 1; 
        renderNotes(); 
        alert("✨ All notes have been cleared.");
    } 
} 
notesContainer.addEventListener("click", (e) => { 
    // find the closest ancestor (or self) that is a delete button 
    const btn = e.target.closest('[data-action="delete"]'); 
    if (btn) { 
        const id = parseInt(btn.getAttribute("data-id"), 10); 
        deleteNoteById(id); 
    } 
    const editTarget = e.target.closest('[data-action="edit"]'); 
    if (editTarget) { 
        const id    = parseInt(editTarget.getAttribute("data-id"), 10); 
        const found = notes.find(n => n.id === id); 
        if (found) { 
            // BOM: prompt() returns new string or null 
            const newTitle = prompt("New title:", found.title); 
            if (newTitle !== null && newTitle.trim() !== "") { 
                found.title = newTitle.trim(); 
                renderNotes(); 
            } 
        } 
    }
}); 

function updateWindowSize() { 
    const w = window.innerWidth; 
    const h = window.innerHeight; 
    let category; 
    if (w < 480)       category = "📱📱 Mobile"; 
    else if (w < 1024) category = "💻💻 Tablet"; 
    else               category = "🖥🖥 Desktop"; 
    windowSizeSpan.textContent = `${w} x ${h} px  (${category})`;  
} 
// BOM: resize event on the window object 
window.addEventListener("resize", updateWindowSize);

function showUserAgent() { 
    let agent = navigator.userAgent; 
    // trim long strings for display 
    if (agent.length > 55) agent = agent.slice(0, 52) + "..."; 
    userAgentSpan.textContent = agent; 
} 

function addSampleNotes() { 
    if (notes.length === 0) { 
        notes.push({ 
            id: nextId++, 
            title: "Hello BOM", 
            content: "Try resizing the window → watch width/height update!" 
        }); 
        notes.push({ 
            id: nextId++, 
            title: "Delete me", 
            content: "Click delete and confirm the BOM confirm box." 
        }); 
        renderNotes(); 
    } 
} 

function init() { 
    addSampleNotes();    // populate demo notes 
    updateWindowSize();  // BOM: show current size 
    showUserAgent();     // BOM: show user agent 
    addBtn.addEventListener("click", addNote); 
    clearAllBtn.addEventListener("click", clearAllNotes); 

    titleInput.addEventListener("keydown", (e) => { 
        if (e.key === "Enter") { 
            addNote(); 
        } 
    }); 
} 

init();   // ← call init when the page loads