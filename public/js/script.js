const form = document.getElementById("form");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let isValid = true;

    const inputs = form.querySelectorAll("input, textarea");

    inputs.forEach(input => {

        const validMsg = input.parentElement.querySelector(".valid-feedback");
        const invalidMsg = input.parentElement.querySelector(".invalid-feedback");

        if (input.hasAttribute("required") && input.value.trim() === "") {
            isValid = false;

            input.classList.add("border-red-500");
            input.classList.remove("border-green-500");

            if (invalidMsg) invalidMsg.classList.remove("hidden");
            if (validMsg) validMsg.classList.add("hidden");

        } else {

            input.classList.remove("border-red-500");
            input.classList.add("border-green-500");

            if (invalidMsg) invalidMsg.classList.add("hidden");
            if (validMsg) validMsg.classList.remove("hidden");

        }

    });

    if (isValid) {
        form.submit();
    }
});