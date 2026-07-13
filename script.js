const menu = document.getElementById("menu");
const filters = document.getElementById("filters");
const search = document.getElementById("search");

const url =
  "https://docs.google.com/spreadsheets/d/1HksKzo0TH3d9GDDMgS2ZnCEjzxUEoRhcdgM3jcViX-c/gviz/tq?tqx=out:json&sheet=เมนูร้าน%202569";

let groups = {};

fetch(url)
  .then(res => res.text())
  .then(text => {

    const json = JSON.parse(text.substring(47, text.length - 2));

    groups = {};
    let html = "";

    json.table.rows.forEach(row => {

      const category = row.c[0]?.v || "";
      const name = row.c[1]?.v || "";
      const price = row.c[2]?.v || "";
      const image = row.c[3]?.v || "";
      const status = row.c[4]?.v || "";

      if (!groups[category]) groups[category] = [];

      const card = `
      <div class="card ${status === "สินค้าหมด" ? "soldout" : ""}">
          ${status ? `<span class="badge ${status}">${status}</span>` : ""}
          <img src="images/${image}" alt="${name}">
          <h3>${name}</h3>
          <p>${price} บาท</p>
      </div>
      `;

      if (status === "แนะนำ") {
        groups[category].unshift(card);
      } else {
        groups[category].push(card);
      }

    });

    for (const [category, items] of Object.entries(groups)) {

      html += `
      <div class="category">
          <h2 class="category-title">${category}</h2>
          <div class="category-group">
              ${items.join("")}
          </div>
      </div>
      `;

    }

    menu.innerHTML = html;

    let buttons =
      `<button onclick="showCategory('ทั้งหมด')">ทั้งหมด</button>`;

    for (const category in groups) {
      buttons += `<button onclick="showCategory('${category}')">${category}</button>`;
    }

    filters.innerHTML = buttons;

  });

function showCategory(category) {

  document.querySelectorAll(".category").forEach(section => {

    const title = section.querySelector("h2").textContent;

    section.style.display =
      category === "ทั้งหมด" || title === category
        ? "block"
        : "none";

  });

}

search.addEventListener("input", function () {

  const keyword = this.value.toLowerCase();

  document.querySelectorAll(".card").forEach(card => {

    const name = card.querySelector("h3").textContent.toLowerCase();

    card.style.display =
      name.includes(keyword)
        ? "block"
        : "none";

  });

});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const close = document.getElementById("close");

document.addEventListener("click", function (e) {

  if (e.target.matches(".card img")) {

    lightbox.style.display = "flex";
    lightboxImg.src = e.target.src;
    lightboxImg.alt = e.target.alt;

  }

});

close.onclick = () => lightbox.style.display = "none";

lightbox.onclick = e => {

  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }

};