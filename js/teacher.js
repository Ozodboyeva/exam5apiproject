import request from "./main.js";
import { LIMIT } from "./const.js";

const categoriesRow = document.querySelector(".categories-row");
const searchInput = document.querySelector(".search-input");
const totalCategories = document.querySelector(".total-categories");
const pagination = document.querySelector(".pagination");
const categoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#category-modal");
const submitBtn = document.querySelector(
  ".category-form button[type='submit']"
);
const openModalBtn = document.querySelector(".open-modal-btn");

let search = "";
let activePage = 1;
let selected = null;

function getCategoryCard({
  id,
  firstName,
  lastName,
  avatar,
  groups,
  isMerried,
  phoneNumber,
  email,
}) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card-items">
              <div class="card__item">
                <img
                  src="${avatar}"
                  alt="rectangular"
                />
                <div class="card__title">
                  <h2>${firstName}</h2>
                  <p>john@gmail.com</p>
                </div>
              </div>
              <h3 class="card__parts">
                <span>Phone:</span>
                ${phoneNumber}
              </h3>
              <div class="posts">
                <div class="post">
                  <div class="h5">Field</div>
                  <p>electr</p>
                </div>
                <div class="post">
                  <div class="h5">Age</div>
                  <p>79 old</p>
                </div>
                <div class="post">
                  <div class="h5">isMarried: ${
                    isMerried ? "married" : "single"
                  }</div>
                 
                </div>
              </div>
              <div class="btns">
                            <a href="student.html?categoryId=${id}" class="btn btn-primary">See products ${id}</a>

                <button editId="${id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
                <button deleteId="${id}" class="btn btn-danger">Delete</button>
              </div>
            </div>
    </div>
  `;
}

async function getCategories() {
  try {
    let params = { firstName: search };

    let { data } = await request.get("Teacher", { params });

    params = { ...params, page: activePage, limit: LIMIT };

    let { data: dataPgtn } = await request.get("Teacher", { params });

    let len = data.length;

    let pages = Math.ceil(len / LIMIT);

    pagination.innerHTML = `<li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }"><button page="-" class="page-link">Previous</button></li>`;

    for (let page = 1; page <= pages; page++) {
      pagination.innerHTML += `<li class="page-item ${
        activePage === page ? "active" : ""
      }"><button page="${page}" class="page-link">${page}</button></li>`;
    }

    pagination.innerHTML += `<li class="page-item ${
      activePage === pages ? "disabled" : ""
    }"><button page="+" class="page-link">Next</button></li>`;

    totalCategories.textContent = len;
    categoriesRow.innerHTML = "";

    dataPgtn.map((category) => {
      categoriesRow.innerHTML += getCategoryCard(category);
    });
  } catch (err) {
    console.log(err.response.data);
  }
}

getCategories();

searchInput.addEventListener("keyup", function () {
  search = this.value;
  getCategories();
});

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page === "-") {
    activePage--;
  } else if (page === "+") {
    activePage++;
  } else {
    activePage = +page;
  }
  getCategories();
});

categoryForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    if (this.checkValidity()) {
      let category = {
        name: this.name.value,
        image: this.image.value,
      };
      if (selected === null) {
        await request.post("Teacher", category);
      } else {
        await request.put(`Teacher/${selected}`, category);
      }
      getCategories();
      bootstrap.Modal.getInstance(categoryModal).hide();
    } else {
      this.classList.add("was-validated");
    }
  } catch (err) {
    console.log(err);
  }
});

openModalBtn.addEventListener("click", function () {
  selected = null;
  submitBtn.textContent = "Add category";

  categoryForm.name.value = "";
  categoryForm.image.value = "";
});

categoriesRow.addEventListener("click", async function (e) {
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");
    if (editId) {
      selected = editId;
      submitBtn.textContent = "Save teacher";
      let { data } = await request.get(`Teacher/${editId}`);
      categoryForm.name.value = data.name;
      categoryForm.image.value = data.image;
    }
    if (deleteId) {
      let deleteConfirm = confirm(
        "Are you sure you want to delete this category?"
      );
      if (deleteConfirm) {
        await request.delete(`Teacher/${deleteId}`);
        getCategories();
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// function getCategoryCard({ id, name, image }) {
//   return `
//     <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
//       <div class="card">
//         <img
//           src="${image}"
//           class="card-img-top object-fit-cover"
//           height="300"
//           alt="..."
//         />
//         <div class="card-body">
//           <h5 class="card-title">${name}</h5>
//           <div>
//             <button editId="${id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
//             <button deleteId="${id}" class="btn btn-danger">Delete</button>
//             <a href="product.html?categoryId=${id}" class="btn btn-primary">See products ${id}</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;
// }
