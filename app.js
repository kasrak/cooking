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
    };

    var i;
    var itemHeight = 254;
    for (i = 0; i < numRecipes; i++) {
        var recipeListItem = new Layer({x:0, y: i * (itemHeight + 10),
                                       width: 640, height: itemHeight,
                                       image: "recipeListItem.png"});
        scrollView.addSubLayer(recipeListItem);

        var favoriteStar = new Layer({x:582, y:21, width:38, height:36,
                                     image: "favoriteStar.png"});
        favoriteStar.opacity = 0;
        favoriteStar.on(Events.Click, toggleFavorite);
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

var navbarDiscover = new Layer({x:0, y:1038, width:640, height:98, image: "navbarDiscover.png"});
navbarDiscover.on(Events.Click, navbarClickHandler);
discoverScreen.addSubLayer(navbarDiscover);

var searchBar = new Layer({x:21, y:21, width:598, height:80, image: "searchBar.png"});
discoverScreen.addSubLayer(searchBar);
searchBar.on(Events.Click, function() {
    searchBar.visible = false;
    searchBarExpanded.visible = true;
    showKeyboard();
});

var searchBarExpanded = new Layer({x:21, y:21, width:598, height:400, image: "searchBarExpanded.png"});
discoverScreen.addSubLayer(searchBarExpanded);
searchBarExpanded.visible = false;
searchBarExpanded.on(Events.Click, function() {
    searchBar.visible = true;
    searchBarExpanded.visible = false;
    hideKeyboard();
});

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
var shoppingListScreenContent = new Layer({x:40,y:29,width:580,height:357,image:"shoppingListScreen.png"});
shoppingListScreen.addSubLayer(shoppingListScreenContent);
shoppingListScreenContent.on(Events.Click, function() {
    shoppingListScreen.visible = false;
    servingSizeSteppers.forEach(function(stepper) { stepper.visible = false; });
    shoppingListHeader.visible = false;
});

var navbarFavorites = new Layer({x:0, y:1038, width:640, height:98, image: "navbarFavorites.png"});
navbarFavorites.on(Events.Click, navbarClickHandler);
favoritesScreen.addSubLayer(navbarFavorites);

///////////////////////////////////////////////////////////////////////////////
// Recents screen
///////////////////////////////////////////////////////////////////////////////

var recentsScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(recentsScreen);
recentsScreen.backgroundColor = "white";

var navbarRecents = new Layer({x:0, y:1038, width:640, height:98, image: "navbarRecents.png"});
navbarRecents.on(Events.Click, navbarClickHandler);
recentsScreen.addSubLayer(navbarRecents);

///////////////////////////////////////////////////////////////////////////////
// Profile screen
///////////////////////////////////////////////////////////////////////////////

var profileScreen = new Layer({x:0, y:0, width:640, height:1136});
app.addSubLayer(profileScreen);
profileScreen.backgroundColor = "white";

var navbarProfile = new Layer({x:0, y:1038, width:640, height:98, image: "navbarProfile.png"});
navbarProfile.on(Events.Click, navbarClickHandler);
profileScreen.addSubLayer(navbarProfile);

///////////////////////////////////////////////////////////////////////////////
// Helper functions
///////////////////////////////////////////////////////////////////////////////

function toggleViews(views, viewToShow) {
    views.forEach(function(view) {
        view.visible = (view == viewToShow);
    });
}

function switchToScreen(screen) {
    if (currentScreen != screen) {
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

var screens = [discoverScreen, favoritesScreen, recentsScreen, profileScreen];
var currentScreen = null;
switchToScreen(discoverScreen);
