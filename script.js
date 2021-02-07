const searchedFood = document.getElementById("searched-food");

document.getElementById("search-button").addEventListener("click", () => {
    document.getElementById("show-food").innerHTML = "";
    displayFood(searchedFood.value);
    searchedFood.value = "";
}); // For searching with name and some parts of name.

searchedFood.addEventListener("input", () =>{
    document.getElementById("show-food").innerHTML = "";
    displayFoodLetter(searchedFood.value);
});  // For searching with a single letter.

const displayFood = foodName => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
    .then(response => response.json())
    .then(data => showFood(data))
} 

const displayFoodLetter = foodLetter => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${foodLetter}`)
    .then(response => response.json())
    .then(data => showFood(data))
    .catch(error => console.log(""));
}

const showFood = data => {
    const foodContainer = document.getElementById("show-food");
    
    //Checks if invalid food name is given.
    if (data.meals === null) {
        const errorMessage = document.getElementById("error-message");
        const h1 = document.createElement("h1");
        const img = document.createElement("img");
        img.setAttribute("src", "error-search.png");
        h1.innerText = "Sorry. Searched food item not found. Please provide a valid food name";
        h1.className = "error-text";
        errorMessage.appendChild(h1);
        errorMessage.appendChild(img);
        errorMessage.style.display = "block";
    }

    // The real function which shows the foods and ingredients.
    else {
        document.getElementById("error-message").style.display = "none";
        data.meals.forEach(food => {
            const singleItem = document.createElement("div");
            singleItem.className = "card";
            foodInfo = `
                <img class="card-img-top" src="${food.strMealThumb}">
                <h4 id="card-content">${food.strMeal}</h4>
            `
            singleItem.innerHTML = foodInfo;
            foodContainer.appendChild(singleItem);
    
            singleItem.addEventListener("click", () => {
                const inputField = document.getElementById("input-field");
                const ul = document.createElement("ul");
                const key = Object.keys(food);
                const value = Object.values(food);
                const ingredientArray = [];
                const measureArrray = [];
                foodContainer.style.display = "none";
                inputField.style.display = "none";
                const displayIngredients = document.getElementById("ingredients");
                displayIngredients.style.display = "block";
                ingredientContent = `
                    <img src="${food.strMealThumb}">
                    <h2 class="ingredient-title"><b>${food.strMeal}</b></h2>
                    <h4>Ingredients</h4>
                `
                for(let i in key, value){
                    if(key[i].startsWith("strIngredient") && value[i] != "" && value[i] != null){
                        ingredientArray.push(key[i]);
                    } else if(key[i].startsWith("strMeasure") && value[i] != "" && value[i] != null){
                        measureArrray.push(key[i]);
                    }
                }
            
                for(let j = 0; j < ingredientArray.length; j++){
                    const li = document.createElement("li");
                    li.innerText = `${food[measureArrray[j]]} ${food[ingredientArray[j]]}`;
                    ul.appendChild(li);
                }
    
                const button = document.createElement("button");
                button.innerText = "Back";
                button.className = "back-btn";
                button.addEventListener("click", () => {
                    foodContainer.style.display = "grid";
                    inputField.style.display = "block";
                    displayIngredients.style.display = "none";
                });
    
                displayIngredients.innerHTML = ingredientContent;
                displayIngredients.appendChild(ul);
                displayIngredients.appendChild(button);
            });
        });
    }

}