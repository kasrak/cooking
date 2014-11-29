var app = new Layer({x:0, y:0, width:640, height:1136});
app.backgroundColor = "white";
app.center();

var keyboard = new Layer({x:0, y:0, width:640, height:432, image: "keyboard.png"});
keyboard.minX = app.minX;
keyboard.minY = app.maxY;
keyboard.opacity = 0;

function showKeyboard() {
    keyboard.animate({
        properties: {maxY: app.maxY, opacity: 1},
        time: 0.2,
    });
}

function hideKeyboard() {
    keyboard.animate({
        properties: {minY: app.maxY, opacity: 0},
        time: 0.2,
    });
}

///////////////////////////////////////////////////////////////////////////////
// Discover screen
///////////////////////////////////////////////////////////////////////////////

var discoverScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(discoverScreen);
discoverScreen.backgroundColor = "white";

function listOfRecipes(numRecipes, configurator) {
    var scrollView = new Layer({x:0, y:0, width:640, height: 1136});
    scrollView.backgroundColor = "white";
    scrollView.scrollVertical = true;

    var toggleFavorite = function(event, layer) {
        layer.opacity = 1 - layer.opacity;
        event.stopPropagation();
    };

    var switchToRecipeOverview = function() {
        switchToScreen(recipeOverviewScreen);
    };

    var i;
    var itemHeight = 254;
    for (i = 0; i < numRecipes; i++) {
        var recipeListItem = new Layer({x:0, y: i * (itemHeight + 10),
                                       width: 640, height: itemHeight,
                                       image: "recipeListItem.png"});
        scrollView.addSubLayer(recipeListItem);

        recipeListItem.on("click", switchToRecipeOverview);

        var favoriteStar = new Layer({x:582, y:21, width:38, height:36,
                                     image: "favoriteStar.png"});
        favoriteStar.opacity = 0;
        favoriteStar.on(Events.Click, toggleFavorite);
        favoriteStar.on("click", function(e) { e.stopPropagation(); });
        recipeListItem.addSubLayer(favoriteStar);

        if (configurator) {
            configurator(recipeListItem, favoriteStar);
        }
    }

    return scrollView;
}

var discoverRecipes = listOfRecipes(5);
discoverRecipes.minY = 122;
discoverRecipes.height = 916;
discoverScreen.addSubLayer(discoverRecipes);

function dismissSearch() {
    searchBar.visible = true;
    searchBarExpanded.visible = false;
    hideKeyboard();
    searchDarkOverlay.visible = false;
}

var searchDarkOverlay = new Layer({x:0,y:0,width:640,height:1136});
searchDarkOverlay.backgroundColor = "rgba(0,0,0,0.6)";
searchDarkOverlay.visible = false;
searchDarkOverlay.on("click", function(e) {
    e.stopPropagation();
    dismissSearch();
});
discoverScreen.addSubLayer(searchDarkOverlay);

var navbarDiscover = new Layer({x:0, y:1038, width:640, height:98,
                               image: "navbarDiscover.png"});
navbarDiscover.on(Events.Click, navbarClickHandler);
discoverScreen.addSubLayer(navbarDiscover);

var searchBar = new Layer({x:21, y:21, width:598, height:80, image: "searchBar.png"});
discoverScreen.addSubLayer(searchBar);
searchBar.on(Events.Click, function() {
    searchBar.visible = false;
    searchBarExpanded.visible = true;
    showKeyboard();
    searchDarkOverlay.visible = true;
});

var searchBarExpanded = new Layer({x:21, y:21, width:598, height:400,
                                  image: "searchBarExpanded.png"});
discoverScreen.addSubLayer(searchBarExpanded);
searchBarExpanded.visible = false;
searchBarExpanded.on(Events.Click, function(e) {
    e.stopPropagation();
    dismissSearch();
});
searchBarExpanded.on("click", function(e) { e.stopPropagation(); });

