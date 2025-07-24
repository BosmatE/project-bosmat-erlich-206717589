const isFormPage = document.getElementById("spellForm") !== null;
const isViewPage = document.getElementById("requestsContainer") !== null;

if (isFormPage) {
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

        if (!fullName) errors.push("שם מלא הוא שדה חובה");
        if (!email) errors.push("אימייל הוא שדה חובה");
        else if (!emailRegex.test(email)) errors.push("כתובת אימייל לא תקינה");
        if (!spellType) errors.push("יש לבחור סוג לחש");
        if (knowledgeLevel < 1 || knowledgeLevel > 10 || isNaN(knowledgeLevel)) errors.push("רמת ידע חייבת להיות בין 1 ל-10");

        if (isNaN(previousAttempts) || previousAttempts < 0) { 
            errors.push("מספר ניסיונות קודמים חייב להיות מספר שלם וחיובי (או 0).");
        }

        if (errors.length > 0) {
            messages.innerHTML = errors.join("<br>");
            messages.style.color = "red";
            return;
        }

        const request = {
            id: Date.now(),
            fullName,
            email,
            spellType,
            knowledgeLevel,
            hasWand,
            previousAttempts,
            status: "ממתינה"
        };

        saveItem(request);

        messages.innerHTML = "הבקשה נשלחה בהצלחה!";
        messages.style.color = "green";
        form.reset();

        setTimeout(() => {
            window.location.href = "view.html";
        }, 1500);
    });
}

function saveItem(request) {
    const existing = JSON.parse(localStorage.getItem("spellRequests") || "[]");
    existing.push(request);
    localStorage.setItem("spellRequests", JSON.stringify(existing));
}

function loadItems() {
    return JSON.parse(localStorage.getItem("spellRequests") || "[]");
}

function renderItems(items) {
    const container = document.getElementById("requestsContainer");
    container.innerHTML = "";
    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "request-card";
        div.innerHTML = `
            <p><strong>שם:</strong> ${item.fullName}</p>
            <p><strong>אימייל:</strong> ${item.email}</p>
            <p><strong>סוג לחש:</strong> ${item.spellType}</p>
            <p><strong>רמת ידע:</strong> ${item.knowledgeLevel}</p>
            <p><strong>שרביט:</strong> ${item.hasWand}</p>
            <p><strong>ניסיונות קודמים:</strong> ${item.previousAttempts}</p>
            <p class="status"><strong>סטטוס:</strong> ${item.status}</p>
            <select class="status-update">
                <option value="ממתינה" ${item.status === "ממתינה" ? "selected" : ""}>ממתינה</option>
                <option value="מאושרת" ${item.status === "מאושרת" ? "selected" : ""}>מאושרת</option>
                <option value="נדחתה" ${item.status === "נדחתה" ? "selected" : ""}>נדחתה</option>
            </select>
            <button class="delete">מחק</button>
        `;

        div.querySelector(".delete").onclick = () => deleteItem(item.id);
        div.querySelector(".status-update").onchange = (e) => updateItem(item.id, { status: e.target.value });

        container.appendChild(div);
    });
}

function deleteItem(id) {
    let items = loadItems();
    items = items.filter(i => i.id !== id);
    localStorage.setItem("spellRequests", JSON.stringify(items));
    renderItems(items);
    renderStats(items);
}

function updateItem(id, changes) {
    const items = loadItems().map(i => i.id === id ? { ...i, ...changes } : i);
    localStorage.setItem("spellRequests", JSON.stringify(items));
    renderItems(items);
    renderStats(items);
}

function renderStats(items) {
    const stats = document.getElementById("stats");
    const total = items.length;
    const approved = items.filter(i => i.status === "מאושרת").length;
    const percent = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    stats.innerText = `סה"כ בקשות: ${total}, מאושרות: ${approved} (${percent}%)`;
}

if (isViewPage) {
    const filter = document.getElementById("filterSpellType");
    filter.onchange = () => {
        const items = loadItems();
        const filtered = filter.value ? items.filter(i => i.spellType === filter.value) : items;
        renderItems(filtered);
        renderStats(filtered);
    };
    const initialItems = loadItems();
    renderItems(initialItems);
    renderStats(initialItems);
}