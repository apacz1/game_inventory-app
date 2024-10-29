async function deleteGame(gameName, genreName) {
  if (confirm("Are you sure you want to delete this game?")) {
    try {
      await fetch(`/genres/${genreName}/${gameName}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