///////////////////////////////////////////////////////////////////////////////
// Favorites screen
///////////////////////////////////////////////////////////////////////////////

var favoritesScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(favoritesScreen);
favoritesScreen.backgroundColor = "white";

var favoritesTitle = new Layer({x:29, y:42, width: 137, height: 28, image: "favoritesTitle.png"});
favoritesScreen.addSubLayer(favoritesTitle);

var shoppingListButton = new Layer({x:429, y:29, width:191, height:65, image: "shoppingListButton.png"});
favoritesScreen.addSubLayer(shoppingListButton);
shoppingListButton.on(Events.Click, function() {
    servingSizeSteppers.forEach(function(stepper) { stepper.visible = true; });
    shoppingListHeader.visible = true;
});

var shoppingListHeader = new Layer({x:0,y:0,width:640,height:100});
shoppingListHeader.backgroundColor = "white";
shoppingListHeader.visible = false;
favoritesScreen.addSubLayer(shoppingListHeader);

var shoppingListDoneButton = new Layer({x:506,y:29,width:114,height:65,image:"shoppingListDoneButton.png"});
shoppingListHeader.addSubLayer(shoppingListDoneButton);
shoppingListDoneButton.on(Events.Click, function() {
    shoppingListScreen.visible = true;
});

var shoppingListCancelButton = new Layer({x:20,y:29,width:114,height:65,image:"shoppingListCancelButton.png"});
shoppingListHeader.addSubLayer(shoppingListCancelButton);
shoppingListCancelButton.on(Events.Click, function() {
    servingSizeSteppers.forEach(function(stepper) { stepper.visible = false; });
    shoppingListHeader.visible = false;
});

var shoppingListChooseTitle = new Layer({x:156,y:36,width:326,height:35,image:"chooseServingSizes.png"});
shoppingListHeader.addSubLayer(shoppingListChooseTitle);

var shoppingListSubtitle = new Layer({x:200,y:69,width:250,height:30});
shoppingListSubtitle.backgroundColor = "transparent";
shoppingListSubtitle.style.color = "#727D90";
shoppingListHeader.addSubLayer(shoppingListSubtitle);

var currentTotalServingsCount = 0;
function setTotalServingsCount(count) {
    currentTotalServingsCount = count;
    shoppingListSubtitle.html = count + " servings in total";
}
setTotalServingsCount(3);

var servingSizeSteppers = [];
var favoriteRecipes = listOfRecipes(3, function(recipeView, starView) {
    starView.opacity = 1;

    var stepper = new Layer({x:497,y:0,width:141,height:254,image:"servingSizeStepper.png"});
    stepper.visible = false;
    recipeView.addSubLayer(stepper);
    servingSizeSteppers.push(stepper);

    stepper.on(Events.Click, function(event) {
        event.stopPropagation();
        event = Events.touchEvent(event);
        var curValue = parseInt(stepperValue.html);
        if (event.clientY - stepper.screenFrame.y < stepper.height / 2) {
            curValue++;
            setTotalServingsCount(currentTotalServingsCount + 1);
        } else {
            if (curValue > 0) {
                curValue--;
                setTotalServingsCount(currentTotalServingsCount - 1);
            }
        }
        stepperValue.html = curValue;
    });

    stepper.on("click", function(e) { e.stopPropagation(); });

    var stepperValue = new Layer({x:62,y:101,width:140,height:120});
    stepperValue.backgroundColor = "transparent";
    stepperValue.html = "1";
    stepper.addSubLayer(stepperValue);
});
favoriteRecipes.minY = 122;
favoriteRecipes.scrollVertical = false;
favoritesScreen.addSubLayer(favoriteRecipes);

