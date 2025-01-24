const deleteButton = document.querySelectorAll(".delete");
deleteButton.forEach((element) => {
    element.addEventListener("click", function (event) {
        event.preventDefault();
        const username = element.getAttribute("data-username");
        console.log(`/users/${username}/delete`);
        fetch(`/users/${username}/delete`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    alert("User deleted successfully");
                    location.reload();
                } else {
                    alert("Error deleting user");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});
