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

function listOfRecipes(numRecipes) {
    var scrollView = new Layer({x:0, y:0, width:640, height: 1136});
    scrollView.backgroundColor = "white";

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
    }

    return scrollView;
}

var discoverRecipes = listOfRecipes(5);
discoverRecipes.minY = 122;
discoverRecipes.height = 916;
discoverRecipes.scrollVertical = true;
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
