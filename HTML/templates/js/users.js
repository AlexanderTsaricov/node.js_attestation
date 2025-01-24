const deleteButton = document.querySelectorAll(".delete");
const userDataLists = document.querySelectorAll(".userBox_dataList");

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

userDataLists.forEach((userDataList) => {
    userDataList.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const username =
                event.target.parentElement.querySelector(
                    ".userBox_name"
                ).textContent;
            fetch(`/users/${username}`, {
                method: "GET",
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("go to user");
                        location.href = `/users/${username}`;
                    } else {
                        alert("Error user click");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    });
});
