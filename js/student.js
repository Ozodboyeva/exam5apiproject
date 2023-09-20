import request from "./main.js";
import { LIMIT } from "./const.js";

const studentRow = document.querySelector(".categories-row");
const totalCategories = document.querySelector(".total-categories");
const categoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#category-modal");
const submitBtn = document.querySelector(
  ".category-form button[type='submit']"
);

let selected = null;

const openModalBtn = document.querySelector(".open-modal-btn");

const query = new URLSearchParams(location.search);

const teacherId = query.get("teacherId");

function getStudentCard({
  id,
  firstName,
  lastName,
  image,
  date,
  isWork,
  phoneNumber,
  email,
  field,
}) {
  return `
  
  <section class="bussinesscard col-12 col-sm-6 col-md-4 ">
  <div class="flip">
    <div class="front">       
      <div class="top">       
      <div class="logo">
      <span  class="fat">
      <img src="${image}" alt="" />
          </span>
        </div>       
      </div>
      <div class="nametroduction">
        <h3 class="name">${firstName} ${lastName}</h3>
        <div class="introduction">${field}</div>
      </div>  
      <div class="contact">           
      <h2>${firstName} ${lastName}</h2>
      <a href="@${email}"> @${email}</a>
      <h3>${phoneNumber}</h3>
      <p>${date}</p>
      <div>isWork: ${isWork}</div>


      <div class="d-flex btns">
        <div>
          <button editId="${id}" class="btn btn-edit" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
          <button deleteId="${id}" class="btn btn-delete">Delete</button>
        </div>
      </div>         
      </div>   
    </div>
    <div class="back"></div> <!--FIXES FONT RENDERING -->
  </div>
</section>
  
  `;
}

async function getProducts() {
  try {
    studentRow.innerHTML = `<div class="bady">
    <div class="scene">
    <div class="cube-wrapper">
      <div class="cube">
        <div class="cube-faces">
          <div class="cube-face shadow"></div>
          <div class="cube-face bottom"></div>
          <div class="cube-face top"></div>
          <div class="cube-face left"></div>
          <div class="cube-face right"></div>
          <div class="cube-face back"></div>
          <div class="cube-face front"></div>
        </div>
      </div>
    </div>
  </div>
    </div>`;

    let { data } = await request.get(`Teacher/${teacherId}/Student`);
    let len = data.length;

    studentRow.innerHTML = "";

    totalCategories.textContent = len;
    data.map((category) => {
      studentRow.innerHTML += getStudentCard(category);
    });
  } catch (err) {
    console.log(err);
  }
}

getProducts();

categoryForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    if (this.checkValidity()) {
      let student = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
        date: this.date.value,
        image: this.image.value,
        isWork: this.isWork.checked,
      };
      if (selected === null) {
        await request.post("Student", student);
      } else {
        await request.put(`Student/${selected}`, student);
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
console.log(categoryForm.date);
openModalBtn.addEventListener("click", function () {
  selected = null;
  submitBtn.textContent = "Add student";
  categoryForm.firstName.value = "";
  categoryForm.image.value = "";
  categoryForm.lastName.value = "";
  categoryForm.phoneNumber.value = "";
  categoryForm.email.value = "";
  categoryForm.date.value = "";
  categoryForm.image.value = "";
  categoryForm.isWork.chachked = false;
});

studentRow.addEventListener("click", async function (e) {
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");

    if (editId) {
      selected = editId;
      submitBtn.textContent = "Save student";
      let { data } = await request.get(
        `Teacher/${teacherId}/Student/${editId}`
      );
      categoryForm.firstName.value = data.firstName;
      categoryForm.lastName.value = data.lastName;
      categoryForm.phoneNumber.value = data.phoneNumber;
      categoryForm.email.value = data.email;
      categoryForm.isWork.value = data.isWork;
      categoryForm.date.value = data.date;
      categoryForm.image.value = data.image;
    }
    if (deleteId) {
      let deleteConfirm = confirm(
        "Are you sure you want to delete this student?"
      );
      if (deleteConfirm) {
        await request.delete(`Teacher/${teacherId}/Student/${deleteId}`);
        getProducts();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
