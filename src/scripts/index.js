// Helper methods
const setValue = (key, value) => localStorage.setItem(key, value);
const getValue = key => localStorage.getItem(key);
const byId = id => document.getElementById(id);
const UNSPLASH_BASE_URL = "https://api.unsplash.com/photos/random?orientation=landscape";

window.onload = () => initialize();

/**
 * Initialize the tab page
 */
function initialize() {
	if (getValue("collectionId") === null && getValue("apiKey") === null) {
		byId("dialog").classList.toggle("hidden");
		byId("get-started").addEventListener("click", () => {
			setValue("collectionId", byId("collection-id").value);
			setValue("apiKey", byId("api-key").value);
			byId("dialog").classList.toggle("hidden");
			initialize();
		})
	} else {
		getTime();
		getWallpaper();
		byId("background-overlay").addEventListener("dblclick", () => skipImage());
	}
}

/**
 * Get the time every second
 */
setInterval(getTime, 1000);

/**
 * Get a new wallpaper
 */
function getWallpaper() {
	//If the current date is later than the expiry date
	if (getValue("expiryDate") < new Date().getTime()) clearCache();

	//If there is a wallpaper, show it
	if (getValue("unsplash")) {
		applyWallpaper(getValue("image"), getValue("link"), getValue("thumbnail"));
	} else {
		//Retrieve new wallpaper
		fetch(`${UNSPLASH_BASE_URL}&collections=${getValue("collectionId")}
		&client_id=${getValue("apiKey")}&id=4Cjn0FDEud8`, {
			method: "GET",
		}).then(response => response.json()).then(result => {
			if (!result.errors) {
				let image = result.urls.raw;
				let thumbnail = result.urls.thumb;
				let link = result.links.html;
				applyWallpaper(image, link, thumbnail);

				//Save the url to localStorage
				let expiryDate = new Date().getTime() + (72 * 1000);
				setValue("unsplash", "set");
				setValue("image", image);
				setValue("thumbnail", thumbnail);
				setValue("link", link);
				setValue("expiryDate", expiryDate);
			} else {
				//TODO handle errors
			}
		})
	}
}

/**
 * Apply the wallpaper to the body
 * @param image to apply
 * @param link for copyright and finding the image
 * @param thumbnail Thumbnail used for lazy loading
 */
function applyWallpaper(image, link, thumbnail) {
	byId("link").addEventListener("click", () => go(link));
	byId("thumbnail-background-overlay").style.backgroundImage = `url(${thumbnail})`;
	byId("image-background-overlay").style.backgroundImage = `url(${image})`;
}

/**
 * Skip image
 */
function skipImage() {
	clearCache();
	getWallpaper();
}

/**
 * Clear the cache, preserving the API key and collection ID
 */
function clearCache() {
	const apiKey = getValue("apiKey");
	const collectionId = getValue("collectionId");
	localStorage.clear();
	setValue("apiKey", apiKey);
	setValue("collectionId", collectionId);
}

/**
 * Generate displayable time
 */
function getTime() {
	let now = new Date();
	let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

	byId("time").innerHTML = now.getHours() + ":" + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes());
	byId("date").innerHTML = now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear();
}

/**
 * Go to original wallpaper link
 * @param link of original wallpaper
 */
function go(link) {
	window.open(link, "_blank");
}