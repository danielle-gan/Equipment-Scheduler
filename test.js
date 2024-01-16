window.onload = function () {
  const userDateInput = prompt('Enter a date (MM/DD/YYYY):');
  var userDate = new Date(userDateInput);

  // Check if the user provided a valid date, otherwise use today's date
  if (!isNaN(userDate.getTime())) {
    populateDayLabels(userDate);
  }
  else {
    userDate = new Date();
    populateDayLabels(userDate);
  }

  highlightToday();
  localStorage.removeItem('loadedXML');

  // Initialize 'loadedXML' in local storage
  var initialXmlString = `<data>
  <machine1>Machine 1</machine1>
  <machine2>Machine 2</machine2>
  <machine3>Machine 3</machine3>
  <machine4>Machine 4</machine4>
  <machine5>Machine 5</machine5>
  </data>`;

  localStorage.setItem('loadedXML', initialXmlString);
};

function appendJobToXML(xmlDoc, draggedBlock) {
  // Create a new job element
  var jobElement = xmlDoc.createElement('job');

  // Extract data attributes from dragged block and set as attributes in job element
  for (var attribute in draggedBlock.dataset) {
    var attributeElement = xmlDoc.createElement(attribute);
    attributeElement.textContent = draggedBlock.dataset[attribute];
    jobElement.appendChild(attributeElement);
  }

  // Find or create the <data> element
  var dataElement = xmlDoc.querySelector('data');
  if (!dataElement) {
    dataElement = xmlDoc.createElement('data');
    xmlDoc.documentElement.appendChild(dataElement);
  }

  // Append the new job element to the <data> element
  dataElement.appendChild(jobElement);
}

// to make sure each div id is unique
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

// INITIALIZING GLOBAL CONSTANTS AND VARIABLES
// Form Inputs  (text)
const jobNum = document.getElementById('JobNum');
const customer = document.getElementById('Customer');
const runTime = document.getElementById('RunTime');
const shipDate = document.getElementById('ShipDate');
const description = document.getElementById('GeneralDesc');
const numCopies = document.getElementById('NumCopies');
const linearFootage = document.getElementById('LinearFootage');
const numColors = document.getElementById('NumColors');
const dollarValue = document.getElementById('DollarValue');
const printCyl = document.getElementById('PrintCylinder');
const toolCyl = document.getElementById('ToolCylinder');
// Form Inputs (radio controls)
const art = document.getElementsByName("art");
const proofsent = document.getElementsByName("proofsent");
const proofapp = document.getElementsByName("proofapp");
const mats = document.getElementsByName("mats");
const dies = document.getElementsByName("dies");
const plates = document.getElementsByName("plates");
const purchase = document.getElementsByName("purchase");

const dragMe = document.getElementById('dragMe');
const flex = document.getElementById('itemStage');
let draggedBlock;
let details = '';

// BUTTONS
//ADD BUTTON
const addbutton = document.getElementById('addBtn');
addbutton.addEventListener('click', function (event) {
  event.preventDefault();
  const artValue = getSelectedRadioValue('art');
  const proofsentValue = getSelectedRadioValue('proofsent');
  const proofappValue = getSelectedRadioValue('proofapp');
  const matsValue = getSelectedRadioValue('mats');
  const diesValue = getSelectedRadioValue('dies');
  const platesValue = getSelectedRadioValue('plates');
  const purchaseValue = getSelectedRadioValue('purchase');
  createAndAppendDiv(jobNum, customer, runTime, shipDate, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, flex);
  resetForm();
})

//CLEAR BUTTON
const clrButton = document.getElementById('clearBtn');
clrButton.addEventListener('click', function (event) {
  event.preventDefault();
  resetForm();
})

// PRINT BUTTON
var printButton = document.getElementById('print-btn');
printButton.addEventListener('click', () => window.print());
// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  saveToXML();
})
// LOAD BUTTON 
const loadBtn = document.getElementById('load-btn');
loadBtn.addEventListener('click', () => {
  loadXMLintoLocalStorage();
})

function getSelectedRadioValue(groupName) {
  const radioGroup = document.getElementsByName(groupName);

  for (const radioButton of radioGroup) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
  return null;
}

