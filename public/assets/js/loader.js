// Fichier JavaScript pour le chargement des templates

async function loadHTML(selector, file) {
    // Rôle: Charger un template HTML
    //
    // Paramètres:
    //  selector - Le selector de l'element ou on chargera le template
    //  file - Le fichier template a charger

    const element = document.querySelector(selector);

    if (!element) return;

    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
    }

    element.innerHTML = await response.text();
    element.dispatchEvent(new CustomEvent('partial:loaded', { bubbles: true, detail: { file } }));
}

loadHTML('#header', '/src/templates/header.html').catch(console.error),
loadHTML('#footer', '/src/templates/footer.html').catch(console.error)
