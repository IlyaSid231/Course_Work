const accessibilitySettings = {
    mode: localStorage.getItem("accessibilityMode") || "off",
    fontSize: localStorage.getItem("fontSize") || "medium",
    colorScheme: localStorage.getItem("colorScheme") || "white-black",
    images: localStorage.getItem("images") || "on"
};

function applyAccessibilitySettings() {
    document.body.classList.remove("accessibility-mode", "font-small", "font-medium", "font-large", "black-white", "black-green", "white-black", "images-on", "images-off");

    if (accessibilitySettings.mode === "on") {
        document.body.classList.add("accessibility-mode");
        document.body.classList.add(`font-${accessibilitySettings.fontSize}`);
        document.body.classList.add(accessibilitySettings.colorScheme);
        document.body.classList.add(`images-${accessibilitySettings.images}`);
    }

    // Обновление активных кнопок
    document.querySelectorAll(".accessibility-btn[data-accessibility]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.accessibility === accessibilitySettings.mode);
    });
    document.querySelectorAll(".accessibility-btn[data-font]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.font === accessibilitySettings.fontSize);
    });
    document.querySelectorAll(".accessibility-btn[data-theme]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === accessibilitySettings.colorScheme);
    });
    document.querySelectorAll(".accessibility-btn[data-images]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.images === accessibilitySettings.images);
    });
}

function initAccessibilityPanel() {
    const blindBtn = document.getElementById("blind_version_btn");
    const panel = document.getElementById("accessibility-panel");

    if (blindBtn && panel) {
        blindBtn.addEventListener("click", () => {
            panel.classList.toggle("active");
        });

        // Обработчик переключателя версии для слабовидящих
        document.querySelectorAll(".accessibility-btn[data-accessibility]").forEach(btn => {
            btn.addEventListener("click", () => {
                accessibilitySettings.mode = btn.dataset.accessibility;
                localStorage.setItem("accessibilityMode", accessibilitySettings.mode);
                applyAccessibilitySettings();
            });
        });

        // Обработчики кнопок шрифта
        document.querySelectorAll(".accessibility-btn[data-font]").forEach(btn => {
            btn.addEventListener("click", () => {
                accessibilitySettings.fontSize = btn.dataset.font;
                localStorage.setItem("fontSize", accessibilitySettings.fontSize);
                applyAccessibilitySettings();
            });
        });

        // Обработчики кнопок цветовой схемы
        document.querySelectorAll(".accessibility-btn[data-theme]").forEach(btn => {
            btn.addEventListener("click", () => {
                accessibilitySettings.colorScheme = btn.dataset.theme;
                localStorage.setItem("colorScheme", accessibilitySettings.colorScheme);
                applyAccessibilitySettings();
            });
        });

        // Обработчики кнопок изображений
        document.querySelectorAll(".accessibility-btn[data-images]").forEach(btn => {
            btn.addEventListener("click", () => {
                accessibilitySettings.images = btn.dataset.images;
                localStorage.setItem("images", accessibilitySettings.images);
                applyAccessibilitySettings();
            });
        });

        // Закрытие панели
        document.querySelector(".close-panel").addEventListener("click", () => {
            panel.classList.remove("active");
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    applyAccessibilitySettings();
    initAccessibilityPanel();
});