const input = document.getElementById('itemInput');
const button = document.getElementById('addBtn');

const dragMe = document.getElementById('dragMe');



// input.addEventListener('input', () => {
//   if(input.value.length > 0) {
//     button.disabled = false; 
//   } else {
//     button.disabled = true;
//   }
// });


button.addEventListener('click', () => {

    dragMe.style.display = 'flex';

    const text = input.value;

    const p = document.createElement('p');
    p.textContent = text;
    
    dragMe.appendChild(p);
    
    input.value = '';

  });

