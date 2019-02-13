window.onload = () => {
	const byId = id => document.getElementById(id);
	byId("collection-id").value = localStorage.getItem("collectionId");
	byId("api-key").value = localStorage.getItem("apiKey");

	byId("get-started").addEventListener("click", () => {
		localStorage.setItem("collectionId", byId("collection-id").value);
		localStorage.setItem("apiKey", byId("api-key").value);
	});
};