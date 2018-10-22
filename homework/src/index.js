"use strict";
{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error("Network request failed"));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === "text") {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    const root = document.getElementById("root");
    const div = createAndAppend("div", root, { class: "data" });
    const header = createAndAppend("p", div, { text: "HYF Repositories", class: "header" });
    const table = createAndAppend("table", root, { class: "table" });
    const select = createAndAppend("select", header, { id: "list" });
    const tbody = createAndAppend("tbody", table);
    const tr = createAndAppend("tr", tbody, { text: "Repository: ", class: "label" });
    const repositoryLink = createAndAppend("a", tr);
    const description = createAndAppend("tr", tbody, { class: "label" });
    const forks = createAndAppend("tr", tbody, { class: "label" });
    const container = createAndAppend('div', root, { class: "container" });
    const updated = createAndAppend("tr", tbody, { class: "label" });

    const data = createAndAppend("div", root, { class: "data" });

    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend("div", container, {
          text: err.message,
          class: "alert-error"
        });
      } else {
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach((repositories, index) => {
          createAndAppend("option", select, { "text": repositories.name, "value": index });
        });
      }
      renderRepositoryBox(
        repositories[0],
        repositoryLink,
        description,
        forks,
        updated
      );

      select.addEventListener("change", () => {
        renderRepositoryBox(
          repositories[select.value],
          repositoryLink,
          description,
          forks,
          updated
        );
      });

      function renderRepositoryBox(
        repositories,
        repositoryLink,
        forks,
        description,
        updated,
      ) {
        repositoryLink.innerText = repositories.name;
        repositoryLink.setAttribute("href", repositories.html_url);
        repositoryLink.setAttribute("target", "_blank");
        forks.innerHTML = "Forks: " + repositories.forks;
        description.innerHTML = "Description: " + repositories.description;
        updated.innerHTML = "Updated: " + new Date(repositories.updated_at).toLocaleString();
      }
      renderContributors(data, repositories[0].contributorsUrl);

    });

    function renderContributors(data, container, contributorsUrl) {
      const contributorsList = createAndAppend("contributorsList", data, { class: "right_div" });
      createAndAppend("p", contributorsList, { text: "Contributions", class: "contributions" });
      const ul = createAndAppend("ul", contributorsList);

      Object.keys(data, container, contributorsUrl).forEach(contributor => {

        const li = createAndAppend("li", ul);
        console.log(li);
        li.setAttribute("target", "_blank");
        li.addEventListener("click", () => { window.open(contributor.html_url); });
        createAndAppend("img", li, { "src": contributor.html_url.avatar_url });
        createAndAppend("div", li, { text: contributor.badge, class: "contributors_badge" });

      });


    }
  }
  const HYF_REPOS_URL = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

  window.onload = () => main(HYF_REPOS_URL);
}
