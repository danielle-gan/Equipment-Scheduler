document.addEventListener("DOMContentLoaded", function() {
  // Get today's date
  const today = new Date();

  // Calculate dates for the next two weeks
  for (let i = 1; i <= 14; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      // Format the date as "WEEKDAY, MM/DD/YYYY"
      const formattedDate = futureDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
      });

      // Update the content of the corresponding element
      const dayElement = document.getElementById("day" + i);
      if (dayElement) {
          dayElement.textContent = formattedDate;
      }
  }
});


const input = document.getElementById('itemInput');
const button = document.getElementById('addBtn');

const dragMe = document.getElementById('dragMe');

const flex = document.getElementById('itemStage');


input.addEventListener('input', () => {
  if(input.value.length > 0) {
    button.disabled = false; 
  } else {
    button.disabled = true;
  }
});

let count = 0;

button.addEventListener('click', () => {

  const text = input.value;

  // Create new div
  const dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.id = `drag${++count}`; // Increment id

  dragDiv.innerHTML += text;
  
  dragDiv.draggable = true;
  dragDiv.ondragstart = dragStart;
  // Append new div  
  flex.appendChild(dragDiv);

  input.value = '';
});

let draggedBlock;

function dragStart(event) {
  draggedBlock = event.target;
  event.dataTransfer.setData('text/plain', null);
}


function allowDrop(event) {
  event.preventDefault();
}

function removeDragOver(event) {
  event.target.classList.remove('drag-over');
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove('drag-over');
  if (event.target.classList.contains('dragInto')) {
    event.target.appendChild(draggedBlock);
  }
  draggedBlock.classList.add('dragged');
}



// DELETE BUTTON
const deleteBtn = document.getElementById('delete-btn');

// Handle click
deleteBtn.addEventListener('click', () => {

  // Get dragDivs
  const dragDivs = document.querySelectorAll('.dragMe');

  // Loop through and remove
  for(let i = 0; i < dragDivs.length; i++) {
    dragDivs[i].remove();
  }

});