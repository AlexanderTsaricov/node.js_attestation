const changeButton = document.querySelector(".changeBox_button");

changeButton.addEventListener("click", function (event) {
    event.preventDefault();
    const username = changeButton.getAttribute("data-username");
    const parent = changeButton.parentElement;
    const newUsername = parent.querySelector("#name").value;
    const newEmail = parent.querySelector("#email").value;
    const newTelephone = parent.querySelector("#telephone").value;
    const newUserData = { username: newUsername, email: newEmail, telephone: newTelephone };

    fetch(`/users/${username}/changeUser/change`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error during user change");
            }
            location.href = "/users";
        })
        .catch((error) => console.error("Error:", error));
});
