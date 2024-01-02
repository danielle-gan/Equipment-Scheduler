// Initialize an XML document
const xmlDoc = document.implementation.createDocument(null, 'data', null);

function addJob() {
  // Get form inputs
  const jobNumber = document.getElementById('jobNumber').value;
  const customerName = document.getElementById('customerName').value;

  // Create a new job element
  const jobElement = xmlDoc.createElement('job');
  jobElement.setAttribute('number', jobNumber);

  const customerElement = xmlDoc.createElement('customer');
  customerElement.textContent = customerName;

  // Append elements to the root
  jobElement.appendChild(customerElement);
  xmlDoc.documentElement.appendChild(jobElement);

  // Clear form inputs
  document.getElementById('jobNumber').value = '';
  document.getElementById('customerName').value = '';

  // Update job list
  updateJobList();

  console.log('Job added:', jobNumber, customerName);
}

function updateJobList() {
  const jobList = document.getElementById('jobList');

  // Clear existing list
  jobList.innerHTML = '';

  // Populate job list
  const jobs = xmlDoc.getElementsByTagName('job');
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const jobNumber = job.getAttribute('number');
    const customerName = job.querySelector('customer').textContent;

    const listItem = document.createElement('li');
    listItem.textContent = `Job ${jobNumber}: ${customerName}`;

    // Add a delete button for each job
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteJob(job));
    listItem.appendChild(deleteButton);

    jobList.appendChild(listItem);
  }
}

function deleteJob(job) {
  xmlDoc.documentElement.removeChild(job);

  // Update job list
  updateJobList();

  console.log('Job deleted:', job.getAttribute('number'));
}

function saveToXML() {
  // Convert XML document to string
  const xmlString = new XMLSerializer().serializeToString(xmlDoc);

  // Initiate download
  download('data.xml', xmlString);

  console.log('XML saved:', xmlString);
}

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}