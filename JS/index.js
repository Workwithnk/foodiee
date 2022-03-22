let mainContainer = document.getElementById("mainContainer");
let allNavLinks = document.querySelectorAll(".navLinks");
let randomMeal = document.getElementById("randomMealCon");
let randomMeal_Ifram = document.querySelector(".randomMeal_Ifram");
let randomMeal_Details = document.querySelector(".randomMeal_Details");
let ingrePara = document.querySelector(".ingrePara");
let randomMeal_name = document.querySelector(".randomMeal_name");
let randomMeal_method = document.querySelector(".randomMeal_method");
let categories = document.querySelector("#categories");

// for navLinks

for (let i = 0; i < allNavLinks.length; i++) {
  allNavLinks[i].addEventListener("click", () => {
    allNavLinks.forEach((ele) => ele.classList.remove("activeLink"));
    allNavLinks[i].classList.add("activeLink");
  });
}

// Random meal
const handleRandomMeal = async () => {
  let responce = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  let result = await responce.json();
  //for video url
  let videoURL = result.meals[0].strYoutube;
  videoURL = videoURL.replace("watch?v=", "embed/");
  randomMeal_Ifram.setAttribute("src", `${videoURL}`);

  // for details of video
  let details = result.meals[0];
  randomMeal_name.innerText = details.strMeal;
  randomMeal_method.innerText = details.strInstructions;
  let ingredientArr = [];
  for (let i = 1; i <= 20; i++) {
    ingredientArr.push(details[`strIngredient${i}`]);
  }
  let filteredIngre = ingredientArr.filter(
    (data) => data.length > 0 && data.length !== null
  );
  filteredIngre = filteredIngre.toString();
  ingrePara.innerHTML = `${filteredIngre}`;
};
handleRandomMeal();

// categories
const getCategories = async () => {
  let responce = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  let result = await responce.json();
  let allCategories = result.meals;

  allCategories.forEach(async (category) => {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
    );
    let resu = await res.json();
    let imageHtmldata = "";
    resu.meals.map((data) => {
      let imageHtml = `<div class="category_data " >
              <img src="${data.strMealThumb}" alt="${data.strMeal}"/>
              <h3>${data.strMeal}</h3>
              <p class="getRecipe">${data.idMeal} </p>
              </div>`;
      imageHtmldata += imageHtml;
      return imageHtmldata;
    });
    let finalData = `<div class="category_header">
            <h1>${category.strCategory}</h1>
            </div>
            <div class="category_details">
            ${imageHtmldata}
            </div>`;

    categories.innerHTML += finalData;
  });
};

getCategories();
let cateData;

const getId = () => {
  setTimeout(() => {
    cateData = document.querySelectorAll(".category_data");

    cateData.forEach((data, index) => {
      data.addEventListener("click", async () => {
        // here i got the id of perticular data
        let idOfData = data.querySelector(".getRecipe").innerText;

        // model created
        let createModel = document.createElement("div");
        createModel.setAttribute("class", "modelCont");
        mainContainer.appendChild(createModel);

        // i got the data of that perticular id
        let responceOfData = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idOfData}`
        );
        let resultOfData = await responceOfData.json();
        //video link
        let YoutubeLink = resultOfData.meals[0].strYoutube;
        YoutubeLink = YoutubeLink.replace("watch?v=", "embed/");
        // recipeName
        let recipeName = resultOfData.meals[0].strMeal;

        //all ingredient
        let details = resultOfData.meals[0];

        let ingredientArr = [];
        for (let i = 1; i <= 20; i++) {
          ingredientArr.push(details[`strIngredient${i}`]);
        }
        let filteredIngre = ingredientArr.filter(
          (data) => data.length > 0 && data.length !== null
        );
        filteredIngre = filteredIngre.toString();

        // method of recipe
        let instructionsOfrecipe = details.strInstructions;

        // create a video
        let dataCon = document.createElement("div");
        dataCon.setAttribute("class", "modelCont_dataCon");
        // video
        let video = document.createElement("iframe");
        video.setAttribute("class", "modelCont_video");
        video.setAttribute("src", YoutubeLink);

        // for discription  div
        let discriptionDiv = document.createElement("div");
        discriptionDiv.setAttribute("class", "modelCont_video_discription");

        //h1 tage for recipe name
        let recipeNameTag = document.createElement("h1");
        recipeNameTag.setAttribute("class", "video_title");
        recipeNameTag.innerText = recipeName;
        discriptionDiv.appendChild(recipeNameTag);

        //let ingredients of recipe
        let titleOfdesPara = document.createElement("h4");
        titleOfdesPara.setAttribute("class", "video_titlePara");
        titleOfdesPara.innerText = "Ingredient :";
        discriptionDiv.appendChild(titleOfdesPara);
        let recipeingre = document.createElement("p");
        recipeingre.setAttribute("class", "video_ingre");
        recipeingre.innerText = filteredIngre;
        discriptionDiv.appendChild(recipeingre);

        //let Instructions of recipe
        let titleOfdesInst = document.createElement("h4");
        titleOfdesInst.setAttribute("class", "video_titleOfdesInst");
        titleOfdesInst.innerText = "Instructions :";
        discriptionDiv.appendChild(titleOfdesInst);
        let recipeInst = document.createElement("p");
        recipeInst.setAttribute("class", "video_inst");
        recipeInst.innerText = instructionsOfrecipe;
        discriptionDiv.appendChild(recipeInst);

        //container toggler
        let createBtn = document.createElement("button");
        createBtn.setAttribute("class", "video_closeBtn");
        createBtn.innerText = "X";

        let removeModelCont = document.querySelectorAll(".modelCont");
        createBtn.addEventListener("click", () => {
          removeModelCont.forEach((each) => each.remove());
          createModel.classList.add("close");
        });
        discriptionDiv.appendChild(createBtn);

        // appending main container
        dataCon.appendChild(video);
        dataCon.appendChild(discriptionDiv);
        createModel.appendChild(dataCon);
      });
    });
  }, 600);
};

getId();

// mobile view toggler

let menuIcon = document.querySelector(".menuIcon");
let nav_links = document.querySelector(".nav_links");
menuIcon.addEventListener("click", () => {
  nav_links.classList.toggle("open");
});