// Get all radio groups with the class 'toggle-radio'
const radioGroups = document.querySelectorAll('.toggle-radio');
radioGroups.forEach((radioGroup) => {
  // Get the radio inputs within the current radio group
  const radioInputs = radioGroup.querySelectorAll('input[type="radio"]');
  radioInputs.forEach((radioInput) => {
    radioInput.addEventListener('click', function () {
    });
  });
});

// for creating jobs in the DOM with the form
function createAndAppendDiv(jobNum, customer, runTime, shipDate, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, art, proofSent, proofApp, mats, dies, plates, purchase, appendTarget) {

  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.classList.add('dragged');

  dragDiv.setAttribute('data-job-num', jobNum.value);
  dragDiv.setAttribute('data-customer', customer.value);
  dragDiv.setAttribute('data-run-time', runTime.value);
  dragDiv.setAttribute('data-ship-date', shipDate.value);
  dragDiv.setAttribute('data-grid-colheader', "");
  dragDiv.setAttribute('data-grid-rowheader', "");
  dragDiv.setAttribute('data-general-desc', description.value);
  dragDiv.setAttribute('data-num-copies', numCopies.value);
  dragDiv.setAttribute('data-linear-footage', linearFootage.value);
  dragDiv.setAttribute('data-num-colors', numColors.value);
  dragDiv.setAttribute('data-dollar-value', dollarValue.value);
  dragDiv.setAttribute('data-print-cyl', printCyl.value);
  dragDiv.setAttribute('data-tool-cyl', toolCyl.value);
  dragDiv.setAttribute('data-art', art);
  dragDiv.setAttribute('data-proof-sent', proofSent);
  dragDiv.setAttribute('data-proof-app', proofApp);
  dragDiv.setAttribute('data-mats', mats);
  dragDiv.setAttribute('data-dies', dies);
  dragDiv.setAttribute('data-plates', plates);
  dragDiv.setAttribute('data-purchase', purchase);

  const label = `${jobNum.value} | ${customer.value} | ${runTime.value} | ${shipDate.value}`
  const details = `   
  <div class="flex-modal" id="modal">
  <div>
    <p>Job Number: ${jobNum.value}</p>
    <p>Customer: ${customer.value}</p>
    <p>Run Time: ${runTime.value}</p>
    <p id="ship-date">Ship Date: ${shipDate.value}</p>
    <p>Description: ${description.value}</p>
    <p>Number Of Copies: ${numCopies.value}</p>
    <p>Linear Footage: ${linearFootage.value}</p>
    <p>Number Of Colors: ${numColors.value}</p>
    <p>Dollar Value Of Job: ${dollarValue.value}</p>
    <p>Print Cylinder Size: ${printCyl.value}</p>
    <p>Tool Cylinder Size: ${toolCyl.value}</p>
  </div>
  <div id="radio-loggers">
    <p>Art?: ${art} </p>
    <p>Proof Sent?: ${proofSent} </p>
    <p>Proof Approved?: ${proofApp} </p>
    <p>Materials Ordered?: ${mats} </p>
    <p>Dies Ordered?: ${dies} </p>
    <p>Plates Ordered?: ${plates} </p>
    <p>Purchase Order?: ${purchase} </p>
  </div>
</div>
`
  // Display relevant information in the div
  dragDiv.innerHTML += label

  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.draggable = true;

  appendTarget.appendChild(dragDiv);
  dragDiv.addEventListener('dragstart', dragStart);

  dragDiv.dataset.details = details;

  dragDiv.addEventListener('click', () => showModal(dragDiv, dragDiv.dataset.details));

  makeDivsDraggable();
}

