const io = require('socket.io-client');

// Token JWT - vous devez d'abord vous connecter pour l'obtenir
const token = 'VOTRE_TOKEN_ICI'; // Remplacez par votre token

const socket = io('http://localhost:3000', {
  auth: {
    token: token
  }
});

socket.on('connect', () => {
  console.log('✅ Connecté au WebSocket');
  console.log('🔔 En attente des notifications...');
});

socket.on('newMonument', (data) => {
  console.log('\n🔔 NOUVELLE NOTIFICATION REÇUE !');
  console.log('📋 Détails du monument:');
  console.log('   - ID:', data.data.id);
  console.log('   - Titre:', data.data.title);
  console.log('   - Description:', data.data.description);
  console.log('   - Date de création:', data.data.createdAt);
  console.log('----------------------------------------\n');
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
  console.log('💡 Vérifiez que:');
  console.log('   1. Le serveur est démarré (npm run dev)');
  console.log('   2. Vous avez un token JWT valide');
  console.log('   3. Vous êtes connecté avec un utilisateur existant');
});

socket.on('disconnect', () => {
  console.log('🔌 Déconnecté du WebSocket');
});

console.log('🚀 Démarrage du client WebSocket...');
console.log('💡 Pour obtenir un token, connectez-vous d\'abord avec:');
console.log('   POST http://localhost:3000/api/login');
console.log('   Body: {"username": "testuser", "password": "password123"}');
