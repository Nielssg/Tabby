let automaticDateTimeTextColorEnabled = localStorage.getItem("automaticDateTimeTextColorEnabled") || false;
const unsplashCollectionUrlRegex = /(?!\/collections\/)([0-9].*)(?:[0-9])/g;
const byId = id => document.getElementById(id);

window.onload = () => {
	byId("collection-id").value = localStorage.getItem("collectionId");
	byId("api-key").value = localStorage.getItem("apiKey");

	const thumbnailUrl = defaultCollection[parseInt(Math.random() * defaultCollection.length)].urls.regular;
	byId("background-overlay").style.backgroundImage = `url("${thumbnailUrl}")`;
	byId("background-overlay").classList.toggle("blur");

	byId("collection-id").addEventListener("paste", event => {
		const pastedContent = (event.clipboardData).getData("text");
		const matchResults = pastedContent.match(unsplashCollectionUrlRegex);
		event.preventDefault();

		if (matchResults !== null && matchResults.length > 0) {
			byId("collection-id").value = matchResults[0];
		}
	});

	byId("get-started").addEventListener("click", () => {
		localStorage.setItem("collectionId", byId("collection-id").value);
		localStorage.setItem("apiKey", byId("api-key").value);
		localStorage.setItem("automaticDateTimeTextColorEnabled", automaticDateTimeTextColorEnabled)
		byId("settings").classList.toggle("hidden");
		byId("saved").classList.toggle("hidden");
		setTimeout(window.close, 1000);
	});

	if (automaticDateTimeTextColorEnabled) byId("automatic-date-time-text-color").classList.toggle("checked");

	byId("automatic-date-time-text-color").addEventListener("click", () => {
		automaticDateTimeTextColorEnabled = !automaticDateTimeTextColorEnabled;
		byId("automatic-date-time-text-color").classList.toggle("checked");
	});
};