// for divs added on load
function createAndAppendDiv2(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, appendTarget) {

  var appendTarget = document.getElementById(appendTarget);

  // Create a draggable div
  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.classList.add('dragged');

  dragDiv.setAttribute('data-job-num', jobNum);
  dragDiv.setAttribute('data-customer', customer);
  dragDiv.setAttribute('data-run-time', runTime);
  dragDiv.setAttribute('data-ship-date', shipDate);
  dragDiv.setAttribute('data-grid-colheader', gridCol);
  dragDiv.setAttribute('data-grid-rowheader', gridRow);
  dragDiv.setAttribute('data-general-desc', description);
  dragDiv.setAttribute('data-num-copies', numCopies);
  dragDiv.setAttribute('data-linear-footage', linearFootage);
  dragDiv.setAttribute('data-num-colors', numColors);
  dragDiv.setAttribute('data-dollar-value', dollarValue);
  dragDiv.setAttribute('data-print-cyl', printCyl);
  dragDiv.setAttribute('data-tool-cyl', toolCyl);
  dragDiv.setAttribute('data-art', artValue);
  dragDiv.setAttribute('data-proof-sent', proofsentValue);
  dragDiv.setAttribute('data-proof-app', proofappValue);
  dragDiv.setAttribute('data-mats', matsValue);
  dragDiv.setAttribute('data-dies', diesValue);
  dragDiv.setAttribute('data-plates', platesValue);
  dragDiv.setAttribute('data-purchase', purchaseValue);

  const label = `${jobNum} | ${customer} | ${runTime} | ${shipDate}`
  const details = `
  <button id="closeModalBtn" class="close-modal-button"> X </button>
  <div class="flex-modal" id="modal">
    <div>
      <p>Job Number: ${jobNum}</p>
      <p>Customer: ${customer}</p>
      <p>Run Time: ${runTime}</p>
      <p id="ship-date">Ship Date: ${shipDate}</p>
      <p>Description: ${description}</p>
      <p>Number Of Copies: ${numCopies}</p>
      <p>Linear Footage: ${linearFootage}</p>
      <p>Number Of Colors: ${numColors}</p>
      <p>Dollar Value Of Job: ${dollarValue}</p>
      <p>Print Cylinder Size: ${printCyl}</p>
      <p>Tool Cylinder Size: ${toolCyl}</p>
    </div>
    <div id="radio-loggers">
      <p>Art?:${artValue} </p>
      <p>Proof Sent?:${proofsentValue} </p>
      <p>Proof Approved?:${proofappValue} </p>
      <p>Materials Ordered?:${matsValue} </p>
      <p>Dies Ordered?:${diesValue} </p>
      <p>Plates Ordered?:${platesValue} </p>
      <p>Purchase Order?:${purchaseValue} </p>
    </div>
  </div>
  `
  // Display main info
  dragDiv.innerHTML += label;

  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  // make the div draggable
  dragDiv.draggable = true;

  //append to item stage (next to + button)
  appendTarget.appendChild(dragDiv);

  dragDiv.addEventListener('dragstart', dragStart);
  //attach extra details to the div that display on click
  dragDiv.dataset.details = details;
  dragDiv.addEventListener('click', () => showModal(dragDiv, dragDiv.dataset.details));
  makeDivsDraggable();

  // color conditioning for the divs
  pastDateChecker(dragDiv);
  statusChecker(dragDiv);
}

