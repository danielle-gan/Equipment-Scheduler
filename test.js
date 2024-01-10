window.onload = function () {
  // Ask the user for a date input
  const userDateInput = prompt('Enter a date (MM/DD/YYYY):');
  const userDate = new Date(userDateInput);

  // Check if the user provided a valid date
  if (!isNaN(userDate.getTime())) {
    populateDayLabels(userDate);
  } else {
    alert('Invalid date input. Please enter a valid date.');
  }

  highlightToday();

};

// Function to format a date as "MM/DD/YYYY"
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

function highlightToday() {
  const paragraphs = document.querySelectorAll('.day-label');

  paragraphs.forEach(paragraph => {
    if (isToday(paragraph.textContent.trim())) {
      paragraph.classList.add('highlight');
    }
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
        // grab the id of the grid cell
        var gridCell = draggedBlock.parentElement.id;

        // grab the column number and row number
        var colIndex = gridCell.substring(1, gridCell.indexOf('r'));
        var rowIndex = gridCell.substring(gridCell.indexOf('r') + 1);

        // string aggregate to get header IDs
        var gridRowHeaderID = 'c1' + 'r' + rowIndex;
        var gridColHeaderID = 'c' + colIndex + 'r1';

        // take the inside of the headers
        var gridRowHeader = document.getElementById(gridRowHeaderID).textContent;
        var gridColHeader = document.getElementById(gridColHeaderID).textContent;

        //assign them to the data atttributes
        draggedBlock.setAttribute('data-grid-colheader', gridColHeader);
        draggedBlock.setAttribute('data-grid-rowheader', gridRowHeader);

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

// to make sure each div is unique
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
const artValue = getSelectedRadioValue('art');

const proofsent = document.getElementsByName("proofsent");
const proofsentValue = getSelectedRadioValue('proofsent');

const proofapp = document.getElementsByName("proofapp");
const proofappValue = getSelectedRadioValue('proofapp');

const mats = document.getElementsByName("mats");
const matsValue = getSelectedRadioValue('mats');

const dies = document.getElementsByName("dies");
const diesValue = getSelectedRadioValue('dies');

const plates = document.getElementsByName("plates");
const platesValue = getSelectedRadioValue('plates');

const purchase = document.getElementsByName("purchase");
const purchaseValue = getSelectedRadioValue('purchase');

function getSelectedRadioValue(groupName) {
  const radioGroup = document.getElementsByName(groupName);

  for (const radioButton of radioGroup) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }

  // Return null if no radio button is selected
  return null;
}

const button = document.getElementById('addBtn');
const dragMe = document.getElementById('dragMe');
const flex = document.getElementById('itemStage');

let details = '';


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

  dragDiv.dataset.details = details + dragDiv.id;

  dragDiv.addEventListener('click', () => showModal(dragDiv.dataset.details));

  makeDivsDraggable();
}

function showModal(details) {
  if (!document.getElementById('modal')) {

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML += details;

    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
      modal.remove(); // Remove modal on click
    });
  }
}

button.addEventListener('click', function (event) {
  event.preventDefault();
  createAndAppendDiv(jobNum, customer, runTime, shipDate, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, flex);

})


// Function to save XML content
function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData');

  if (fileName !== null) {
    var xmlContent = localStorage.getItem('loadedXML');

    if (xmlContent) {
      // Create a Blob and a download link
      var blob = new Blob([xmlContent], { type: 'application/xml' });
      var downloadLink = document.createElement('a');

      downloadLink.download = fileName + '.xml';
      downloadLink.href = window.URL.createObjectURL(blob);

      // Trigger a click on the download link
      downloadLink.click();
    } else {
      alert('No XML content to save.');
    }
  }
}

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

// Function to load XML and save its contents to local storage
function loadXMLAndSaveToLocalStorage() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xml';

  fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var xmlContent = e.target.result;

        // Save XML content to local storage
        localStorage.setItem('loadedXML', xmlContent);

        // You can also parse the XML content and perform additional actions if needed
        parseXML(xmlContent);
      };

      reader.readAsText(file);
    }
  });

  // Trigger a click on the file input to open the file chooser dialog
  fileInput.click();
}

function parseXML(xmlContent) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  var jobs = xmlDoc.querySelectorAll('job');

  jobs.forEach(function (job) {

    var jobNum = job.querySelector('jobNum').textContent;
    var customer = job.querySelector('customer').textContent;
    var runTime = job.querySelector('runTime').textContent;
    var shipDate = job.querySelector('shipDate').textContent;
    // var gridCell = job.querySelector('gridCell').textContent;
    var gridCol = job.querySelector('gridColheader').textContent;
    var gridRow = job.querySelector('gridRowheader').textContent;
    var description = job.querySelector('generalDesc').textContent;
    var numCopies = job.querySelector('numCopies').textContent;
    var linearFootage = job.querySelector('linearFootage').textContent;
    var numColors = job.querySelector('numColors').textContent;
    var dollarValue = job.querySelector('dollarValue').textContent;
    var printCyl = job.querySelector('printCyl').textContent;
    var toolCyl = job.querySelector('toolCyl').textContent;
    // var artValue = job.querySelector('art').textContent;
    // var proofsentValue = job.querySelector('proofsent').textContent;
    // var proofappValue = job.querySelector('proofapp').textContent;
    // var matsValue = job.querySelector('mats').textContent;
    // var diesValue = job.querySelector('dies').textContent;
    // var platesValue = job.querySelector('plates').textContent;
    // var purchaseValue = job.querySelector('purchase').textContent;

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
        if (gridRow.trim() == f.textContent) {

          var rowIndex = f.parentElement.id.substring(f.parentElement.id.indexOf('r') + 1);
          var newGridParentID = 'c' + colIndex + 'r' + rowIndex;
          createAndAppendDiv2(jobNum, customer, runTime, shipDate, gridCol, gridRow,  description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, newGridParentID);
        }
      });
    }
  });
}