var shoppingListScreen = new Layer({x:0,y:0,width:640,height:1000});
shoppingListScreen.backgroundColor = "white";
shoppingListScreen.visible = false;
favoritesScreen.addSubLayer(shoppingListScreen);
var shoppingListScreenContent = new Layer({x:40,y:29,width:580,height:356,image:"shoppingListScreen.png"});
shoppingListScreen.addSubLayer(shoppingListScreenContent);
shoppingListScreenContent.on(Events.Click, function() {
    shoppingListScreen.visible = false;
    servingSizeSteppers.forEach(function(stepper) { stepper.visible = false; });
    shoppingListHeader.visible = false;
});

var navbarFavorites = new Layer({x:0, y:1038, width:640, height:98,
                                image: "navbarFavorites.png"});
navbarFavorites.on(Events.Click, navbarClickHandler);
favoritesScreen.addSubLayer(navbarFavorites);

///////////////////////////////////////////////////////////////////////////////
// Recents screen
///////////////////////////////////////////////////////////////////////////////

var recentsScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(recentsScreen);
recentsScreen.backgroundColor = "white";

var recentsScreenContents = new Layer({x:0, y:40,width:640, height: 739,
                                      image: "recentsScreen.png"});
recentsScreen.addSubLayer(recentsScreenContents);

var navbarRecents = new Layer({x:0, y:1038, width:640, height:98,
                              image: "navbarRecents.png"});
navbarRecents.on(Events.Click, navbarClickHandler);
recentsScreen.addSubLayer(navbarRecents);

///////////////////////////////////////////////////////////////////////////////
// Profile screen
///////////////////////////////////////////////////////////////////////////////

var profileScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(profileScreen);
profileScreen.backgroundColor = "white";

var profileScreenContents = new Layer({x:19,y:36,width:598,height:863,image:"profileScreen.png"});
profileScreen.addSubLayer(profileScreenContents);

var navbarProfile = new Layer({x:0, y:1038, width:640, height:98, image: "navbarProfile.png"});
navbarProfile.on(Events.Click, navbarClickHandler);
profileScreen.addSubLayer(navbarProfile);

///////////////////////////////////////////////////////////////////////////////
// Recipe overview screen
///////////////////////////////////////////////////////////////////////////////

var htmlForIngredientsAndTools = function(servingSize) {
    var ingredients = [
        [1, "", "bone-in <a>turkey breast</a>"],
        [null, "", "<a>kosher salt</a>"],
        [null, "", "freshly ground <a>black pepper</a>"],
        [0.25, "cup", "<a>duck fat</a>"],
        [2, "tablespoons", "<a>unsalted butter</a>"],
        [1, "bunch", "<a>thyme</a>"],
        [4, "", "<a>garlic cloves</a>, smashed and peeled"],
        [0.5, "pound", "<a>green onions</a>"],
        [0.5, "cup", "low-sodium <a>vegetable stock</a>"],
        [2, "teaspoons", "<a>cream cheese</a>"],
    ];

    var tools = [
        "<a>oven</a>",
        "<a>paper towels</a>",
        "<a>cast-iron skillet</a>",
        "<a>meat thermometer</a>",
        "<a>saucepan</a>",
        "<a>slotted spoon</a>",
        "<a>blender</a>",
    ];

    var output = "<div class='content'><h3>Ingredients</h3>";

    output += "<ul>";
    ingredients.forEach(function(ingredient) {
        var quantity = servingSize * ingredient[0];
        var unit = ingredient[1];
        var name = ingredient[2];

        output += "<li>" +
            (quantity === 0 ? "" : quantity + " " + unit + " ") +
            name + "</li>";
    });
    output += "</ul>";

    output += "<h3>Tools</h3>";

    output += "<ul>";
    tools.forEach(function(tool) {
        output += "<li>" + tool + "</li>";
    });
    output += "</ul>";

    output += "</div>";

    return output;
};

var recipeOverviewScreen = new Layer({x:0,y:0,width:640,height:1136});
app.addSubLayer(recipeOverviewScreen);
recipeOverviewScreen.backgroundColor = "white";

