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
        console.log('Parent ID:', draggedBlock.parentElement.id);
        draggedBlock.setAttribute('data-sched-date', draggedBlock.parentElement.id);
        draggedBlock.setAttribute('data-machine', draggedBlock.parentElement.id);
      } else {
        console.error('Invalid node or not found:', draggedBlock);
      }
    }
  } else {
    console.error('Invalid event target:', event.target);
  }
}

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

// Form Inputs
const jobNum = document.getElementById('JobNum');
const customer = document.getElementById('Customer');
const runTime = document.getElementById('RunTime');
const shipDate = document.getElementById('ShipDate');
const schedDate = document.getElementById('SchedDate');
const machine = document.getElementById('Machine');
const description = document.getElementById('GeneralDesc');
const numCopies = document.getElementById('NumCopies');
const linearFootage = document.getElementById('LinearFootage');
const numColors = document.getElementById('NumColors');
const dollarValue = document.getElementById('DollarValue');
const printCyl = document.getElementById('PrintCylinder');
const toolCyl = document.getElementById('ToolCylinder');

const button = document.getElementById('addBtn');
const dragMe = document.getElementById('dragMe');
const flex = document.getElementById('itemStage');

let details = '';

function createAndAppendDiv(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, appendTarget) {
  // Create a draggable div
  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.classList.add('dragged');

  // Set attributes based on job data
  if (appendTarget.value = flex) {
  dragDiv.setAttribute('data-job-num', jobNum.value);
  dragDiv.setAttribute('data-customer', customer.value);
  dragDiv.setAttribute('data-run-time', runTime.value);
  dragDiv.setAttribute('data-ship-date', shipDate.value);
  dragDiv.setAttribute('data-sched-date', "");
  dragDiv.setAttribute('data-machine', "");
  dragDiv.setAttribute('data-general-desc', description.value);
  dragDiv.setAttribute('data-num-copies', numCopies.value);
  dragDiv.setAttribute('data-linear-footage', linearFootage.value);
  dragDiv.setAttribute('data-num-colors', numColors.value);
  dragDiv.setAttribute('data-dollar-value', dollarValue.value);
  dragDiv.setAttribute('data-print-cyl', printCyl.value);
  dragDiv.setAttribute('data-tool-cyl', toolCyl.value);
}

const label = `${jobNum.value} | ${customer.value} | ${runTime.value} | ${shipDate.value}`
const details = ` <p>Job Number: ${jobNum.value}</p>
                  <p>Customer: ${customer.value}</p>
                  <p>Run Time: ${runTime.value}</p>
                  <p>Ship Date: ${shipDate.value}</p>
                  <p>Description: ${description.value}</p>
                  <p>Number Of Copies: ${numCopies.value}</p>
                  <p>Linear Footage: ${linearFootage.value}</p>
                  <p>Number Of Colors: ${numColors.value}</p>
                  <p>Dollar Value Of Job: ${dollarValue.value}</p>
                  <p>Print Cylinder Size: ${printCyl.value}</p>
                  <p>Tool Cylinder Size: ${toolCyl.value}</p>
                `
  // Display relevant information in the div
  dragDiv.innerHTML += label

  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.draggable = true;

  appendTarget.appendChild(dragDiv);

  dragDiv.addEventListener('dragstart', dragStart);

  dragDiv.dataset.details = details;
  dragDiv.addEventListener('click', () => showModal(dragDiv.dataset.details));

  makeDivsDraggable();
}

function showModal(details) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML += details;

  document.body.appendChild(modal);

  modal.addEventListener('click', () => {
    modal.remove(); // Remove modal on click
  });
}

button.addEventListener('click', function (event) {
  event.preventDefault();
  createAndAppendDiv(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, flex);
})