// Show modal with extra details on click
function showModal(dragdiv, details) {

  if (!document.getElementById('modal')) {
    console.log("open modal");

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML += details;

    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
      modal.remove();
    });

    // Repopulate form with clicked on div
    var jobForm = dragdiv.getAttribute('data-job-num');
    var custForm = dragdiv.getAttribute('data-customer');
    var runForm = dragdiv.getAttribute('data-run-time');
    var shipForm = dragdiv.getAttribute('data-ship-date');
    var descForm = dragdiv.getAttribute('data-general-desc');
    var copiesForm = dragdiv.getAttribute('data-num-copies');
    var footageForm = dragdiv.getAttribute('data-linear-footage');
    var colorsForm = dragdiv.getAttribute('data-num-colors');
    var dollarsForm = dragdiv.getAttribute('data-dollar-value');
    var printcylForm = dragdiv.getAttribute('data-print-cyl');
    var toolcylForm = dragdiv.getAttribute('data-tool-cyl');
    var artForm = dragdiv.getAttribute('data-art');
    var proofsentForm = dragdiv.getAttribute('data-proof-sent');
    var proofappForm = dragdiv.getAttribute('data-proof-app');
    var matsForm = dragdiv.getAttribute('data-mats');
    var diesForm = dragdiv.getAttribute('data-dies');
    var platesForm = dragdiv.getAttribute('data-plates');
    var purchaseForm = dragdiv.getAttribute('data-purchase');

    if (artForm === 'YES') {
      document.getElementById('art-yes').checked = true;

    } else {
      document.getElementById('art-no').checked = true;
    }

    if (proofsentForm === 'YES') {
      document.getElementById('proof-sent-yes').checked = true;
    } else {
      document.getElementById('proof-sent-no').checked = true;
    }

    if (proofappForm === 'YES') {
      document.getElementById('proof-app-yes').checked = true;
    } else {
      document.getElementById('proof-app-no').checked = true;
    }

    if (matsForm === 'NO') {
      document.getElementById('mat-no').checked = true;
    } else if (matsForm === 'YES') {
      document.getElementById('mat-yes').checked = true;
    }
    else {
      document.getElementById('mat-rec').checked = true;
    }

    if (diesForm === 'NO') {
      document.getElementById('dies-no').checked = true;
    } else if (diesForm === 'YES') {
      document.getElementById('dies-yes').checked = true;
    }
    else {
      document.getElementById('dies-rec').checked = true;
    }

    if (platesForm === 'NO') {
      document.getElementById('plates-no').checked = true;
    } else if (platesForm === 'YES') {
      document.getElementById('plates-yes').checked = true;
    }
    else {
      document.getElementById('plates-rec').checked = true;
    }

    if (purchaseForm === 'YES') {
      document.getElementById('purchase-yes').checked = true;
    } else {
      document.getElementById('purchase-no').checked = true;
    }

    document.getElementById('JobNum').value = jobForm;
    document.getElementById('Customer').value = custForm;
    document.getElementById('RunTime').value = runForm;
    document.getElementById('ShipDate').value = shipForm;
    document.getElementById('GeneralDesc').value = descForm;
    document.getElementById('NumCopies').value = copiesForm;
    document.getElementById('LinearFootage').value = footageForm;
    document.getElementById('NumColors').value = colorsForm;
    document.getElementById('DollarValue').value = dollarsForm;
    document.getElementById('PrintCylinder').value = printcylForm;
    document.getElementById('ToolCylinder').value = toolcylForm;

    // Color Conditioning for the modal 
    var borderColor = window.getComputedStyle(dragdiv).getPropertyValue('border-color');
    var color = window.getComputedStyle(dragdiv).getPropertyValue('color');
    modal.style.borderColor = borderColor;
    var shipDateID = document.getElementById('ship-date');
    shipDateID.style.color = color;

  }
}

// reset form entries 
function resetForm() {
  // Select all input elements inside the form
  var formInputs = document.querySelectorAll('#gridForm input');

  formInputs.forEach(function (input) {
    if (input.type === 'radio') {
      // Check the radio values that are NO
      if (input.value === 'NO') {
        input.checked = true;
      }
    } else {
      // Set input value to ""
      input.value = "";
    }
  });
}

// called on clicking "load schedule" and then selecting an xml file
function loadExistingXML(callback) {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xml';

  fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var xmlContent = e.target.result;
        if (typeof callback === 'function') {
          callback(xmlContent);
        }
      };
      reader.readAsText(file);
    }
  });

  fileInput.click();
}

//load XML from file and save its contents to local storage
function loadXMLintoLocalStorage() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xml';

  fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var xmlContent = e.target.result;
        localStorage.setItem('loadedXML', xmlContent);
        clearDragMeDivs('.dragInto');
        parseXML2(xmlContent);
      };
      reader.readAsText(file);
    }
  });

  fileInput.click();
}

// any other time the local storage needs to be parsed onto the screen
function parseXML(xmlContent) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  var jobs = xmlDoc.querySelectorAll('job');

  jobs.forEach(function (job) {

    var jobNum = job.querySelector('jobNum').textContent;
    var customer = job.querySelector('customer').textContent;
    var runTime = job.querySelector('runTime').textContent;
    var shipDate = job.querySelector('shipDate').textContent;
    var gridCol = job.querySelector('gridColheader').textContent;
    var gridRow = job.querySelector('gridRowheader').textContent;
    var description = job.querySelector('generalDesc').textContent;
    var numCopies = job.querySelector('numCopies').textContent;
    var linearFootage = job.querySelector('linearFootage').textContent;
    var numColors = job.querySelector('numColors').textContent;
    var dollarValue = job.querySelector('dollarValue').textContent;
    var printCyl = job.querySelector('printCyl').textContent;
    var toolCyl = job.querySelector('toolCyl').textContent;
    var artValue = job.querySelector('art').textContent;
    var proofsentValue = job.querySelector('proofSent').textContent;
    var proofappValue = job.querySelector('proofApp').textContent;
    var matsValue = job.querySelector('mats').textContent;
    var diesValue = job.querySelector('dies').textContent;
    var platesValue = job.querySelector('plates').textContent;
    var purchaseValue = job.querySelector('purchase').textContent;

    placeDivOnGrid(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue);
  });
  makeDivsDraggable();
}

