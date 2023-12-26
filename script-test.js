// on load, load dates on the top row
window.onload = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Start from yesterday

  for (let i = 0; i <= 14; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    const formattedDate = futureDate.toLocaleDateString('en-US', {
      weekday: 'long',
      // year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const dayElement = document.getElementById("day" + i);
    if (dayElement) {
      dayElement.textContent = formattedDate;
    }
  }
  
  highlightToday();

};

// const input = document.getElementById('itemInput');

// Form Inputs
const jobNumber = document.getElementById('jobNumber');
const generalDescription = document.getElementById('generalDescription');
const numPrintCopies = document.getElementById('numPrintCopies');
const customerName = document.getElementById('customerName');
const shipDate = document.getElementById('shipDate');
const linearFootage = document.getElementById('linearFootage');
const runTime = document.getElementById('runTime');
const numColors = document.getElementById('numColors');
const dollarValue = document.getElementById('dollarValue');

const button = document.getElementById('addBtn');
const dragMe = document.getElementById('dragMe');
const flex = document.getElementById('itemStage');

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

let details = '';

// Add an Item
function createAndAppendDiv() {
  const text = `<p>${jobNumber.value} | ${generalDescription.value} | ${numPrintCopies.value} </p>`;
  details = `<p>Job Number: ${jobNumber.value} </p>
             <p>General Description: ${generalDescription.value} </p>
             <p>Number of Printed Copies: ${numPrintCopies.value} </p>
             <p>Run Time: ${runTime.value} </p>
             <p>Customer: ${customerName.value} </p>
             <p>Ship Date: ${shipDate.value} </p>
             <p>Linear Footage: ${linearFootage.value} </p>
             <p>Number of Colors: ${numColors.value} </p>
             <p>Dollar Value: ${dollarValue.value} </p>`;

  const dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');

  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.innerHTML += text;
  dragDiv.draggable = true;

  // Add div to screen
  flex.appendChild(dragDiv);

  dragDiv.addEventListener('dragstart', dragStart);
  // input.value = ''
  dragDiv.dataset.details = details;
  dragDiv.addEventListener('click', () => showModal(dragDiv.dataset.details));
}

button.addEventListener('click', function(event) {
  event.preventDefault();
  createAndAppendDiv();
  resetForm();
});

dollarValue.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    createAndAppendDiv();
    resetForm();
  }
});

function resetForm() {
jobNumber.value = '';
generalDescription.value = '';
numPrintCopies.value = '';
customerName.value = '';
shipDate.value = '';
linearFootage.value = '';
runTime.value = '';
numColors.value = '';
dollarValue.value = '';
}

function showModal(details) {
  // Create modal
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = details;

  // Append modal to body
  document.body.appendChild(modal);

  // Add close event to modal
  modal.addEventListener('click', () => {
    modal.remove(); // Remove modal on click
  });
}

// Drag and Drop Functionality
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

  if (event.target && event.target.classList) {
    event.target.classList.remove('drag-over');

    if (event.target.classList.contains('dragInto')) {
      const draggedId = event.dataTransfer.getData('text/plain');

      const draggedBlock = document.getElementById(draggedId);

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

// RESET BUTTON
document.getElementById('delete-btn').addEventListener('click', function() {
  const isConfirmed = confirm('Are you sure you want to reset the schedule?');

  if (isConfirmed) {
    location.reload();
  }
});

// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  saveToXML();
})

function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData.xml');

  if (fileName !== null) {
    var columns = document.querySelectorAll('.col'); 
    var xmlContent = '<data>';

    columns.forEach(function (column, index) {
      var columnContent = column.innerHTML;
      xmlContent += '<column>' + wrapInCDATA(columnContent) + '</column>';
    });

    xmlContent += '</data>';

    var blob = new Blob([xmlContent], { type: 'application/xml' });
    var downloadLink = document.createElement('a');
    
    downloadLink.download = fileName + '.xml';

    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.click();
  }
}

function wrapInCDATA(content) {
  return '<![CDATA[' + content + ']]>';
}

// LOAD BUTTON 
const loadBtn = document.getElementById('load-btn');
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
    var columnIndex = index;
    var correspondingColumn = document.querySelector('.col:nth-child(' + (columnIndex + 1) + ')');

    if (correspondingColumn) {
      correspondingColumn.innerHTML = columnContent.textContent;
    }
  });

  makeDivsDraggable();
  removeHighlights();
  highlightToday();
}

// Function to make divs draggable AGAIN after loading them in 
function makeDivsDraggable() {
  var draggables = document.querySelectorAll('.dragMe');

  draggables.forEach(function(draggable) {
    draggable.draggable = true;

    draggable.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', draggable.id);
    });

    draggable.addEventListener('click', function() {
      showModal(draggable.dataset.details);
    });
  })
}

function toggleEditMode(element) {
  element.contentEditable = !element.isContentEditable;
}

// Checks if it's today's date
function isToday(textContent) {
  const todayDate = new Date();
  const formattedToday = todayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    // year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return textContent.includes(formattedToday);
}

// Highlight today's date
function highlightToday() {
  const paragraphs = document.querySelectorAll('p[id^="day"]');

  paragraphs.forEach(paragraph => {
    if (isToday(paragraph.textContent.trim())) {
      paragraph.classList.add('highlight');
    }
  });
}

// Remove old highlights from previous saves
function removeHighlights() {
  const paragraphs = document.querySelectorAll('p[id^="day"]');
  paragraphs.forEach(paragraph => {
    paragraph.classList.remove('highlight');
  });
}

// On dropping into the trash can
function deleteDraggedElement(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(draggedId);

  if (draggedElement) {
    draggedElement.remove();
  }
}

