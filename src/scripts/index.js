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
		byId("link").addEventListener("click", () => go(getValue("link")));
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
	byId("thumbnail-background-overlay").style.backgroundImage = `url(${thumbnail})`;
	byId("image-background-overlay").style.backgroundImage = `url(${image})`;

	if (localStorage.getItem("automaticDateTimeTextColorEnabled")) {
		// User enabled automatic date / time text color. For getting the
		// primary color only get the middle section of the thumbnail
		const thumbWidth = new URLSearchParams(thumbnail).get("w");
		const croppedThumbnail = thumbnail
				.replace("fit=max", "fit=crop")
				.replace("q=80", "q=100")
				.replace("crop=entropy", "crop=focalpoint") +
			`&h=${thumbWidth * 0.8}&fp-x=.5&fp-y=.5&fp-z=3`;
		changeDateTimeColorBasedOnBackground(croppedThumbnail)
	}
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

/**
 * Decide whether to use a white or black text color depending on the color it is being displayed on. If there is white background,
 * a black text should be used, and vice versa.
 *
 * @param red Red
 * @param green Green
 * @param blue Blue
 * @returns {boolean} Use white
 */
function useWhite(red, green, blue) {
	return (red * 0.299 + green * 0.587 + blue * 0.114) <= 125;
}

/**
 * Change the text color of the date and the time based on the background behind it. The most dominant color will
 * be extracted, and according to the W3C spec, a luminance will be returned which can be used to determine whether
 * to use black or white text
 *
 * @param image Image to get most dominant color from
 */
function changeDateTimeColorBasedOnBackground(image) {
	new TinyColorExtractor({src: image, colorCount: 5, quality: 10, tolerance: 5}, function (data) {
		if (Array.isArray(data) && data.length > 1) {
			const textColor = useWhite(data[0][0], data[0][1], data[0][2]) ? "#FFFFFF" : "#000000";

			byId("time").style.color = textColor;
			byId("date").style.color = textColor;

			byId("background-overlay").className = `radial-gradient-effect-${useWhite ? "black" : "white"}`;
			byId("image-background-overlay").className = `radial-gradient-effect-${useWhite ? "black" : "white"}`;
			byId("thumbnail-background-overlay").className = `radial-gradient-effect-${useWhite ? "black" : "white"}`;
		}
	});
}