//  for loading in using the load schedule button -- this one grabs the machine names from the XML doc and populates the row headers 
function parseXML2(xmlContent) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  var jobs = xmlDoc.querySelectorAll('job');
  var machine1 = xmlDoc.querySelector('machine1').textContent;
  var machine2 = xmlDoc.querySelector('machine2').textContent;
  var machine3 = xmlDoc.querySelector('machine3').textContent;
  var machine4 = xmlDoc.querySelector('machine4').textContent;
  var machine5 = xmlDoc.querySelector('machine5').textContent;

  var machine1DOM = document.getElementById('machine1');
  var machine2DOM = document.getElementById('machine2');
  var machine3DOM = document.getElementById('machine3');
  var machine4DOM = document.getElementById('machine4');
  var machine5DOM = document.getElementById('machine5');

  machine1DOM.innerHTML = machine1;
  machine2DOM.innerHTML = machine2;
  machine3DOM.innerHTML = machine3;
  machine4DOM.innerHTML = machine4;
  machine5DOM.innerHTML = machine5;

  jobs.forEach(function (job) {

    var jobNum = job.querySelector('jobNum').textContent;
    var customer = job.querySelector('customer').textContent;
    var runTime = job.querySelector('runTime').textContent;
    var shipDate = job.querySelector('shipDate').textContent;
    var gridCol = job.querySelector('gridColheader').textContent;
    var gridRow = job.querySelector('gridRowheader').textContent;
    var description = job.querySelector('generalDesc').textContent;
    var numCopies = job.querySelector('numCopies').textContent;
    var linearFootage = job.querySelector('linearFootage').textContent;
    var numColors = job.querySelector('numColors').textContent;
    var dollarValue = job.querySelector('dollarValue').textContent;
    var printCyl = job.querySelector('printCyl').textContent;
    var toolCyl = job.querySelector('toolCyl').textContent;
    var artValue = job.querySelector('art').textContent;
    var proofsentValue = job.querySelector('proofSent').textContent;
    var proofappValue = job.querySelector('proofApp').textContent;
    var matsValue = job.querySelector('mats').textContent;
    var diesValue = job.querySelector('dies').textContent;
    var platesValue = job.querySelector('plates').textContent;
    var purchaseValue = job.querySelector('purchase').textContent;

    placeDivOnGrid(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue);
  });
  makeDivsDraggable();
}

function placeDivOnGrid(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue) {

  var columnHeaders = Array.from(document.getElementsByClassName('day-label'));
  var rowHeaders = Array.from(document.getElementsByClassName('editable'));

  columnHeaders.forEach(function (e) {
    if (gridCol == e.textContent) {
      var colIndex = e.id.substring(1, e.id.indexOf('r'));
      rowHeaders.forEach(function (f) {
        if (gridRow == f.id) {

          var rowIndex = f.parentElement.id.substring(f.parentElement.id.indexOf('r') + 1);
          var newGridParentID = 'c' + colIndex + 'r' + rowIndex;
          createAndAppendDiv2(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, newGridParentID);
        }
      });
    }
  });
}

// Function to append new <job> elements to the <data> element (XML)
function appendJobsToData(xmlDoc) {
  var dragDivs = document.querySelectorAll('.dragMe');
  var dataElement = xmlDoc.querySelector('data');

  dragDivs.forEach(function (dragDiv) {
    var jobElement = xmlDoc.createElement('job');

    for (var attribute in dragDiv.dataset) {
      var attributeElement = xmlDoc.createElement(attribute);
      attributeElement.textContent = dragDiv.dataset[attribute].trim();
      jobElement.appendChild(attributeElement);
    }

    dataElement.appendChild(jobElement);
  });
}

// Set machine names in the xml doc to be the text of the row headers
function updateMachinesInData(xmlDoc) {
  var editableParagraphs = document.querySelectorAll('.editable');
  var dataElement = xmlDoc.querySelector('data');

  editableParagraphs.forEach(function (paragraph, index) {
    var machineElement = dataElement.querySelector('machine' + (index + 1));

    if (machineElement) {
      machineElement.textContent = paragraph.textContent;
    }
  });
}

