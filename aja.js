// ==========================================
// SIDEBAR ACTIVE SECTION
// ==========================================

const sections = document.querySelectorAll(".article-section");
const links = document.querySelectorAll(".sidebar-link");
const sidebarItems = document.querySelectorAll(".sidebar-item");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const sectionId = entry.target.id;

            links.forEach((link) => {
                link.classList.remove("active");
            });

            sidebarItems.forEach((item) => {
                item.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `.sidebar-link[data-target="${sectionId}"]`
            );

            const activeItem = document.querySelector(
                `.sidebar-item[data-sidebar-item="${sectionId}"]`
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }

            if (activeItem) {
                activeItem.classList.add("active");
            }

        });

    },
    {
        root: null,
        threshold: 0.25,
    }
);

sections.forEach((section) => {
    observer.observe(section);
});


// ==========================================
// ELEMENTS
// ==========================================

const publishButton = document.querySelector("#publishButton");
const editButton = document.querySelector("#editButton");
const statusBox = document.querySelector("#statusBox");


// ==========================================
// SELECTED ELEMENT
// ==========================================

let selectedElement = null;


// ==========================================
// SELECT INPUT
// ==========================================

document.addEventListener("focusin", (event) => {

    const element = event.target;

    if (!element.classList.contains("editable-input")) {
        return;
    }

    selectElement(element);

    updateStatus("تم تحديد حقل الكتابة");

});


// ==========================================
// SELECT PUBLISHED TEXT
// ==========================================

document.addEventListener("click", (event) => {

    const element = event.target.closest(".published-text");

    if (!element) {
        return;
    }

    selectElement(element);

    updateStatus("تم تحديد النص");

});


// ==========================================
// SELECT ELEMENT
// ==========================================

function selectElement(element) {

    selectedElement = element;

}


// ==========================================
// INPUT STATUS
// ==========================================

document.addEventListener("input", (event) => {

    const element = event.target;

    if (!element.classList.contains("editable-input")) {
        return;
    }

    selectedElement = element;

    updateStatus("جاري الكتابة...");

});


// ==========================================
// INDIVIDUAL PUBLISH BUTTONS
// ==========================================

document.querySelectorAll(".publish-section").forEach((button) => {

    button.addEventListener("click", () => {

        const sectionName = button.dataset.target;

        const section = document.querySelector(
            `#${sectionName}`
        );

        if (!section) {
            return;
        }

        const input = findEditableElement(section);

        if (!input) {
            alert("لا يوجد حقل قابل للتثبيت في هذا القسم.");
            return;
        }

        publishElement(input);

    });

});


// ==========================================
// INDIVIDUAL EDIT BUTTONS
// ==========================================

document.querySelectorAll(".edit-section").forEach((button) => {

    button.addEventListener("click", () => {

        const sectionName = button.dataset.target;

        const section = document.querySelector(
            `#${sectionName}`
        );

        if (!section) {
            return;
        }

        const publishedElement =
            section.querySelector(".published-text");

        if (!publishedElement) {
            alert("لا يوجد نص مثبت في هذا القسم.");
            return;
        }

        editElement(publishedElement);

    });

});


// ==========================================
// FIND EDITABLE ELEMENT
// ==========================================

function findEditableElement(section) {

    return section.querySelector(".editable-input");

}


// ==========================================
// PUBLISH ELEMENT
// ==========================================

function publishElement(input) {

    if (!input) {
        return;
    }

    const value = input.value.trim();

    if (!value) {
        alert("اكتب النص أولًا.");
        input.focus();
        return;
    }

    const type = input.dataset.type || "text";

    const publishedElement = createPublishedElement(
        type,
        value
    );

    publishedElement.dataset.section =
        input.dataset.section || "";

    input.replaceWith(publishedElement);

    selectElement(publishedElement);

    updateStatus("تم تثبيت النص بنجاح");

}


// ==========================================
// EDIT ELEMENT
// ==========================================

function editElement(element) {

    if (!element) {
        return;
    }

    const type = element.dataset.type || "text";
    const value = element.textContent;

    const input = createInputElement(
        type,
        value
    );

    input.dataset.section =
        element.dataset.section || "";

    element.replaceWith(input);

    selectElement(input);

    updateStatus("وضع التعديل مفعل");

    input.focus();

    input.setSelectionRange(
        input.value.length,
        input.value.length
    );

}


// ==========================================
// CREATE PUBLISHED ELEMENT
// ==========================================

