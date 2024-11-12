// Assign variables to html elements
const deleteButtons = document.querySelectorAll("button[id^=js__delete]");
const input = document.querySelector("input");
const addButton = document.querySelector("button[id^=js__add]");
const ul = document.querySelector("ul");
const warning = document.querySelector(".alert");

// Add click event to button, calls add item function
addButton.addEventListener('click', () => addElement(input.value));

// Add keypress event to input
input.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addElement(input.value);
  };
});

// Add delete button functionality
deleteButtons.forEach(btn => {
  btn.addEventListener('click', event => deleteElement(event));
});

const deleteElement = (event) => {
  const item = event.target.parentNode;
  fetchItem(item.querySelector('span').textContent, '/', 'delete');
  item.remove();
  input.focus();
};

// Make request to backend
const fetchItem = async (item, url, method) => {
  let response;
  try {
    response = await fetch(url, {
      method: method,
      body: JSON.stringify(item)
    });
  } catch (error) {
    console.error(error.message);
  };
  if (response?.ok) {
    console.log(`${method} ${item}`);
  } else {
    throw new Error (`Response status: ${response.status}`);
  };
};

// Add new shopping list item
const addElement = (item) => {

    if (item.length === 0) {
    warning.classList.remove("d-none");
    setTimeout(() => {
      warning.classList.add("d-none");
    }, 2000)
    return;
  };

  fetchItem(item, '/', 'post');

  // Create new list item using input value
  const span = document.createElement('span');
  const li = document.createElement('li');
  li.setAttribute("class", "list-group-item d-flex justify-content-between p-3");
  span.textContent = input.value;

  input.value = "";

  // Create span and delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.id = "js__delete-button";
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("class", "btn btn-primary");
  
  // Append new elements to ul
  li.appendChild(span);
  li.appendChild(deleteButton);
  ul.appendChild(li);

  // Add event listener to delete button
  deleteButton.addEventListener('click', event => deleteElement(event));

  // Return cursor to input
  input.focus();
}

