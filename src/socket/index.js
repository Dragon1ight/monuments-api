const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key.pub');
const { Server } = require('socket.io');

let messages = {};

function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Token manquant"));
        }

        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                return next(new Error("Token invalide"));
            }
            socket.user = decoded;
            next();
        }); 
    });

    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté');
    
        socket.on("joinMonument", ({monumentId, role}) => {
            socket.join(`monument_${monumentId}`);
            console.log(`${socket.user.userName} a rejoint la salle monument_${monumentId} en tant que ${role}`);
    
            if(!messages[monumentId]) 
                messages[monumentId] = [];
    
            socket.emit("chatHistory", messages[monumentId]);
        });
    
        socket.on("sendMessage", ({monumentId, role, message}) => {
            const msg = {
                user: socket.user.userName,
                role,
                message,
                date: new Date()
            };
    
            messages[monumentId].push(msg);
            io.to(`monument_${monumentId}`).emit("newMessage", msg);
        });
        
        socket.on('disconnect', () => {
            console.log('Un utilisateur est déconnecté');
        });
    });

    return io;
}

module.exports = setupSocketServer;