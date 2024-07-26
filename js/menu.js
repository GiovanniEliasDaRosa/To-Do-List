const menu = document.querySelector("#menu");

// OpenConfigLists menu
const openConfigLists = document.querySelector("#openConfigLists");
const configListsMenu = document.querySelector("#configListsMenu");
openConfigLists.addEventListener("click", () => {
  Enable(configListsMenu);
});

// Screen
const screens = [...document.querySelectorAll(".screen")];
const screen__div__actions__close = [...document.querySelectorAll(".screen__div__actions__close")];

screen__div__actions__close.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    let parent = closeButton.parentElement.parentElement.parentElement.parentElement;
    if (parent.classList.contains("screen__div")) {
      parent = parent.parentElement;
    }
    Disable(parent);

    if (closeButton.id == "configureListMenuDiv__CloseButton") {
      openConfigCurrentList.focus();
    }
  });
});

window.onkeyup = (e) => {
  if (e.key != "Escape") return;

  let openScreen = null;

  screens.forEach((screen) => {
    if (screen.ariaDisabled == null) {
      openScreen = screen.querySelector(".screen__div__actions__close__button");
    }
  });

  if (item__actions.ariaDisabled == null) {
    HideItemActions();
  }

  if (openScreen == null) {
    return;
  }

  openScreen.click();
};

window.onresize = () => {
  if (item__actions.ariaDisabled == null) {
    PositionItemActions(
      document.querySelector(`[data-id='${item__actions.dataset.id}'] > .item__dragabblebutton `)
    );
  }
};

// Global configurations
const globalConfigurationsMenu = document.querySelector("#globalConfigurationsMenu");
const globalConfigurationsMenuDiv__smallUI = document.querySelector(
  "#globalConfigurationsMenuDiv__smallUI"
);
const globalConfigurationsMenuDiv__SaveButton = document.querySelector(
  "#globalConfigurationsMenuDiv__SaveButton"
);
let smallUI = false;

// Add New List
const addNewListButton = document.querySelector("#addNewListButton");

const addNewListMenu = document.querySelector("#addNewListMenu");
const addNewListMenu__name = document.querySelector("#addNewListMenu__name");
const addNewListMenu__description = document.querySelector("#addNewListMenu__description");
const configMenu__CreateButton = document.querySelector("#configMenu__CreateButton");

configMenu__CreateButton.addEventListener("click", () => {
  if (!ValueIsValid(addNewListMenu__name, configMenu__CreateButton)) return;
  if (!ValueIsValid(addNewListMenu__description, configMenu__CreateButton)) return;

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
  if (!ValueIsValid(configureListMenuDiv__name, configureListMenuDiv__SaveButton)) return;
  if (!ValueIsValid(configureListMenuDiv__description, configureListMenuDiv__SaveButton)) return;

  lists[listId].name = configureListMenuDiv__name.value.trim();
  lists[listId].description = configureListMenuDiv__description.value.trim();

  // Enable to save listlast edit on editing the title or description of the list
  // lists[listId].lastedit = NewDateAndTime();

  Disable(configCurrentListMenu);

  window.location.hash = `#${configureListMenuDiv__name.value.trim()}`;

  currentList.autouncheck = configureListMenuDiv__autoUncheck.checked;

  SaveData();

  UpdateMenuCards();
  UpdateScreen();
});

function ValueIsValid(element, button) {
  if (TestIsEmpty(element.value)) {
    element.setAttribute("data-error", "");
    Disable(button, false);
    setTimeout(() => {
      Enable(button);
      button.focus();
      element.removeAttribute("data-error");
    }, 1000);
    return false;
  }
  return true;
}

