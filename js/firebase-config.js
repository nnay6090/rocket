/**
 * Configuração do Firebase
 * IMPORTANTE: Substitua os valores abaixo pelos fornecidos no console do Firebase
 */
const firebaseConfig = {
  apiKey: "AIzaSyBPWvu0W9MrBWRUaJmeAYVU6Y8HlIu4Low",
  authDomain: "rocket-d4dd6.firebaseapp.com",
  projectId: "rocket-d4dd6",
  storageBucket: "rocket-d4dd6.firebasestorage.app",
  messagingSenderId: "252402164659",
  appId: "1:252402164659:web:a2b7eb5d7ff7b07938a1c6",
  measurementId: "G-T0H660QSYT"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao Firestore
const db = firebase.firestore();

// Coleção de jogadores
const playersCollection = db.collection('players');

// Função para obter o leaderboard
async function getOnlineLeaderboard() {
    try {
        const snapshot = await playersCollection.orderBy('score', 'desc').limit(20).get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao obter leaderboard online:', error);
        return [];
    }
}

// Função para atualizar ou adicionar um jogador
async function updatePlayerOnline(player) {
    try {
        // Verifica se o jogador já existe
        const playerQuery = await playersCollection.where('name', '==', player.name).get();
        
        if (playerQuery.empty) {
            // Adiciona novo jogador
            await playersCollection.add({
                name: player.name,
                score: player.score,
                landingCount: player.landingCount,
                lastPlayed: new Date().toISOString()
            });
        } else {
            // Atualiza jogador existente
            const playerDoc = playerQuery.docs[0];
            const currentData = playerDoc.data();
            
            // Só atualiza se a pontuação for maior ou se houver novos pousos
            if (player.score > currentData.score || player.landingCount > currentData.landingCount) {
                await playerDoc.ref.update({
                    score: Math.max(player.score, currentData.score),
                    landingCount: Math.max(player.landingCount, currentData.landingCount),
                    lastPlayed: new Date().toISOString()
                });
            }
        }
        return true;
    } catch (error) {
        console.error('Erro ao atualizar jogador online:', error);
        return false;
    }
} 