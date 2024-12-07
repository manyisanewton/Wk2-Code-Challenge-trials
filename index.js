document.addEventListener('DOMContentLoaded', () => {
  // we are getting references to HTML elements by using (document.getElementById)
  const inputField = document.getElementById('item-input');
  const addButton = document.getElementById('add-button');
  const clearButton = document.getElementById('clear-button');
  const markPurchasedButton = document.getElementById('mark-purchased-button');
  const itemList = document.getElementById('item-list');

  //  lets make a function that will help us Load saved items from Local Storage 
  //when the page loads to avoid re-inputings the items
  const loadItemsFromStorage = () => {
    const savedItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
    savedItems.forEach(({ text, purchased }) => addItemToDOM(text, purchased));
  };

  // then this will Save the current list to Local Storage 
  const saveItemsToStorage = () => {
    const items = Array.from(itemList.querySelectorAll('li')).map((li) => ({
      text: li.querySelector('span').textContent,
      purchased: li.querySelector('span').classList.contains('purchased'),
    }));
    localStorage.setItem('shoppingList', JSON.stringify(items));
  };

  //  lets Add the new item to the list (DOM)
  const addItemToDOM = (text, purchased = false) => {
    const listItem = document.createElement('li'); // Create a list item
    const span = document.createElement('span');  // Create a span for the item text
    span.textContent = text;
    if (purchased) span.classList.add('purchased'); // Mark as purchased if true

    // Toggle 'purchased' class on click
    //This adds a click event listener to the span element (the part of the list item that displays the item's text).
    span.addEventListener('click', () => {
      span.classList.toggle('purchased');
      saveItemsToStorage(); // Saves our changes
    });

    // once you double click on an item in the list it enables you to edit
    span.addEventListener('dblclick', () => {
      const input = document.createElement('input'); // this  Creates an input for editing the item 
      input.type = 'text';
      input.value = span.textContent;
      input.className = 'edit-input';

      //  the eventlistener below  Save changes when losing focus
      input.addEventListener('blur', () => {
        span.textContent = input.value.trim() || span.textContent; // Keep old value if empty
        span.style.display = 'inline'; // Show text again
        listItem.removeChild(input);
        saveItemsToStorage();
      });

      // the eventlistener below  Save changes when pressing Enter
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });

      span.style.display = 'none'; // Hide text during editing
      listItem.insertBefore(input, span); // Add input to the list item
      input.focus();
    });

    // the document.createElement bellow adds a delete button to remove items
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      itemList.removeChild(listItem); // Removes the item from the list 
      saveItemsToStorage();
    });

    //  the appendChild  bellow adds the span and delete button to the list item
    listItem.appendChild(span);
    listItem.appendChild(deleteButton);
    itemList.appendChild(listItem);
  };

  // Add a new item from the input field
  const addItem = () => {
    const itemText = inputField.value.trim(); // Gets the input  and trim it
    if (itemText === '') return; // Does nothing if input is empty
    addItemToDOM(itemText); // Add item to the list
    saveItemsToStorage(); // Saves the list to our local storage 
    inputField.value = ''; // Clear input field
    inputField.focus(); // Refocus on input
  };

  // the innerhtml bellow Clears all items in the list
  const clearList = () => {
    itemList.innerHTML = ''; 
    saveItemsToStorage(); 
  };

  // the query selectorall bellow Marks all items as purchased
  const markAllPurchased = () => {
    const items = itemList.querySelectorAll('li span'); // Gets all item spans
    items.forEach((item) => {
      item.classList.add('purchased'); // Marks as purchased
    });
    saveItemsToStorage(); // Saves changes to your storage
  };

  // Add event listeners to buttons and input field
  addButton.addEventListener('click', addItem); // Add item on button click
  clearButton.addEventListener('click', clearList); // Clear list on button click
  markPurchasedButton.addEventListener('click', markAllPurchased); // Mark all items
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addItem(); 
    }
  });

  // Loads items from yuor storage when the page loads
  loadItemsFromStorage();
});