var recipeOverviewHeader = new Layer({x:0,y:0,width:640,height:382,image:"recipeOverviewHeader.png"});
recipeOverviewScreen.addSubLayer(recipeOverviewHeader);

var recipeServingSizeIncrement = new Layer({x:500,y:0,width:140,height:80});
recipeServingSizeIncrement.backgroundColor = "transparent";
recipeOverviewHeader.addSubLayer(recipeServingSizeIncrement);
recipeServingSizeIncrement.on(Events.Click, function(event) {
    setRecipeServingSize(currentRecipeServingSize + 1);
});

var recipeServingSizeDecrement = new Layer({x:500,y:174,width:140,height:80});
recipeServingSizeDecrement.backgroundColor = "transparent";
recipeOverviewHeader.addSubLayer(recipeServingSizeDecrement);
recipeServingSizeDecrement.on(Events.Click, function(event) {
    setRecipeServingSize(currentRecipeServingSize - 1);
});

var recipeServingSizeNumber = new Layer({x:560,y:110,width:100,height:80});
recipeServingSizeNumber.backgroundColor = "transparent";
recipeServingSizeNumber.style.color = "white";
recipeOverviewHeader.addSubLayer(recipeServingSizeNumber);

var currentRecipeServingSize;
function setRecipeServingSize(servingSize) {
    if (servingSize < 1) servingSize = 1;
    currentRecipeServingSize = servingSize;
    recipeServingSizeNumber.html = servingSize;
    recipeOverviewContent.html = htmlForIngredientsAndTools(servingSize);
}

var recipeOverviewScrollview = new Layer({x:0,y:380,width:640,height:640});
recipeOverviewScrollview.backgroundColor = "transparent";
recipeOverviewScrollview.scrollVertical = true;
recipeOverviewScreen.addSubLayer(recipeOverviewScrollview);

var recipeOverviewContent = new Layer({x:30,y:30,width:590,height:1000});
recipeOverviewContent.backgroundColor = "transparent";
recipeOverviewScrollview.addSubLayer(recipeOverviewContent);

var recipeOverviewBottomOverlay = new Layer({x:0,y:980,width:640,height:157,image:"recipeBottomOverlay.png"});
recipeOverviewScreen.addSubLayer(recipeOverviewBottomOverlay);

var recipeOverviewBackButton = new Layer({x:22,y:1050,width:173,height:65,image:"recipeOverviewBackButton.png"});
recipeOverviewScreen.addSubLayer(recipeOverviewBackButton);
recipeOverviewBackButton.on(Events.Click, function() { switchToScreen(lastScreen); });

var recipeOverviewConfirmButton = new Layer({x:445,y:1050,width:173,height:65,
                                            image:"recipeOverviewConfirmButton.png"});
recipeOverviewScreen.addSubLayer(recipeOverviewConfirmButton);
recipeOverviewConfirmButton.on(Events.Click, function() {
    goToStep(0);
    var _lastScreen = lastScreen;
    switchToScreen(cookingScreen);
    lastScreen = _lastScreen;
});

setRecipeServingSize(1);

///////////////////////////////////////////////////////////////////////////////
// Cooking
///////////////////////////////////////////////////////////////////////////////

var cookingScreen = new Layer({x:0,y:0,width:640,height:1136});
cookingScreen.backgroundColor = "white";
app.addSubLayer(cookingScreen);

var cookingHeader = new Layer({x:0,y:0,width:640,height:70});
cookingHeader.backgroundColor = "#e9e9e9";
cookingScreen.addSubLayer(cookingHeader);

var cookingProgressBar = new Layer({x:0,y:0,width:0,height:70});
cookingProgressBar.backgroundColor = "#BED9C0";
cookingHeader.addSubLayer(cookingProgressBar);

var scrollIndicator = new Layer({x:0,y:0,width:10,height:70});
scrollIndicator.backgroundColor = "orange";
cookingHeader.addSubLayer(scrollIndicator);

