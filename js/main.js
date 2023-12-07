const dropdowns = document.querySelectorAll(".dropdown-container");
const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");
const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");
const inputLanguage = inputLanguageDropdown.querySelector(".selected");
const outputLanguage = outputLanguageDropdown.querySelector(".selected");
const inputChars = document.querySelector("#input-chars");
const swapBtn = document.querySelector(".swap-position");
const darkModeBtn = document.getElementById("dark-mode-btn");
const uploadDocument = document.querySelector('#upload-document');
const uploadTitle = document.querySelector('#upload-title')
const downloadDocument = document.querySelector("#download-document");

darkModeBtn.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

function populateDropdown(dropdown, options) {
    options.forEach((option) => {
        const li = document.createElement("li");
        const title = `${option.name} (${option.native})`;
        li.innerHTML = title;
        li.dataset.value = option.code;
        li.className = "option";
        dropdown.querySelector("ul").appendChild(li);
    });
}
populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

const openAndCloseList = () => dropdowns.forEach((dropdown) => dropdown.addEventListener("click", () => dropdown.classList.toggle("active")))
openAndCloseList()

document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => (!dropdown.contains(e.target)) ? dropdown.classList.remove("active") : "");
});

function swapLanguageActive() {
    dropdowns.forEach((dropdown) => {
        dropdown.querySelectorAll(".option").forEach((item) => {
            if (dropdown.id == "input-language") {
                inputLanguage.innerHTML == item.innerHTML ? item.classList.add("active") : item.classList.remove("active")
            }
            if (dropdown.id == "output-language") {
                outputLanguage.innerHTML == item.innerHTML ? item.classList.add("active") : item.classList.remove("active")
            }
            item.addEventListener("click", () => {
                dropdown.querySelectorAll(".option").forEach((ele) => ele.classList.remove("active"));
                item.classList.add("active");
                const selected = dropdown.querySelector(".dropdown-toggle .selected");
                selected.innerHTML = item.innerHTML;
                selected.dataset.value = item.dataset.value;
                translate();
            });
        });
    });
}
swapLanguageActive()

function translate() {
    const inputText = inputTextElem.value;
    const inputLanguageVal = inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguageVal = outputLanguageDropdown.querySelector(".selected").dataset.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguageVal}&tl=${outputLanguageVal}&dt=t&q=${encodeURI(inputText)}`;
    fetch(url)
        .then(result => result.json())
        .then(data => outputTextElem.value = inputTextElem.value !== "" ? data[0].map(item => item[0]).join("") : "")
        .catch(err => alert(`Please Try Again...!`));
};

inputTextElem.addEventListener("input", () => {
    inputTextElem.value.length > 5000 ? inputTextElem.value = inputTextElem.value.slice(0, 5000) : inputTextElem.value;
    inputChars.innerHTML = inputTextElem.value.length;
    translate();
});

swapBtn.addEventListener("click", () => {
    [inputLanguage.innerHTML, outputLanguage.innerHTML, outputTextElem.value, inputTextElem.value] = [outputLanguage.innerHTML, inputLanguage.innerHTML, inputTextElem.value, outputTextElem.value];
    [inputLanguage.dataset.value, outputLanguage.dataset.value] = [outputLanguage.dataset.value, inputLanguage.dataset.value];
    swapLanguageActive()
    translate();
});

uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "text/plain") {
        uploadTitle.innerHTML = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            inputTextElem.value = e.target.result;
            translate();
        };
    } else {
        alert(`Please select a valid file (.pdf | .doc | .txt)`);
    };
});

downloadDocument.addEventListener("click", (e) => {
    const outputText = outputTextElem.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").innerHTML;
    if (outputText) {
        const blob = new Blob([outputText], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `translated-to-${outputLanguage}.txt`;
        a.href = url;
        a.click();
    };
});