function createPublishedElement(type, value) {

    let element;


    // TITLE
    if (type === "title") {

        element = document.createElement("h1");

        element.className =
            "published-text mb-6 text-5xl font-bold leading-tight";

    }


    // HEADING
    else if (type === "heading") {

        element = document.createElement("h3");

        element.className =
            "published-text mb-4 text-xl font-bold";

    }


    // DESCRIPTION
    else if (type === "description") {

        element = document.createElement("p");

        element.className =
            "published-text max-w-3xl text-xl leading-9 text-[#8b949e]";

    }


    // EVIDENCE
    else if (type === "evidence") {

        element = document.createElement("blockquote");

        element.className =
            "published-text border-r-2 border-[#238636] pr-5 text-lg leading-10 text-[#f0f6fc]";

    }


    // RULE
    else if (type === "rule") {

        element = document.createElement("p");

        element.className =
            "published-text text-xl font-bold leading-10 text-[#f0f6fc]";

    }


    // SUMMARY
    else if (type === "summary") {

        element = document.createElement("p");

        element.className =
            "published-text leading-9 text-[#8b949e]";

    }


    // NORMAL TEXT
    else {

        element = document.createElement("p");

        element.className =
            "published-text leading-9 text-[#8b949e]";

    }


    element.textContent = value;

    element.dataset.type = type;

    element.classList.add("cursor-pointer");

    return element;

}


// ==========================================
// CREATE INPUT ELEMENT
// ==========================================

function createInputElement(type, value) {

    let input;


    // TITLE / HEADING
    if (
        type === "title" ||
        type === "heading"
    ) {

        input = document.createElement("input");

        input.type = "text";

    }


    // EVERYTHING ELSE
    else {

        input = document.createElement("textarea");

    }


    input.classList.add(
        "editable-input",
        "w-full",
        "rounded-lg",
        "border",
        "border-[#30363d]",
        "bg-[#161b22]",
        "p-4",
        "text-lg",
        "leading-9",
        "text-[#f0f6fc]",
        "outline-none",
        "focus:border-[#238636]"
    );

    input.dataset.type = type;

    input.value = value;


    // TITLE STYLE
    if (type === "title") {

        input.className =
            "editable-input w-full rounded-xl border border-[#30363d] bg-[#161b22] p-5 text-5xl font-bold text-[#f0f6fc] outline-none focus:border-[#238636]";

    }


    // HEADING STYLE
    if (type === "heading") {

        input.className =
            "editable-input w-full rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-xl font-bold text-[#f0f6fc] outline-none focus:border-[#238636]";

    }


    // RULE STYLE
    if (type === "rule") {

        input.className =
            "editable-input w-full resize-none rounded-xl border border-[#30363d] bg-[#161b22] p-6 text-xl font-bold leading-10 text-[#f0f6fc] outline-none focus:border-[#238636]";

    }


    // EVIDENCE STYLE
    if (type === "evidence") {

        input.className =
            "editable-input w-full resize-none rounded-xl border border-[#30363d] bg-[#161b22] p-5 text-lg leading-10 text-[#f0f6fc] outline-none focus:border-[#238636]";

    }


    // FONT
    input.style.fontFamily =
        '"Aref Ruqaa", serif';


    return input;

}


// ==========================================
// GENERAL PUBLISH BUTTON
// ==========================================

publishButton.addEventListener("click", () => {

    if (!selectedElement) {

        alert("حدد النص أو الحقل الذي تريد تثبيته أولًا.");

        return;
    }


    // Already published
    if (
        selectedElement.classList.contains(
            "published-text"
        )
    ) {

        updateStatus("هذا النص مثبت بالفعل.");

        return;

    }


    if (
        selectedElement.classList.contains(
            "editable-input"
        )
    ) {

        publishElement(selectedElement);

    }

});


// ==========================================
// GENERAL EDIT BUTTON
// ==========================================

editButton.addEventListener("click", () => {

    if (!selectedElement) {

        alert("حدد النص الذي تريد تعديله أولًا.");

        return;

    }


    if (
        selectedElement.classList.contains(
            "published-text"
        )
    ) {

        editElement(selectedElement);

        return;

    }


    if (
        selectedElement.classList.contains(
            "editable-input"
        )
    ) {

        updateStatus("هذا الحقل قابل للتعديل بالفعل.");

        selectedElement.focus();

    }

});


// ==========================================
// STATUS
// ==========================================

function updateStatus(message) {

    statusBox.textContent = message;

}