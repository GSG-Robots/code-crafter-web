function renderTutorial(id) {
    const tutorialDisplay = document.querySelector("markdown-display");
    tutorialDisplay.innerHTML = "# CodeCrafter\nWir laden die Metadaten. Gedulde dich noch einen Moment...\n> [!TIP]\n> Wenn du diesen Text längere Zeit siehst, lade die Seite neu, um es erneut zu versuchen.\n\n> [!TIP]\n> Sollte das Problem weiterhin bestehen, [kontaktiere uns](https://gsgrobots.wixsite.com/gsg-robots/kontakt).";
    tutorialDisplay.redraw();
    fetch(`https://codecrafter-tutorials.pages.dev/${id}/meta.json`, { headers: { "Access-Control-Allow-Origin": "*" } }).then((response) => response.json()).then((data) => {
        if (data.display) {
            switch (data.display.type) {
                case "markdown":
                    tutorialDisplay.innerHTML = "# CodeCrafter\nWir laden den Inhalt. Gedulde dich noch einen Moment...\n> [!TIP]\n> Wenn du diesen Text längere Zeit siehst, lade die Seite neu, um es erneut zu versuchen.\n\n> [!TIP]\n> Sollte das Problem weiterhin bestehen, [kontaktiere uns](https://gsgrobots.wixsite.com/gsg-robots/kontakt).";
                    tutorialDisplay.redraw();
                    fetch(`https://codecrafter-tutorials.pages.dev/${id}/${data.display.file}`, { headers: { "Access-Control-Allow-Origin": "*" } }).then((response) => response.text()).then((text) => {
                        tutorialDisplay.innerHTML = text;
                        tutorialDisplay.redraw();
                    }).catch((error) => {
                        console.error(error);
                        tutorialDisplay.innerHTML = `# CodeCrafter\nFehler beim Laden der Anzeigeinhalte: \`${error}\`\n\n> [!TIP]\n> Lade die Seite neu, um es erneut zu versuchen.\n\n> [!TIP]\n> Sollte das Problem weiterhin bestehen, [kontaktiere uns](https://gsgrobots.wixsite.com/gsg-robots/kontakt).`;
                        tutorialDisplay.redraw();
                    });
                    break;
                default:
                    tutorialDisplay.innerHTML = "# CodeCrafter\nFehler beim Laden der Anzeigeinhalte: `Unbekannter Anzeigetyp`\n\n> [!TIP]\n> Lade die Seite neu, um es erneut zu versuchen.\n\n> [!TIP]\n> Sollte das Problem weiterhin bestehen, [kontaktiere uns](https://gsgrobots.wixsite.com/gsg-robots/kontakt).";
                    tutorialDisplay.redraw();
                    break;
            }
        }
    }).catch((error) => {
        console.error(error);
        tutorialDisplay.innerHTML = `# CodeCrafter\nFehler beim Laden der Metadaten: \`${error}\`\n\n> [!TIP]\n> Lade die Seite neu, um es erneut zu versuchen.\n\n> [!TIP]\n> Sollte das Problem weiterhin bestehen, [kontaktiere uns](https://gsgrobots.wixsite.com/gsg-robots/kontakt).`;
        tutorialDisplay.redraw();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const query = new URLSearchParams(window.location.search);
    const tutorial = query.get("tutorial");
    if (tutorial) {
        renderTutorial(tutorial);
    }
    else {
        const tutorialDisplay = document.querySelector("markdown-display");
        tutorialDisplay.innerHTML = "# CodeCrafter\nHier wird nichts angezeigt, weil kein Tutorial gewählt wurde.";
        tutorialDisplay.redraw();
    }
});