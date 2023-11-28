document.addEventListener("DOMContentLoaded", function () {
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
  if (input.value.length > 0) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
});

function findMaxId() {
  const dragDivs = document.querySelectorAll('.dragMe');
  let maxId = 0;

  dragDivs.forEach((div) => {
    const currentId = parseInt(div.id.replace('drag', ''), 10);
    if (!isNaN(currentId) && currentId > maxId) {
      maxId = currentId;
    }
  });

  return maxId;
}

button.addEventListener('click', () => {
  const text = input.value;

  // Create new div
  const dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');

  // Find the maximum ID and increment it
  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.innerHTML += text;
  dragDiv.draggable = true;
  dragDiv.ondragstart = dragStart;

  // Append new div  
  flex.appendChild(dragDiv);

  // Attach drag-and-drop events to the newly created div
  dragDiv.addEventListener('dragstart', dragStart);

  input.value = '';
});

let draggedBlock;

function dragStart(event) {
  draggedBlock = event.target;
  event.dataTransfer.setData('text/plain', event.target.id);
}


function allowDrop(event) {
  event.preventDefault();
}

function removeDragOver(event) {
  event.target.classList.remove('drag-over');
}

function drop(event) {
  event.preventDefault();

  // Check if event.target is a valid element
  if (event.target && event.target.classList) {
    event.target.classList.remove('drag-over');

    if (event.target.classList.contains('dragInto')) {
      const draggedId = event.dataTransfer.getData('text/plain');

      // Log the draggedId to identify the issue
      console.log('draggedId:', draggedId);

      const draggedBlock = document.getElementById(draggedId);

      // Check if draggedBlock is a valid node before appending
      if (draggedBlock instanceof Node) {
        event.target.appendChild(draggedBlock);
        draggedBlock.classList.add('dragged');
      } else {
        console.error('Invalid node or not found:', draggedBlock);
      }
    }
  } else {
    console.error('Invalid event target:', event.target);
  }
}


// DELETE BUTTON
const deleteBtn = document.getElementById('delete-btn');

// Handle click
deleteBtn.addEventListener('click', () => {

  // Get dragDivs
  const dragDivs = document.querySelectorAll('.dragMe');

  // Loop through and remove
  for (let i = 0; i < dragDivs.length; i++) {
    dragDivs[i].remove();
  }

});

// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');

// handle click
saveBtn.addEventListener('click', () => {
  saveToXML();
})


function saveToXML() {
  var columns = document.querySelectorAll('.col:not(.fixed)'); // Select all columns except the fixed one
  var xmlContent = '<data>';

  columns.forEach(function (column, index) {
    var columnContent = column.innerHTML;
    xmlContent += '<column>' + wrapInCDATA(columnContent) + '</column>';
  });

  xmlContent += '</data>';

  var blob = new Blob([xmlContent], { type: 'application/xml' });

  var downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'savedData.xml';
  downloadLink.click();
}

function wrapInCDATA(content) {
  return '<![CDATA[' + content + ']]>';
}


// LOAD BUTTON 
const loadBtn = document.getElementById('load-btn');

// handle click
loadBtn.addEventListener('click', () => {
  loadFromXML();
})

function loadFromXML() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xml';

  fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var xmlContent = e.target.result;
        parseXML(xmlContent);
      };

      reader.readAsText(file);
    }
  });

  fileInput.click();
}

function parseXML(xmlContent) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  var columns = xmlDoc.querySelectorAll('data > *');

  columns.forEach(function (columnContent, index) {
    // Adjusted to use zero-based indexing for consistency
    var columnIndex = index + 1;
    var correspondingColumn = document.querySelector('.col:not(.fixed):nth-child(' + (columnIndex + 2) + ')');

    if (correspondingColumn) {
      correspondingColumn.innerHTML = columnContent.textContent;

      // Remove and reattach event listeners to prevent duplicates
      correspondingColumn.removeEventListener('drop', drop);
      correspondingColumn.removeEventListener('dragover', allowDrop);
      correspondingColumn.removeEventListener('dragleave', removeDragOver);

      correspondingColumn.addEventListener('drop', drop);
      correspondingColumn.addEventListener('dragover', allowDrop);
      correspondingColumn.addEventListener('dragleave', removeDragOver);
    }
  });
}