var cookingQuitButton = new Layer({x:582,y:10,width:48,height:48,
                                  image:"quitRecipeButton.png"});
cookingHeader.addSubLayer(cookingQuitButton);
cookingQuitButton.on(Events.Click, function() {
    showQuitDialog();
});

var cookingHeaderText = new Layer({x:20,y:20,width:300,height:30});
cookingHeaderText.backgroundColor = "transparent";
cookingHeaderText.style.color = "#6e6e6e";
cookingHeaderText.style["font-size"] = "18pt";
cookingHeaderText.style["font-weight"] = "bold";
cookingHeaderText.on(Events.Click, function() { goToStep(currentStep); });
cookingHeader.addSubLayer(cookingHeaderText);

var cookingScrollView = new Layer({x:0,y:70,width:640,height:1066});
cookingScrollView.backgroundColor = "transparent";
cookingScrollView.scrollVertical = true;
cookingScreen.addSubLayer(cookingScrollView);

var _lastVisibleStep = 0;
cookingScrollView.on(Events.Scroll, function() {
    var pos = cookingScrollView.scrollY / 15400;
    scrollIndicator.x = pos * (14 * cookingHeader.width / 15);

    var visibleStep = Math.round(cookingScrollView.scrollY / 1100);
    if (_lastVisibleStep != visibleStep) {
        _lastVisibleStep = visibleStep;

        backToCurrentStep.visible = (visibleStep != currentStep);
        backToCurrentStep.bringToFront();
    }
});

var _cookingStepNumber = 0;
var cookingStep = function(image, title, body) {
    var step = new Layer({x:0, y:0, width: 640, height: 1066});
    step.backgroundColor = "transparent";

    var stepImage = new Layer({x:0, y: 0, width: 640, height: 425, image: image});
    step.addSubLayer(stepImage);

    _cookingStepNumber++;

    var stepText = new Layer({x:20, y: 445, width: 590, height: 470});
    stepText.backgroundColor = "transparent";
    stepText.html = "<div class='recipe content'><h3>" + _cookingStepNumber + ". " + title + "</h3>" +
        body + "</div>";
    step.addSubLayer(stepText);

    return step;
};

