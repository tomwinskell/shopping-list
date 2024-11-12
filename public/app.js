// Assign variables to html elements
const deleteButtons = document.querySelectorAll("button[id^=js__delete]");
const input = document.querySelector("input");
const addButton = document.querySelector("button[id^=js__add]");
const ul = document.querySelector("ul");

// Add click event to button, calls add item function
addButton.addEventListener('click', () => addElement(input.value));

// Add keypress event to input
input.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    addButton.click();
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
  fetchItem(item, '/', 'post');

  // Create new list item using input value
  const span = document.createElement('span');
  const li = document.createElement('li');
  span.textContent = input.value;

  input.value = "";

  // Create span and delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.id = "js__delete-button";
  deleteButton.setAttribute("type", "button"); 
  
  // Append new elements to ul
  li.appendChild(span);
  li.appendChild(deleteButton);
  ul.appendChild(li);

  // Add event listener to delete button
  deleteButton.addEventListener('click', event => deleteElement(event));

  // Return cursor to input
  input.focus();
}