// Save over an existing load file, or save a fresh file
function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData');

  var existingXmlString = localStorage.getItem('loadedXML');
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(existingXmlString, 'application/xml');

  updateMachinesInData(xmlDoc);

  var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
  var blob = new Blob([updatedXmlString], { type: 'application/xml' });
  var downloadLink = document.createElement('a');

  downloadLink.download = fileName + '.xml';
  downloadLink.href = window.URL.createObjectURL(blob);

  downloadLink.click();
}

// CHANGE DATE BUTTON
const dateBtn = document.getElementById('date-btn');
dateBtn.addEventListener('click', () => {
  // Create a modal container
  const modalContainer = document.createElement('div');
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalContainer.style.display = 'flex';
  modalContainer.style.justifyContent = 'center';
  modalContainer.style.alignItems = 'center';

  // Create a date picker
  const datePicker = document.createElement('input');
  datePicker.type = 'date';

  // Close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Cancel';
  closeButton.addEventListener('click', () => {
    // Remove the modal
    document.body.removeChild(modalContainer);
  });

  // Add an event listener for when the user selects a date
  datePicker.addEventListener('change', () => {
    const userDateInput = datePicker.value;
    const userDate = new Date(userDateInput);

    if (userDateInput === "" || isNaN(userDate.getTime())) {
      alert('Invalid date input. Please enter a valid date.');
    } else {
      // Add one day to the userDate
      userDate.setDate(userDate.getDate() + 1);

      // Check if loadedXML content exists in local storage
      var storedXmlContent = localStorage.getItem('loadedXML');
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(storedXmlContent, 'application/xml');
      if (storedXmlContent) {
        clearDragMeDivs('.dragInto');
        removeHighlights();
        populateDayLabels(userDate);
        highlightToday();
        updateMachinesInData(xmlDoc);
        parseXML(storedXmlContent);
      }
    }
    // Remove the modal
    document.body.removeChild(modalContainer);
  });

  // Append the date picker and the close button to the modal container
  modalContainer.appendChild(datePicker);
  modalContainer.appendChild(closeButton);

  // Append the modal container to the body
  document.body.appendChild(modalContainer);
});

function clearDragMeDivs(selector) {
  const dragMeDivs = document.querySelectorAll(selector);
  dragMeDivs.forEach((dragMeDiv) => {
    dragMeDiv.innerHTML = ''; // Remove all child elements
  });
  return
}

// DRAG AND DROP FUNCTIONALITY

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
        // grab the id of the grid cell
        var gridCell = draggedBlock.parentElement.id;

        // grab the column number and row number
        var colIndex = gridCell.substring(1, gridCell.indexOf('r'));
        var rowIndex = gridCell.substring(gridCell.indexOf('r') + 1);

        // string aggregate to get header IDs
        var gridRowHeaderID = 'c1' + 'r' + rowIndex;
        var gridColHeaderID = 'c' + colIndex + 'r1';

        // take the inside of the headers
        var gridRowHeader = document.getElementById(gridRowHeaderID).firstElementChild.id;
        var gridColHeader = document.getElementById(gridColHeaderID).textContent;

        //assign them to the data atttributes
        draggedBlock.setAttribute('data-grid-colheader', gridColHeader);
        draggedBlock.setAttribute('data-grid-rowheader', gridRowHeader);

        pastDateChecker(draggedBlock);
        statusChecker(draggedBlock);

        // Retrieve existing XML content from localStorage
        var loadedXML = localStorage.getItem('loadedXML');

        if (loadedXML) {
          // Parse the XML content
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(loadedXML, 'application/xml');

          // Append new job element to the XML
          appendJobToXML(xmlDoc, draggedBlock);

          var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
          localStorage.setItem('loadedXML', updatedXmlString);
        }
      } else {
        console.error('Invalid node or not found:', draggedBlock);
      }
    }
  } else {
    console.error('Invalid event target:', event.target);
  }
}

//On loading divs in, divs are no longer draggable, hence why this function is necessary
function makeDivsDraggable() {
  var draggables = document.querySelectorAll('.dragMe');
  draggables.forEach(function (draggable) {
    draggable.draggable = true;
    draggable.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', draggable.id);
    });
  })
}

