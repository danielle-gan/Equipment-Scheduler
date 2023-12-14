// on load, load dates on the top row
window.onload = () => {
  const today = new Date();

  for (let i = 0; i <= 14; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    const formattedDate = futureDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const dayElement = document.getElementById("day" + i);
    if (dayElement) {
      dayElement.textContent = formattedDate;
    }
  }
};

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

// DELETE BUTTON
const deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', () => {
  const dragDivs = document.querySelectorAll('.dragMe');
  for (let i = 0; i < dragDivs.length; i++) {
    dragDivs[i].remove();
  }
});

// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');
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
        makeDivsDraggable();
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
    var correspondingColumn = document.querySelector('.col:not(.fixed):nth-child(' + (columnIndex + 3) + ')');

    if (correspondingColumn) {
      correspondingColumn.innerHTML = columnContent.textContent;
    }
  });
}

function makeDivsDraggable() {
  var draggables = document.querySelectorAll('.dragMe');

  draggables.forEach(function(draggable) {
    draggable.draggable = true;

    draggable.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', draggable.id);
    });
  })
}