function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData');

  if (fileName !== null) {
    var dragDivs = document.querySelectorAll('.dragMe');
    var xmlContent = '<data>';

    dragDivs.forEach(function (dragDiv) {
      xmlContent += '<job>';

      xmlContent += '<JobNum>' + dragDiv.getAttribute('data-job-num') + '</JobNum>';
      xmlContent += '<Customer>' + dragDiv.getAttribute('data-customer') + '</Customer>';
      xmlContent += '<RunTime>' + dragDiv.getAttribute('data-run-time') + '</RunTime>';
      xmlContent += '<ShipDate>' + dragDiv.getAttribute('data-ship-date') + '</ShipDate>';
      xmlContent += '<SchedDate>' + dragDiv.getAttribute('data-sched-date') + '</SchedDate>';
      xmlContent += '<Machine>' + dragDiv.getAttribute('data-machine') + '</Machine>';
      xmlContent += '<Description>' + dragDiv.getAttribute('data-general-desc') + '</Description>';
      xmlContent += '<NumCopies>' + dragDiv.getAttribute('data-num-copies') + '</NumCopies>';
      xmlContent += '<LinearFootage>' + dragDiv.getAttribute('data-linear-footage') + '</LinearFootage>';
      xmlContent += '<NumColors>' + dragDiv.getAttribute('data-num-colors') + '</NumColors>';
      xmlContent += '<DollarValue>' + dragDiv.getAttribute('data-ship-date') + '</DollarValue>';
      xmlContent += '<PrintCyl>' + dragDiv.getAttribute('data-print-cyl') + '</PrintCyl>';
      xmlContent += '<ToolCyl>' + dragDiv.getAttribute('data-tool-cyl') + '</ToolCyl>';

      xmlContent += '</job>';
    });

    xmlContent += '</data>';

    var blob = new Blob([xmlContent], { type: 'application/xml' });
    var downloadLink = document.createElement('a');

    downloadLink.download = fileName + '.xml';

    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.click();
  }
}

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

  var jobs = xmlDoc.querySelectorAll('job');

  jobs.forEach(function (job) {

    var jobNum = job.querySelector('JobNum').textContent;
    var customer = job.querySelector('Customer').textContent;
    var runTime = job.querySelector('RunTime').textContent;
    var shipDate = job.querySelector('ShipDate').textContent;
    var schedDate = job.querySelector('SchedDate').textContent;
    var machine = job.querySelector('Machine').textContent;
    var description = job.querySelector('Description').textContent;
    var numCopies = job.querySelector('NumCopies').textContent;
    var linearFootage = job.querySelector('LinearFootage').textContent;
    var numColors = job.querySelector('NumColors').textContent;
    var dollarValue = job.querySelector('Machine').textContent;
    var printCyl = job.querySelector('Machine').textContent;
    var toolCyl = job.querySelector('Machine').textContent;

    placeDivOnGrid(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl);
  });
  makeDivsDraggable();
}

function placeDivOnGrid(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl) {
  // Construct the ID of the grid cell based on SchedDate
  var colIndex = schedDate.substring(1, schedDate.indexOf('r'));
  var rowIndex = schedDate.substring(schedDate.indexOf('r') + 1);

  // Find the corresponding grid cell
  var gridCellId = 'c' + colIndex + 'r' + rowIndex;
  var gridCell = document.getElementById(gridCellId);

  if (gridCell) {
    // Create and append the div to the corresponding grid cell
    console.log(jobNum);
    createAndAppendDiv2(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, gridCell);
  } else {
    console.error('Grid cell not found for SchedDate: ' + schedDate);
  }
}

function createAndAppendDiv2(jobNum, customer, runTime, shipDate, schedDate, machine, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, appendTarget) {
  // Create a draggable div
  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.classList.add('dragged');

  // Set attributes based on job data
  if (appendTarget.value = flex) {
  dragDiv.setAttribute('data-job-num', jobNum.value);
  dragDiv.setAttribute('data-customer', customer.value);
  dragDiv.setAttribute('data-run-time', runTime.value);
  dragDiv.setAttribute('data-ship-date', shipDate.value);
  dragDiv.setAttribute('data-sched-date', "");
  dragDiv.setAttribute('data-machine', "");
  dragDiv.setAttribute('data-general-desc', description.value);
  dragDiv.setAttribute('data-num-copies', numCopies.value);
  dragDiv.setAttribute('data-linear-footage', linearFootage.value);
  dragDiv.setAttribute('data-num-colors', numColors.value);
  dragDiv.setAttribute('data-dollar-value', dollarValue.value);
  dragDiv.setAttribute('data-print-cyl', printCyl.value);
  dragDiv.setAttribute('data-tool-cyl', toolCyl.value);
}

const label = `${jobNum} | ${customer} | ${runTime} | ${shipDate}`
const details = ` <p>Job Number: ${jobNum}</p>
                  <p>Customer: ${customer}</p>
                  <p>Run Time: ${runTime}</p>
                  <p>Ship Date: ${shipDate}</p>
                  <p>Description: ${description}</p>
                  <p>Number Of Copies: ${numCopies}</p>
                  <p>Linear Footage: ${linearFootage}</p>
                  <p>Number Of Colors: ${numColors}</p>
                  <p>Dollar Value Of Job: ${dollarValue}</p>
                  <p>Print Cylinder Size: ${printCyl}</p>
                  <p>Tool Cylinder Size: ${toolCyl}</p>
                `
  // Display relevant information in the div
  dragDiv.innerHTML += label

  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.draggable = true;

  appendTarget.appendChild(dragDiv);

  dragDiv.addEventListener('dragstart', dragStart);

  dragDiv.dataset.details = details;
  dragDiv.addEventListener('click', () => showModal(dragDiv.dataset.details));

  makeDivsDraggable();
}



// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  saveToXML();
})


// LOAD BUTTON 
const loadBtn = document.getElementById('load-btn');
loadBtn.addEventListener('click', () => {
  loadFromXML();
})


function makeDivsDraggable() {
  var draggables = document.querySelectorAll('.dragMe');

  draggables.forEach(function (draggable) {
    draggable.draggable = true;

    draggable.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', draggable.id);
    });

    draggable.addEventListener('click', function () {
      showModal(draggable.dataset.details);
    });
  })
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