// On dropping into the trash can
function deleteDraggedElement(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(draggedId);

  if (draggedElement) {
    // Access data attributes using the dataset property
    const draggedJobNum = draggedElement.dataset.jobNum;
    const draggedCustomer = draggedElement.dataset.customer;
    const draggedGenDesc = draggedElement.dataset.generalDesc;
    const draggedHeader = draggedElement.dataset.gridColheader;

    // remove job from local storage and remove job from the DOM
    removeJobFromLocalStorage(draggedJobNum, draggedCustomer, draggedGenDesc, draggedHeader);
    draggedElement.remove();
  }
}

// Function to remove a job from local storage based on multiple attributes
function removeJobFromLocalStorage(jobNum, customer, generalDesc, gridColHeader) {
  // Retrieve the existing XML content from local storage
  var storedXmlContent = localStorage.getItem('loadedXML');

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(storedXmlContent, 'application/xml');

    // grab all jobs
    var jobs = xmlDoc.querySelectorAll('job');
    // initialize variable for the job that's getting removed
    var jobToRemove;

    jobs.forEach(function (job) {
      var jobNumInXml = job.querySelector('jobNum').textContent;
      var custInXml = job.querySelector('customer').textContent;
      var generalDescInXml = job.querySelector('generalDesc').textContent;
      var gridColHeaderInXml = job.querySelector('gridColheader').textContent;

      if (
        jobNumInXml === jobNum && generalDescInXml === generalDesc && gridColHeaderInXml === gridColHeader && custInXml === customer
      ) {
        jobToRemove = job;
      }
    });

    if (jobToRemove) {
      jobToRemove.remove();
      var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
      localStorage.setItem('loadedXML', updatedXmlString);
    }
}

// FUNCTIONS FOR POPULATING DATE LABELS 
// Format Date MM/DD/YYYY
function formatDate(date) {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to get the next two weeks of dates from a given start date
function getNextTwoWeeks(startDate) {
  const nextTwoWeeks = [];
  for (let i = 0; i < 14; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    nextTwoWeeks.push(newDate);
  }
  return nextTwoWeeks;
}

// Function to populate "day-label" divs with the next two weeks of dates
function populateDayLabels(selectedDate) {
  const dayLabels = document.querySelectorAll('.day-label');
  const nextTwoWeeks = getNextTwoWeeks(selectedDate);

  dayLabels.forEach((label, index) => {
    label.textContent = formatDate(nextTwoWeeks[index]);
  });
}

function isToday(textContent) {
  const todayDate = new Date();
  const formattedToday = formatDate(todayDate);
  return textContent === formattedToday;
}

// FUNCTIONS FOR FORMATTING
// called on drop to see if data-shipDate attribute is before the grid column header 
function pastDateChecker(div) {
  var shipDatestr = div.getAttribute('data-ship-date');
  var schedDatestr = div.getAttribute('data-grid-colheader');

  var shipDate = new Date(shipDatestr);
  var schedDate = new Date(schedDatestr);

  if (shipDate < schedDate) {
    div.classList.add('pastDate');
  }
  else {
    div.classList.remove('pastDate');
  }
}

// checks the radio controls to see the status of the job
function statusChecker(div) {
  var statusArray = ['data-art', 'data-proof-sent', 'data-proof-app', 'data-purchase'];
  var tripleStatusArray = ['data-mats', 'data-dies', 'data-plates',]

  for (var status = 0; status < statusArray.length; status++) {
    var statusName = statusArray[status];
    if (div.getAttribute(statusName) == "YES") {
      div.classList.add('yellowToRun');
    }
    else {
      div.classList.add('badToRun');
    }
  }
  for (var status = 0; status < tripleStatusArray.length; status++) {
    var statusName = tripleStatusArray[status];
    if (div.getAttribute(statusName) == "NO") {
      div.classList.add('badToRun');
    }
    else if (div.getAttribute(statusName) == "RECEIVED") {
      div.classList.add('goodToRun');
      div.classList.remove('yellowToRun')
    }
  }
}

function highlightToday() {
  const paragraphs = document.querySelectorAll('.day-label');

  paragraphs.forEach(paragraph => {
    if (isToday(paragraph.textContent.trim())) {
      paragraph.classList.add('highlight');
    }
  });
}

function removeHighlights() {
  const divs = document.querySelectorAll('.highlight');
  divs.forEach(div => {
    div.classList.remove('highlight');
  });
}