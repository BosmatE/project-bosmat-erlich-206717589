const form = document.getElementById("spellForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const spellType = document.getElementById("spellType").value;
    const knowledgeLevel = parseInt(document.getElementById("knowledgeLevel").value);
    const hasWand = document.getElementById("hasWand").value;
    const previousAttempts = parseInt(document.getElementById("previousAttempts").value);

    const messages = document.getElementById("messages");
    messages.innerHTML = "";

    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!fullName) {
        errors.push("שם מלא הוא שדה חובה");
    }

    if (!email) {
        errors.push("אימייל הוא שדה חובה");
    } else if (!emailRegex.test(email)) {
        errors.push("כתובת אימייל לא תקינה");
    }

    if (!spellType) {
        errors.push("יש לבחור סוג לחש");
    }

    if (knowledgeLevel < 1 || knowledgeLevel > 10) {
        errors.push("רמת ידע חייבת להיות בין 1 ל-10");
    }

    if (errors.length > 0) {
        messages.innerHTML = errors.join("<br>");
        return;
    }

    messages.style.color = "green";
    messages.innerHTML = "הבקשה נשלחה בהצלחה!";
    form.reset();
});
