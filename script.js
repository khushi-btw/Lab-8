
document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "profileHubUser";

    // Read saved information from localStorage
    function getUser() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
        }
    }

    // ---------------- REGISTRATION PAGE ----------------

    const userForm = document.getElementById("userForm");

    if (userForm) {
        const formMessage = document.getElementById("formMessage");

        // Restore saved information when editing
        const savedUser = getUser();

        if (savedUser && typeof savedUser === "object") {
            ["name", "mobile", "email", "city", "state", "country"]
                .forEach(function (field) {
                    const input = document.getElementById(field);

                    if (input && typeof savedUser[field] === "string") {
                        input.value = savedUser[field];
                    }
                });

            const genderInput = userForm.querySelector(
                'input[name="gender"][value="' +
                savedUser.gender + '"]'
            );

            if (genderInput) {
                genderInput.checked = true;
            }
        }

        // Clear the custom message when the user starts correcting inputs
        userForm.addEventListener("input", function () {
            formMessage.textContent = "";
        });

        // Handle form submission
        userForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formMessage.textContent = "";

            const name = document.getElementById("name").value.trim();
            const mobile = document.getElementById("mobile").value.trim();
            const email = document.getElementById("email").value.trim();
            const city = document.getElementById("city").value.trim();
            const state = document.getElementById("state").value.trim();
            const country = document.getElementById("country").value.trim();

            const selectedGender = userForm.querySelector(
                'input[name="gender"]:checked'
            );

            // Validate required text fields
            if (!name || !mobile || !email ||
                !city || !state || !country || !selectedGender) {
                formMessage.textContent =
                    "Please fill in all fields and select your gender.";
                return;
            }

            // Validate name
            if (name.length < 2) {
                formMessage.textContent =
                    "Please enter a name with at least 2 characters.";
                return;
            }

            // Validate a 10-digit mobile number
            if (!/^[0-9]{10}$/.test(mobile)) {
                formMessage.textContent =
                    "Please enter a valid 10-digit mobile number.";
                return;
            }

            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                formMessage.textContent =
                    "Please enter a valid email address.";
                return;
            }

            // Collect all seven fields
            const user = {
                name: name,
                gender: selectedGender.value,
                mobile: mobile,
                email: email,
                city: city,
                state: state,
                country: country
            };

            // Save the information
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

                // Navigate to the profile page
                window.location.href = "display.html";
            } catch (error) {
                formMessage.textContent =
                    "Unable to save your profile. Please check your browser settings.";
            }
        });
    }

    // ---------------- PROFILE DISPLAY PAGE ----------------

    const contactDetails = document.getElementById("contactDetails");

    if (contactDetails) {
        const profileCard = document.getElementById("profileCard");
        const emptyState = document.getElementById("emptyState");
        const user = getUser();

        if (!user || typeof user !== "object" ||
            !user.name || !user.gender || !user.mobile ||
            !user.email || !user.city || !user.state ||
            !user.country) {

            profileCard.hidden = true;
            emptyState.hidden = false;

        } else {
            profileCard.hidden = false;
            emptyState.hidden = true;

            // Display the name and avatar
            document.getElementById("profileName").textContent = user.name;
            document.getElementById("avatar").textContent =
                user.name.trim().charAt(0).toUpperCase();
            document.getElementById("profileGender").textContent =
                user.gender;

            // Create profile detail rows safely
            function addDetail(container, icon, label, value) {
                const row = document.createElement("div");
                row.className = "detail-row";

                const iconBox = document.createElement("div");
                iconBox.className = "detail-icon";
                iconBox.textContent = icon;

                const content = document.createElement("div");
                content.className = "detail-content";

                const labelElement = document.createElement("p");
                labelElement.className = "detail-label";
                labelElement.textContent = label;

                const valueElement = document.createElement("p");
                valueElement.className = "detail-value";
                valueElement.textContent = value;

                content.append(labelElement, valueElement);
                row.append(iconBox, content);
                container.appendChild(row);
            }

            // Contact information
            addDetail(contactDetails, "☎", "Mobile Number", user.mobile);
            addDetail(contactDetails, "✉", "Email Address", user.email);

            // Location information
            const locationDetails =
                document.getElementById("locationDetails");

            addDetail(locationDetails, "⌖", "City", user.city);
            addDetail(locationDetails, "◇", "State / Province", user.state);
            addDetail(locationDetails, "◎", "Country", user.country);
        }

        // Edit button: return to the form.
        // Saved values are automatically restored there.
        const editButton = document.getElementById("editButton");

        editButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "index.html";
        });

        // Clear the saved profile
        document.getElementById("clearButton")
            .addEventListener("click", function () {
                const confirmed = window.confirm(
                    "Are you sure you want to clear your saved profile?"
                );

                if (confirmed) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.href = "index.html";
                }
            });
    }

});
