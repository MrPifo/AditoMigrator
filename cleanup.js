const fs = require('fs');
const path = require('path');

const baseBuildDir = path.join(__dirname, '../AditoMigrator-Build');

console.log('\n🔍 Suche nach dem Build-Ordner...');

// Intelligente Suchfunktion: Sucht den Ordner, in dem "locales" liegt
function findTargetDir(startPath) {
    if (!fs.existsSync(startPath)) return null;
    
    // Prüfen, ob wir im richtigen Ordner sind
    if (fs.existsSync(path.join(startPath, 'locales')) && fs.existsSync(path.join(startPath, 'nw.dll'))) {
        return startPath;
    }
    
    // Ansonsten rekursiv tiefer suchen
    const files = fs.readdirSync(startPath);
    for (const file of files) {
        const fullPath = path.join(startPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const result = findTargetDir(fullPath);
            if (result) return result;
        }
    }
    return null;
}

const buildDir = findTargetDir(baseBuildDir);

if (!buildDir) {
    console.error('❌ Fehler: Konnte den echten Build-Ordner (mit "locales") nicht finden!');
    console.error(`Gesucht wurde in: ${baseBuildDir}`);
    process.exit(1);
}

console.log(`✅ Richtigen Build-Ordner gefunden: ${buildDir}`);

const localesDir = path.join(buildDir, 'locales');
const packageNwDir = path.join(buildDir, 'package.nw');

// Die Pfade zu den Ordnern, die im Build nichts zu suchen haben
const junkFolders = [
    path.join(packageNwDir, 'node_modules'),
    path.join(packageNwDir, '.git'),
	path.join(packageNwDir, 'cache')
];

// 1. Locales (Sprachen) aufräumen
const keepLocales = ['de.pak', 'en-US.pak'];
if (fs.existsSync(localesDir)) {
    const files = fs.readdirSync(localesDir);
    let deletedCount = 0;
    files.forEach(file => {
        if (!keepLocales.includes(file)) {
            fs.unlinkSync(path.join(localesDir, file));
            deletedCount++;
        }
    });
    console.log(`🗑️  ${deletedCount} unnötige Sprachdateien gelöscht.`);
}

// 2. Gigantische Junk-Ordner (wie node_modules) löschen
junkFolders.forEach(folder => {
    if (fs.existsSync(folder)) {
        console.log(`🗑️  Lösche unnötigen Ballast: ${path.basename(folder)}...`);
        fs.rmSync(folder, { recursive: true, force: true });
        console.log(`✅ ${path.basename(folder)} erfolgreich entfernt!`);
    }
});

console.log('\n✨ Build ist jetzt maximal entschlackt und bereit für Enigma!\n');