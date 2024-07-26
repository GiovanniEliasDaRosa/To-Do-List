// Screens Divs
const configMenuLists__itemTemplate = document.querySelector("#configMenuLists__itemTemplate");
const configMenuLists__item = document.querySelector("#configMenuLists__item");

// Configure the menus
Enable(menu);
Disable(list);
// Disable(addNewListMenu);
// Disable(configListsMenu);
// Disable(configCurrentListMenu);
Disable(lists__sidebar);
Disable(lists__sidebar__dark);
// Disable(exportListMenu);
// Disable(importListMenu);

const screen = document.querySelectorAll(".screen");
screen.forEach((currentScreen) => {
  Disable(currentScreen);
});

// setTimeout(() => {
//   openConfigCurrentList.click();
// }, 200);