function createAndAppendDiv2(jobNum, customer, runTime, shipDate, gridCol, gridRow, description, numCopies, linearFootage, numColors, dollarValue, printCyl, toolCyl, artValue, proofsentValue, proofappValue, matsValue, diesValue, platesValue, purchaseValue, appendTarget) {

  var appendTarget = document.getElementById(appendTarget);
  console.log(appendTarget);

  // Create a draggable div
  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');
  dragDiv.classList.add('dragged');

  dragDiv.setAttribute('data-job-num', jobNum);
  dragDiv.setAttribute('data-customer', customer);
  dragDiv.setAttribute('data-run-time', runTime);
  dragDiv.setAttribute('data-ship-date', shipDate);
  // dragDiv.setAttribute('data-grid-cell', appendTarget.id); 
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
  dragDiv.addEventListener('click', () => showModal(dragDiv.dataset.details));
  makeDivsDraggable();
}

// SAVE BUTTON 
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  saveToXML();
})

// Function to append new <job> elements to the <data> element
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

function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData');

  if (fileName !== null) {

    // Check if there's existing XML content in local storage
    var existingXmlString = localStorage.getItem('loadedXML');

    if (existingXmlString) {
      console.log("existing xml");
      // Parse the existing XML content
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(existingXmlString, 'application/xml');

      // Find or create the <data> element
      var dataElement = xmlDoc.querySelector('data');
      if (!dataElement) {
        dataElement = xmlDoc.createElement('data');
        xmlDoc.appendChild(dataElement);
      }

      // Append new <job> elements to the <data> element
      appendJobsToData(xmlDoc);

      // Serialize the updated XML back to string
      var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);

      // Save the updated XML content back to local storage
      localStorage.setItem('loadedXML', updatedXmlString);
    } else {
      // Save as a fresh XML file
      var xmlDoc = document.implementation.createDocument(null, 'data', null);
      appendJobsToData(xmlDoc);

      // Serialize the XML to string
      var freshXmlString = new XMLSerializer().serializeToString(xmlDoc);

      // Create a Blob and a download link
      var blob = new Blob([freshXmlString], { type: 'application/xml' });
      var downloadLink = document.createElement('a');

      downloadLink.download = fileName + '.xml';
      downloadLink.href = window.URL.createObjectURL(blob);

      // Trigger a click on the download link
      downloadLink.click();
    }
  }
}

// LOAD BUTTON 
const loadBtn = document.getElementById('load-btn');
loadBtn.addEventListener('click', () => {
  loadXMLAndSaveToLocalStorage();
})

// CHANGE DATE BUTTON
const dateBtn = document.getElementById('date-btn');
dateBtn.addEventListener('click', () => {
  const userDateInput = prompt('Enter a date (MM/DD/YYYY):');
  const userDate = new Date(userDateInput);

  // Check if the user provided a valid date
  if (!isNaN(userDate.getTime())) {
    populateDayLabels(userDate);
  } else {
    alert('Invalid date input. Please enter a valid date.');
  }

  highlightToday();
})

//On loading in, divs are no longer draggable, hence why this function is necessary
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
    const draggedGenDesc = draggedElement.dataset.generalDesc;
    const draggedHeader = draggedElement.dataset.gridColheader;

    // Remove the corresponding job from local storage
    removeJobFromLocalStorage(draggedJobNum, draggedGenDesc, draggedHeader);

    // Remove the element from the DOM
    draggedElement.remove();
  }
}

// Function to remove a job from local storage based on multiple attributes
function removeJobFromLocalStorage(jobNum, generalDesc, gridColHeader) {
  // Retrieve the existing XML content from local storage
  var storedXmlContent = localStorage.getItem('loadedXML');

  if (storedXmlContent) {
    // Parse the XML string to an XML object
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(storedXmlContent, 'application/xml');

    // Find the job with the specified attributes
    var jobs = xmlDoc.querySelectorAll('job');

    console.log(jobs[0].innerHTML); // this is giving me the string that I need
    var jobToRemove;

    jobs.forEach(function (job) {
      var jobNumInXml = job.querySelector('jobNum').textContent
      // var generalDescInXml = new DOMParser().parseFromString(job.innerHTML, 'application/xml').querySelector('generalDesc').textContent;
      // var gridColHeaderInXml = new DOMParser().parseFromString(job.innerHTML, 'application/xml').querySelector('gridColheader').textContent;

      if (
        jobNumInXml === jobNum
        // &&
        // generalDescInXml === generalDesc &&
        // gridColHeaderInXml === gridColHeader
      ) {
        jobToRemove = job;
      }
    });

    if (jobToRemove) {
      jobToRemove.remove();

      // Serialize the updated XML back to string
      var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);

      // Save the updated XML content back to local storage
      localStorage.setItem('loadedXML', updatedXmlString);
    }
  }
}
