const https = require('http');
const io = require('socket.io-client');

async function testComplet() {
    try {
        // 1. Se connecter et obtenir un token
        console.log('🔐 1. Connexion...');
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username: 'testuser', password: 'password123' });
        
        const token = loginResponse.data.data.accessToken;
        console.log('✅ Token obtenu');
        
        // 2. Connecter le client WebSocket
        console.log('🔌 2. Connexion WebSocket...');
        const socket = io('http://localhost:3000', {
            auth: { token: token }
        });
        
        socket.on('connect', () => {
            console.log('✅ WebSocket connecté');
        });
        
        socket.on('newMonument', (data) => {
            console.log('\n🔔 NOTIFICATION REÇUE !');
            console.log('📋 Monument:', data.data.title);
            console.log('🆔 ID:', data.data.id);
            console.log('📝 Description:', data.data.description);
            console.log('⏰ Créé le:', data.data.createdAt);
            console.log('----------------------------------------\n');
        });
        
        // Attendre que le WebSocket soit connecté
        await new Promise(resolve => {
            socket.on('connect', resolve);
        });
        
        // 3. Créer un monument
        console.log('🏛️ 3. Création d\'un monument...');
        const monumentResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/monuments',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, { monument: { title: 'Basilique du Sacré-Cœur', country: 'France', city: 'Paris', description: 'Basilique située sur la butte Montmartre' } });
        
        console.log('✅ Monument créé:', monumentResponse.data.data.title);
        console.log('🔔 La notification devrait apparaître ci-dessus !');
        
        // Attendre un peu pour voir la notification
        setTimeout(() => {
            socket.disconnect();
            process.exit(0);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

testComplet();
