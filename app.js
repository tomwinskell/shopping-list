// Assign variables to html elements
const ul = document.querySelector("ul");
const input = document.querySelector("input");
const addButton = document.querySelector("button");

// Add click event to button, calls add item function
addButton.addEventListener('click', () => addItem());

// Add keypress event to input
input.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    addButton.click();
  }
})

// Add new shopping list item
function addItem() {

  // Create new list item using input value
  const li = document.createElement('li');
  li.textContent = input.value;

  // Create span and delete button
  const span = document.createElement('span');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  
  // Append new elements to ul
  li.appendChild(span);
  li.appendChild(deleteButton);
  ul.appendChild(li);

  // Add event listener to delete button
  deleteButton.addEventListener('click', () => removeItem(li));

  // Return cursor to input
  input.focus();
}

// Delete item from shopping list
function removeItem(li) {
  li.remove();
  input.focus();
}