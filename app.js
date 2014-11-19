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

setRecipeServingSize(1);

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

///////////////////////////////////////////////////////////////////////////////
// Initialization
///////////////////////////////////////////////////////////////////////////////

var lastScreen = discoverScreen;
var screens = [discoverScreen, favoritesScreen, recentsScreen, profileScreen,
               recipeOverviewScreen];
var currentScreen = null;
switchToScreen(discoverScreen);

document.body.addEventListener("click", function(event) {
    if (event.toElement.nodeName == "A") {
        pushPopover(event.toElement.innerText);
    }
});
