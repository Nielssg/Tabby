let automaticDateTimeTextColorEnabled = localStorage.getItem("automaticDateTimeTextColorEnabled") || false;

window.onload = () => {
	const byId = id => document.getElementById(id);
	byId("collection-id").value = localStorage.getItem("collectionId");
	byId("api-key").value = localStorage.getItem("apiKey");

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