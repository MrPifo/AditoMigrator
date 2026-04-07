const rcedit = require('rcedit');
const path = require('path');

async function run() {
    // Die Pfade zu deinen Dateien
    const exePath = "C:\\Users\\Lion\\Desktop\\Adito Migrator v.1.0_original.exe";
    const icoPath = "C:\\Users\\Lion\\Desktop\\AditoMigrator\\icon.ico";

    console.log("⏳ Tausche Icon und Metadaten sicher aus...");

    try {
        // Sicherstellen, dass wir die Funktion erwischen (Node.js v24 Fix)
        const editFunc = (typeof rcedit === 'function') ? rcedit : rcedit.default;

        if (typeof editFunc !== 'function') {
            throw new Error("Konnte die rcedit-Funktion nicht im Modul finden.");
        }

        await editFunc(exePath, {
            'icon': icoPath,
            'product-version': '1.0.0',
            'file-version': '1.0.0',
            'version-string': {
                'FileDescription': 'ADITO Migrator Tool',
                'ProductName': 'ADITO Migrator',
                'LegalCopyright': `© ${new Date().getFullYear()} ADITO Projekt`,
                'OriginalFilename': 'adito-migrator.exe'
            }
        });

        console.log("✅ Fertig! Das Icon wurde erfolgreich in die EXE injiziert.");
        console.log("👉 Du kannst die EXE jetzt mit Enigma Virtual Box verpacken.");

    } catch (err) {
        console.error("❌ Fehler beim Bearbeiten der EXE:");
        console.error(err.message);
    }
}

run();