// Updates on Lists
function UpdateMenuCards() {
  [...cards.children].forEach((currentCard) => {
    if (currentCard.id == "addNewListButton") return;
    currentCard.remove();
  });

  configMenuLists.innerHTML = "";

  let saveLists = [];

  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];
    let checked = 0;
    let quant = 0;

    for (let j = 0; j < currentList.items.length; j++) {
      quant++;
      if (currentList.items[j][1] == true) {
        checked++;
      }
    }

    let updateTime = CreateNewList(
      currentList.name,
      currentList.description,
      currentList.lastedit,
      checked,
      quant
    );
    CreateNewConfigMenuItem(currentList.name, i);
    if (updateTime && currentList.autouncheck) {
      saveLists.push(i);
      for (let j = 0; j < currentList.items.length; j++) {
        lists[i].items[j][1] = false;
      }
    }
  }

  clearTimeout(updatingMenuTimeout);
  Enable(loadingSpinner);

  updatingMenuTimeout = setTimeout(() => {
    Disable(loadingSpinner);
  }, 2000);

  saveLists.forEach((listToSave) => {
    listId = listToSave;
    SaveData();
  });

  if (saveLists.length != 0) {
    console.log("Reload Screen");
    UpdateMenuCards();
  }
}

function CreateNewList(name, description, lastedit, checked, quant) {
  let templateContent = cardTemplate.content;
  let card = templateContent.querySelector(".card").cloneNode(true);

  card.querySelector(".card__title").textContent = name;

  card.querySelector(".card__description").textContent = description;
  card.querySelector(".card__editTime").textContent = `Edited in: ${lastedit}`;

  // console.log(name);
  // console.log(checked);
  // console.log(quant);

  let percentage = Math.round((checked / quant) * 100);
  card.querySelector(".card__progress__fill").style.width = `${percentage}%`;
  card.querySelector(".card__progress__text").textContent = `${checked}/${quant} (${percentage}%)`;

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

  if (yearDifference != 0 || monthDifference != 0 || dayDifference != 0) {
    return true;
  }
  return false;
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

/* screen */
const screentabsbuttons = document.querySelector("#screentabsbuttons");
const screentabbuttons = [...document.querySelectorAll(".screentabbuttons")];

screentabbuttons.forEach((button) => {
  button.onclick = () => {
    if (button.dataset.tabid == null) return;

    let thisMenu = button.parentElement.parentElement.parentElement;
    Disable(thisMenu);

    screens.forEach((screen) => {
      if (screen.id == button.dataset.tabid) {
        // Open wanted menu

        let focusTabPos = 0;
        let screentabbuttonsOnNewMenu = [...screen.querySelectorAll(".screentabbuttons")];
        console.log(thisMenu.id);
        if (thisMenu.id != "globalConfigurationsMenu") {
          screentabbuttonsOnNewMenu[0].setAttribute("data-tabid", thisMenu.id);
          screentabbuttonsOnNewMenu[0].innerHTML =
            thisMenu.querySelector(".screentabbuttons").innerHTML;
          focusTabPos = 1;
          UpdateMenuGlobalConfigurations();
        }

        Enable(screen);

        screentabbuttonsOnNewMenu[focusTabPos].focus();
      }
    });

    if (!button.classList.contains("selectedtab")) {
      // let screenDiv = button.parentElement.parentElement;
      // console.log(screenDiv);
      // let allTabs = [...screenDiv.querySelectorAll(".screentab")];
      // allTabs.forEach((currentTab) => {
      //   Disable(currentTab);
      // });
      // let wantedtab = allTabs[button.dataset.tabid];
      // Enable(wantedtab);
    }
  };
});

let allscreensTabs = [...document.querySelectorAll(".screehastabs")];

allscreensTabs.forEach((screen) => {
  let screentabs = [...screen.querySelectorAll(".screentab")];
  for (let i = 1; i < screentabs.length; i++) {
    Disable(screentabs[i]);
  }
});

function UpdateMenuGlobalConfigurations() {
  globalConfigurationsMenuDiv__smallUI.checked = smallUI;
}

globalConfigurationsMenuDiv__SaveButton.onclick = () => {
  smallUI = globalConfigurationsMenuDiv__smallUI.checked;
  localStorage.setItem("smallUI", smallUI);

  if (smallUI) {
    document.body.setAttribute("data-smallUI", "");
  } else {
    document.body.removeAttribute("data-smallUI");
  }
  Disable(globalConfigurationsMenu);
};
