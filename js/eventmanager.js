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

const allbuttons = [...document.querySelectorAll("button, .buttons")];
let untitlebuttons = 0;
let untitlebuttonselements = [];

for (let i = 0; i < allbuttons.length; i++) {
  const button = allbuttons[i];
  if (button.title != "") continue;
  if (button.classList.contains("selectedtab")) continue;

  untitlebuttonselements.push(button);
  untitlebuttons++;
}

if (untitlebuttons != 0) {
  console.warn(`There is ${untitlebuttons} Untitle Buttons!`);

  console.log(untitlebuttonselements);
}

// setTimeout(() => {
//   openConfigCurrentList.click();
// }, 200);