var steps = [
    ["recipeImage1.jpg",
     "Preheat the oven to <a data-convert='204°C'>400°F</a>.",
     "<h4>Why?</h4>" +
     "<p>When you don't preheat, you cook your food at a lower temperature " +
     "as your oven heats up for the first 5-15 minutes, depending on the " +
     "target temperature and your oven's strength. For forgiving foods, " +
     "like a casserole, this may not affect you much&mdash;you'll just " +
     "have to bake longer than the recipe says to.</p>"
    ],
    ["recipeImage2.jpg",
     "Prepare the turkey breast.",
     "<p>Pat the <a>turkey breast</a> dry with paper towels, season both sides " +
     "liberally with <a>kosher salt</a> and freshly ground <a>black pepper</a>.</p<"
    ],
    ["recipeImage3.jpg",
     "Prepare your skillet.",
     "<p>Heat a large <a>cast-iron skillet</a> over very high heat. As it heats up, " +
     "add <a data-convert='60mL'>1/4 cup</a> of <a>duck fat</a> to the skillet.</p>"
    ],
    ["recipeImage4.jpg",
     "Cook the turkey.",
     "<p>When the fat begins to shimmer, add the turkey breast, skin-side down, " +
     "and cook until dark golden brown. It will take 3 to 5 minutes.</p>"
    ],
    ["recipeImage5.jpg",
     "Remove skillet from heat.",
     "<p>Remove the skillet from heat, and remove the turkey from " +
     "the skillet. You can put it on a plate.</p>" +
     "<p>Stir <a data-convert='28 grams'>2 tablespoons</a> of <a>unsalted butter</a> into the pan juices.</p>"
    ],
    ["recipeImage6.jpg",
     "Put the turkey back in the skillet.",
     "<p>Arrange <a data-convert='~1oz'>1 bunch</a> of thyme branches in the " +
     "skillet to make a bed for the turkey.</p>" +
     "<p>Place the turkey, seared-side-up, on the thyme " +
     "and sprinkle <a data-convert='~20 grams'>4 cloves</a> of <a>smashed garlic</a> around the sides.</p>"
    ],
    ["recipeImage7.jpg",
     "Baste the turkey.",
     "<p>Basting is the process of brushing, pouring, or spooning " +
     "liquid over a food to make it moist and juicy from top to " +
     "bottom and to give it a wonderfully golden look when cooked.</p>" +
     "<p>Get the juices in the pan over the turkey until it’s " +
     "entirely covered."
    ],
    ["recipeImage8.jpg",
     "Roast the turkey.",
     "<p>Transfer the skillet to the oven.</p>" +
     "<p>Roast until meat thermometer inserted into the thickest " +
     "part of the breast without touching bone registers <a data-convert='68°C'>155°F</a>. " +
     "It will take about one hour. Baste every 15 minutes."
    ],
    ["recipeImage9.jpg",
     "Prepare the puree.",
     "<p>While the turkey roasts, let’s prepare the green onion puree.</p>" +
     "<p>In a medium saucepan, heat <a data-convert='118mL'>1/2 cup</a> of <a>vegetable stock</a> over " +
     "medium-high heat.</p>"
    ],
    ["recipeImage10.jpg",
     "Prepare the green onions.",
     "<p>Trim the ends off, then roughly chop <a data-convert='227 grams'>1/2 pound</a> of <a>green onions</a>.</p>"
    ],
    ["recipeImage11.jpg",
     "Add green onions to saucepan.",
     "<p>Pour the chopped green onions into vegetable stock. Keep the " +
     "saucepan on medium-high and simmer until the green onion becomes " +
     "tender. This will take about 5 minutes.</p>"
    ],
    ["recipeImage12.jpg",
     "Blend the green onions.",
     "<p>Using a slotted spoon, transfer the green onions to a " +
     "blender, saving the liquids in the saucepan.</p>" +
     "<p>Blend on high until very smooth, about 5 minutes. " +
     "Add a splash of <a>cooking liquid</a> if necessary to help " +
     "the blender puree.</p>"
    ],
    ["recipeImage13.jpg",
     "Add cream cheese.",
     "<p>Add the <a>cream cheese</a> and blend for 2 more minutes. " +
     "Season with salt to taste.</p>"
    ],
    ["recipeImage14.jpg",
     "Wait for turkey to roast.",
     "<p>Once the meat thermometer registers <a data-convert='78°C'>155°F</a>, baste " +
     "once more and transfer the turkey to a platter.</p>" +
     "<p>Let the turkey rest for at least 20 minutes before " +
     "slicing and serving.</p>"
    ],
    ["recipeImage15.jpg",
     "Serve the turkey.",
     "<p>Slice the turkey breast across the grain and serve " +
     "with green-onion puree.</p><p>Enjoy!</p>"
    ],
];

steps.forEach(function(step, i) {
    var stepLayer = cookingStep.apply(null, step);
    stepLayer.minY = i * 1100;
    cookingScrollView.addSubLayer(stepLayer);
});

var currentStep = 0;

var goToStep = function(step) {
    if (step < 0) step = 0;
    if (step > steps.length) step = steps.length;

    backToCurrentStep.html = "Back to step " + (step + 1);

    if (step === 0) {
        timers.forEach(function(timer) {
            timer.destroy();
        });
        timers.length = 0;
    }

    if (currentStep == 7 && step == 8) {
        addTimer(15*60);
    }

    currentStep = step;

    if (step == steps.length) {
        doneRecipeScreen.visible = true;
    } else {
        doneRecipeScreen.visible = false;
        cookingHeaderText.html = "Step " + (step + 1) + " of " + (steps.length);
        cookingProgressBar.animate({
            properties: { width: step * 640 / steps.length },
            time: 0.3,
        });

        if (step === 0) {
            setTimeout(function() {
                cookingScrollView.scrollY = 0;
            }, 0);
        } else {
            cookingScrollView.animate({
                properties: { scrollY: step * 1100 },
                time: 0.3,
            });
        }
    }
};

