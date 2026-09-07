async function loadHTML(selector, file) {
    const element = document.querySelector(selector);

    if (!element) return;

    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
    }

    element.innerHTML = await response.text();
}

loadHTML("#header", "/src/templates/header.html").catch(console.error),
loadHTML("#footer", "/src/templates/footer.html").catch(console.error)
