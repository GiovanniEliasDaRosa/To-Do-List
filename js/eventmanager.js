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
