const wrapper = document.querySelector(".wrapper");
const input = wrapper.querySelector("input");
const sugList = wrapper.querySelector(".suggestions");
const addedRepos = wrapper.querySelector(".reps");
let data = [];

const debounce = (fn, debounceTime) => {
  let timer;
  return function () {
    const funcCall = () => fn.apply(this, arguments);

    clearTimeout(timer);

    timer = setTimeout(funcCall, debounceTime);
  };
};

let getData = async () => {
  if (input.value.length === 0) {
    clearSugList();
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${input.value}&sort=stars`
    );
    data = await response.json();
    data = data.items;
  } catch (e) {
    throw new Error(e);
  }

  clearSugList();
  createSugList();
};

getData = debounce(getData, 200);

const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.innerText = text;
  }

  return element;
};

const clearSugList = () => {
  while (sugList.firstChild) {
    sugList.firstChild.remove();
  }
};

const createSugList = () => {
  data = data.filter((item) => item.name.includes(input.value));

  for (let i = 0; i < 5; i++) {
    const item = data[i];
    try {
      const sugListElement = createElement(
        "li",
        "suggestions__element",
        item.name
      );
      sugList.appendChild(sugListElement);
    } catch {
      continue;
    }
  }
};

const addtoReps = (event) => {
  {
    for (let i in data) {
      if (data[i].name === event.innerText) {
        const target = data[i];

        const repsListElement = createElement("li", "reps__element");

        const repoName = createElement(
          "p",
          "reps__text",
          `Name: ${target.name}`
        );
        repsListElement.appendChild(repoName);

        const repoOwner = createElement(
          "p",
          "reps__text",
          `Owner: ${target.owner.login}`
        );
        repsListElement.appendChild(repoOwner);

        const repoStars = createElement(
          "p",
          "reps__text",
          `Stars: ${target.stargazers_count}`
        );
        repsListElement.appendChild(repoStars);

        const deleteBtn = createElement("div", "delete-btn");
        repsListElement.appendChild(deleteBtn);

        addedRepos.appendChild(repsListElement);

        deleteBtn.addEventListener("click", () => {
          deleteBtn.closest(".reps__element").remove();
        });

        input.value = "";
        clearSugList();
        break;
      }
    }
  }
};

input.addEventListener("keyup", getData);
sugList.addEventListener("click", (e) => addtoReps(e.target));
