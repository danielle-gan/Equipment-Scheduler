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

const button = document.getElementById('addBtn');
const dragMe = document.getElementById('dragMe');
const flex = document.getElementById('itemStage');


function createAndAppendDiv(jobNum, customer, runTime, shipDate, schedDate, machine) {
  // Create a draggable div
  var dragDiv = document.createElement('div');
  dragDiv.classList.add('dragMe');

  // Set attributes based on job data
  dragDiv.setAttribute('data-job-num', jobNum);
  dragDiv.setAttribute('data-customer', customer);
  dragDiv.setAttribute('data-run-time', runTime);
  dragDiv.setAttribute('data-ship-date', shipDate);
  dragDiv.setAttribute('data-sched-date', schedDate);
  dragDiv.setAttribute('data-machine', machine);

  // Display relevant information in the div
  dragDiv.innerHTML += `<p>Job Number: ${jobNum.value}</p>
                       <p>Customer: ${customer.value}</p>
                       <p>Run Time: ${runTime.value}</p>
                       <p>Ship Date: ${shipDate.value}</p>
                       <p>Sched Date: ${schedDate.value}</p>
                       <p>Machine: ${machine.value}</p>`;


  const maxId = findMaxId();
  dragDiv.id = `drag${maxId + 1}`;

  dragDiv.draggable = true;

  // Add div to screen
  var flex = document.getElementById('itemStage');
  flex.appendChild(dragDiv);

  dragDiv.addEventListener('dragstart', dragStart);

}

button.addEventListener('click', function(event) {
  event.preventDefault();
  createAndAppendDiv(jobNum, customer, runTime, shipDate, schedDate, machine);
})


function saveToXML() {
  var fileName = prompt('Enter a filename:', 'ScheduleData');

  if (fileName !== null) {
    var dragDivs = document.querySelectorAll('.dragMe');
    var xmlContent = '<data>';

    dragDivs.forEach(function (dragDiv) {
      xmlContent += '<job>';
      
      // Assuming JobNum, Customer, RunTime, ShipDate, SchedDate, and Machine are the IDs of your div elements
      xmlContent += '<JobNum>' + wrapInCDATA(dragDiv.querySelector('#JobNum').textContent) + '</JobNum>';
      xmlContent += '<Customer>' + wrapInCDATA(dragDiv.querySelector('#Customer').textContent) + '</Customer>';
      xmlContent += '<RunTime>' + wrapInCDATA(dragDiv.querySelector('#RunTime').textContent) + '</RunTime>';
      xmlContent += '<ShipDate>' + wrapInCDATA(dragDiv.querySelector('#ShipDate').textContent) + '</ShipDate>';
      xmlContent += '<SchedDate>' + wrapInCDATA(dragDiv.querySelector('#SchedDate').textContent) + '</SchedDate>';
      xmlContent += '<Machine>' + wrapInCDATA(dragDiv.querySelector('#Machine').textContent) + '</Machine>';

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


function parseXML(xmlContent) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

  var jobs = xmlDoc.querySelectorAll('job');

  jobs.forEach(function (job) {
    // Assuming that you have elements inside each <job> for JobNum, Customer, RunTime, ShipDate, SchedDate, and Machine
    var jobNum = job.querySelector('JobNum').textContent;
    var customer = job.querySelector('Customer').textContent;
    var runTime = job.querySelector('RunTime').textContent;
    var shipDate = job.querySelector('ShipDate').textContent;
    var schedDate = job.querySelector('SchedDate').textContent;
    var machine = job.querySelector('Machine').textContent;

    // Now you can use these values to create and append your div to the page
    createAndAppendDiv(jobNum, customer, runTime, shipDate, schedDate, machine);
  });

  makeDivsDraggable();
}


function wrapInCDATA(content) {
  return '<![CDATA[' + content + ']]>';
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

// On dropping into the trash can
function deleteDraggedElement(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(draggedId);

  if (draggedElement) {
    draggedElement.remove();
  }
}