var cookingFooter = new Layer({x:0,y:980,width:640,height:157,
                              image:"recipeBottomOverlay.png"});
cookingFooter.clip = false;
cookingScreen.addSubLayer(cookingFooter);

var cookingQuestionButton = new Layer({x:20,y:65,width:72,height:65,
                                      image:"recipeQuestionButton.png"});
cookingFooter.addSubLayer(cookingQuestionButton);

var cookingDoneButton = new Layer({x:422,y:65,width:194,height:65,
                                      image:"recipeDoneButton.png"});
cookingFooter.addSubLayer(cookingDoneButton);
cookingDoneButton.on(Events.Click, function() {
    goToStep(currentStep + 1);
});

var timers = [];
function secondsToClock(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds - mins * 60;
    return mins + ":" + (secs < 10 ? "0" + secs : secs);
}

function addTimer(startSeconds) {
    var timer = new Layer({x:107 + timers.length * 127, y:65, width: 117, height: 65,
                          image: "timerButton.png"});
    timer.clip = false;
    timers.push(timer);
    cookingFooter.addSubLayer(timer);

    var timerText = new Layer({x:20,y:17,height:45,width:97});
    timerText.backgroundColor = "transparent";
    timerText.style.color = "#737E90";
    timerText.html = secondsToClock(startSeconds);
    timer.addSubLayer(timerText);

    var timerTooltip = new Layer({x:-80, y:-146, width:291, height:165,
                                 image: "timerTooltip.png"});
    timer.addSubLayer(timerTooltip);
    setTimeout(function() {
        timerTooltip.visible = false;
    }, 2000);

    timer.on(Events.Click, function() {
        timerTooltip.visible = !timerTooltip.visible;
    });

    var interval = setInterval(function() {
        startSeconds--;
        timerText.html = secondsToClock(startSeconds);

        if (startSeconds <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}

var backToCurrentStep = new Layer({x:20,y:65,width:596,height:65,
                                   image:"backToCurrentStep.png"});
backToCurrentStep.visible = false;
backToCurrentStep.style["text-align"] = "center";
backToCurrentStep.style.color = "#555";
backToCurrentStep.style["font-weight"] = "bold";
backToCurrentStep.style["padding-top"] = "16px";
cookingFooter.addSubLayer(backToCurrentStep);
backToCurrentStep.on(Events.Click, function() { goToStep(currentStep); });

var doneRecipeScreen = new Layer({x:0,y:0,width:640,height:1136,
                                 image:"doneRecipeScreen.png"});
doneRecipeScreen.visible = false;
doneRecipeScreen.on(Events.Click, function() {
    switchToScreen(lastScreen);
});
cookingScreen.addSubLayer(doneRecipeScreen);

goToStep(0);

///////////////////////////////////////////////////////////////////////////////
// Helper functions
///////////////////////////////////////////////////////////////////////////////

var popoverStack = [];
var popoverOverlay = new Layer({x:0,y:0,width:640,height:1136});
popoverOverlay.backgroundColor = "rgba(0, 0, 0, 0.7)";
popoverOverlay.center();
popoverOverlay.visible = false;

function pushPopover(title, htmlContent) {
    popoverOverlay.visible = true;

    var popoverFrame = new Layer({x:0,y:92+popoverStack.length*15,
                                 width:639,height:1043,
                                 image:"popoverFrame.png"});

    popoverFrame.on(Events.Click, function(event) {
        event = Events.touchEvent(event);
        if (event.clientX - popoverFrame.screenFrame.x > 530 &&
            event.clientY - popoverFrame.screenFrame.y < 100) {
            popPopover();
        }
    });

    popoverFrame.html = "<div class='popover content'>" +
        "<h3>" + title + "</h3>" +
        (htmlContent || "") +
        "</div>";

    if (title == "vegetable stock") {
        var content = new Layer({x:40,y:0,width:570,height:510,
                                image:"popoverVegetableStockContent.png"});
        popoverFrame.addSubLayer(content);

        content.on(Events.Click, function() {
            pushPopover("chicken stock");
        });
    }

    popoverOverlay.addSubLayer(popoverFrame);
    popoverFrame.bringToFront();
    popoverStack.push(popoverFrame);

    return popoverFrame;
}

function popPopover() {
    var popover = popoverStack.pop();
    if (popover) {
        popover.destroy();
    }

    popoverOverlay.visible = popoverStack.length > 0;
}

function toggleViews(views, viewToShow) {
    views.forEach(function(view) {
        view.visible = (view == viewToShow);
    });
}

function switchToScreen(screen) {
    if (currentScreen != screen) {
        lastScreen = currentScreen;
        currentScreen = screen;

        screens.forEach(function(s) {
            s.visible = (s == screen);
        });
    }
}

function navbarClickHandler(event) {
    event = Events.touchEvent(event);
    var x = event.pageX - app.minX;
    if (x < 160) {
        switchToScreen(discoverScreen);
    } else if (x < 320) {
        switchToScreen(favoritesScreen);
    } else if (x < 480) {
        switchToScreen(recentsScreen);
    } else {
        switchToScreen(profileScreen);
    }
}

var tooltips = [];
function showTooltip(text, x, y) {
    var tooltip = new Layer({x: x, y: y, width: 200});
    tooltip.backgroundColor = "transparent";
    tooltip.html = "<div class='tooltip'>" + text + "</div>";
    tooltips.push(tooltip);

    setTimeout(function() {
        var i = tooltips.indexOf(tooltip);
        if (i != -1) {
            tooltip.destroy();
            tooltips.splice(i, 1);
        }
    }, 1500);
}

var quitDialog = new Layer({x:0,y:0,width:540,height:249,
                           image:"quitRecipeDialog.png"});
quitDialog.visible = false;
quitDialog.center();

var quitDialogCancelButton = new Layer({x:0,y:160,width:270,height:90});
quitDialogCancelButton.backgroundColor = 'transparent';
quitDialog.addSubLayer(quitDialogCancelButton);
quitDialogCancelButton.on(Events.Click, function() { hideQuitDialog(); });

var quitDialogQuitButton = new Layer({x:275,y:160,width:270,height:90});
quitDialogQuitButton.backgroundColor = 'transparent';
quitDialog.addSubLayer(quitDialogQuitButton);
quitDialogQuitButton.on(Events.Click, function() {
    switchToScreen(lastScreen);
    hideQuitDialog();
});

function showQuitDialog() {
    popoverOverlay.visible = true;
    quitDialog.visible = true;
    quitDialog.bringToFront();
}

function hideQuitDialog() {
    popoverOverlay.visible = false;
    quitDialog.visible = false;
}

///////////////////////////////////////////////////////////////////////////////
// Initialization
///////////////////////////////////////////////////////////////////////////////

var lastScreen = discoverScreen;
var screens = [discoverScreen, favoritesScreen, recentsScreen, profileScreen,
               recipeOverviewScreen, cookingScreen];
var currentScreen = null;
switchToScreen(discoverScreen);

document.body.addEventListener("click", function(event) {
    tooltips.forEach(function(tooltip) {
        tooltip.destroy();
    });
    tooltips.length = 0;

    event = Events.touchEvent(event);
    var node = event.toElement;
    if (node.nodeName == "A") {
        if (node.attributes["data-convert"]) {
            showTooltip(node.attributes["data-convert"].value, event.clientX - 60, event.clientY - 80);
        } else {
            pushPopover(node.innerText);
        }
    }
});
