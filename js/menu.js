const menu = document.querySelector("#menu");

// OpenConfigLists menu
const openConfigLists = document.querySelector("#openConfigLists");
const configListsMenu = document.querySelector("#configListsMenu");
openConfigLists.addEventListener("click", () => {
  Enable(configListsMenu);
});

// OpenConfigCurrentList menu
const openConfigCurrentList = document.querySelector("#openConfigCurrentList");
const configCurrentListMenu = document.querySelector("#configCurrentListMenu");
openConfigCurrentList.addEventListener("click", () => {
  currentList = lists[listId];
  configureListMenuDiv__name.value = currentList.name;
  configureListMenuDiv__description.value = currentList.description;
  Enable(configCurrentListMenu);
  configureListMenuDiv__name.focus();
});

const screen__div__actions__close = [...document.querySelectorAll(".screen__div__actions__close")];

screen__div__actions__close.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    Disable(closeButton.parentElement.parentElement.parentElement.parentElement);
  });
});

// Add New List
const addNewListButton = document.querySelector("#addNewListButton");

const addNewListMenu = document.querySelector("#addNewListMenu");
const addNewListMenu__name = document.querySelector("#addNewListMenu__name");
const addNewListMenu__description = document.querySelector("#addNewListMenu__description");
const configMenu__CreateButton = document.querySelector("#configMenu__CreateButton");

const configureListMenu = document.querySelector("#configureListMenu");
const configureListMenuDiv__name = document.querySelector("#configureListMenuDiv__name");
const configureListMenuDiv__description = document.querySelector(
  "#configureListMenuDiv__description"
);
const configureListMenuDiv__SaveButton = document.querySelector(
  "#configureListMenuDiv__SaveButton"
);

configMenu__CreateButton.addEventListener("click", () => {
  if (TestIsEmpty(addNewListMenu__name.value)) return;
  if (TestIsEmpty(addNewListMenu__description.value)) return;
  let newlist = {
    name: addNewListMenu__name.value.trim(),
    description: addNewListMenu__description.value.trim(),
    lastedit: NewDateAndTime(),
    items: [["First item", false]],
  };

  lists.push(newlist);

  SaveData();
  UpdateMenuCards();
  Disable(addNewListMenu);
});

addNewListButton.addEventListener("click", () => {
  Enable(addNewListMenu);
  addNewListMenu__name.focus();
});

// Save the editing list
configureListMenuDiv__SaveButton.addEventListener("click", () => {
  if (TestIsEmpty(configureListMenuDiv__name.value)) return;
  if (TestIsEmpty(configureListMenuDiv__description.value)) return;

  lists[listId].name = configureListMenuDiv__name.value;
  lists[listId].description = configureListMenuDiv__description.value;

  // Enable to save listlast edit on editing the title or description of the list
  // lists[listId].lastedit = NewDateAndTime();

  Disable(configCurrentListMenu);

  window.location.hash = `#${configureListMenuDiv__name.value}`;

  SaveData();

  UpdateMenuCards();
  UpdateScreen();
});

// Updates on Lists
function UpdateMenuCards() {
  [...cards.children].forEach((currentCard) => {
    if (currentCard.id == "addNewListButton") return;
    currentCard.remove();
  });

  configMenuLists.innerHTML = "";

  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];

    CreateNewList(currentList.name, currentList.description, currentList.lastedit);
    CreateNewConfigMenuItem(currentList.name, i);
  }

  clearTimeout(updatingMenuTimeout);
  Enable(loadingSpinner);

  updatingMenuTimeout = setTimeout(() => {
    Disable(loadingSpinner);
  }, 2000);
}

function CreateNewList(name, description, lastedit) {
  let templateContent = cardTemplate.content;
  let card = templateContent.querySelector(".card").cloneNode(true);

  card.querySelector(".card__title").textContent = name;

  card.querySelector(".card__description").textContent = description;
  card.querySelector(".card__editTime").textContent = `Edited in: ${lastedit}`;

  card.href = `#${name}`;

  // Calculate date and time

  [day, month, year, hours, minutes] = SplitDateAndTime(lastedit);

  let datetime = NewDateAndTime();
  [dayCurrent, monthCurrent, yearCurrent, hoursCurrent, minutesCurrent] =
    SplitDateAndTime(datetime);

  // Test
  let edittime = "";

  let yearDifference = Format(yearCurrent, year, "year", 0);
  let monthDifference = Format(monthCurrent, month, "month", 12);
  let dayDifference = Format(dayCurrent, day, "day", 0);
  let hoursDifference = Format(hoursCurrent, hours, "hour", 24);
  let minutesDifference = Format(minutesCurrent, minutes, "minute", 60);

  if (yearDifference != 0) {
    // Edit was a year or more, show: years and months
    edittime += yearDifference;
    edittime += monthDifference;
  } else if (monthDifference != 0) {
    // Edit was a month or more, show: months and days
    edittime += monthDifference;
    edittime += dayDifference;
  } else if (dayDifference != 0) {
    // Edit was a day or more, show: days and hours
    edittime += dayDifference;
    edittime += hoursDifference;
  } else {
    // Edit under 24 hours, in case user updated now, it will return nothing
    edittime += hoursDifference;
    edittime += minutesDifference;
  }

  if (edittime == "") {
    // If the edit was under 1 minute show JUST NOW
    edittime = "Just now";
  }

  card.querySelector(".card__lastEdit").textContent = `Last Edit: ${edittime}`;
  cards.insertBefore(card, addNewListButton);
}

function CreateNewConfigMenuItem(name, pos) {
  let templateContent = configMenuLists__itemTemplate.content;
  let item = templateContent.querySelector(".cards__config").cloneNode(true);

  item.querySelector(".cards__config__title").textContent = name;
  item.setAttribute("data-id", pos);

  const delete__button = item.querySelector(".cards__config__deleteButton");

  delete__button.addEventListener("click", () => {
    let confirmDelete = confirm(
      `Do you really want to delete the LIST "${name}"? [THERE IS NO GOING BACK]`
    );
    if (!confirmDelete) return;

    let confirmType = prompt(
      `Type [confirm] to delete the LIST "${name}" [THERE IS NO GOING BACK]:`
    );
    if (confirmType.toLowerCase() == "confirm") {
      let position = Number(item.dataset.id);
      lists.splice(position, 1);
      SaveData();
      UpdateMenuCards();
    }
  });

  configMenuLists.appendChild(item);
}
