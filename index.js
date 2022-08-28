const wrapper = document.querySelector(".wrapper");
const input = wrapper.querySelector("input");
const sugList = wrapper.querySelector(".suggestions");
const addedRepos = wrapper.querySelector(".reps");

const debounce = (fn, debounceTime) => {
  let timer;
  return function () {
    const funcCall = () => fn.apply(this, arguments);

    clearTimeout(timer);

    timer = setTimeout(funcCall, debounceTime);
  };
};

input.addEventListener("keyup", () => {
  if (!input.value.length) {
    sugList.style.display = "none";
    return;
  }

  createSugElements();
  sugList.style.display = "block";
});

let createSugElements = async () => {
  try {
    await fetch(
      `https://api.github.com/search/repositories?q=${input.value}&sort=stars`
    )
      .then((res) => res.json())
      .then((data) => {
        while (sugList.firstChild) {
          sugList.firstChild.remove();
        }

        let items = data.items;
        items = items.filter((item) => item.name.includes(input.value));

        for (let i = 0; i < 5; i++) {
          const item = items[i];
          let element = document.createElement("li");
          element.classList.add("suggestions__element");
          element.innerText = item.name;
          sugList.appendChild(element);
        }

        sugList.addEventListener("click", (e) => {
          for (let i in items) {
            if (items[i].name === e.target.innerText) {
              const target = items[i];
              element = document.createElement("li");
              element.classList.add("reps__element");

              const repoName = document.createElement("p");
              repoName.innerText = `Name: ${target.name}`;
              element.appendChild(repoName);

              const repoOwner = document.createElement("p");
              repoOwner.innerText = `Owner: ${target.owner.login}`;
              element.appendChild(repoOwner);

              const repoStars = document.createElement("p");
              repoStars.innerText = `Stars: ${target.stargazers_count}`;
              element.appendChild(repoStars);

              const deleteBtn = document.createElement("div");
              deleteBtn.classList.add("delete-btn");
              deleteBtn.innerText = "delete";
              element.appendChild(deleteBtn);

              addedRepos.appendChild(element);

              deleteBtn.addEventListener("click", () => {
                deleteBtn.closest(".reps__element").remove();
              });
              break;
            }
          }
        });
      });
  } catch (e) {
    throw new Error(e);
  }
};

createSugElements = debounce(createSugElements, 200);
