// создаем HTTP-сервер
const server = require('http').createServer()

// подключаем к серверу Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const log = console.log

// Получение обработчиков событий 
const registerMessageHandlers = require('./handlers/messageHandlers')
const registerUserHandlers = require('./handlers/userHandlers')

// Данная функция выполняется при подключении каждого сокета (обычно один клиент = один сокет)
const onConnection = (socket) => {
    log('User connected')
    
    // получаем название комнаты из строки запроса "рукопожатия"
    const { roomId } = socket.handshake.query
    // сохраняем название комнаты в соответствующем свойстве сокета
    socket.roomId = roomId
    
    // присоединяемся к комнате (входим в нее)
    socket.join(roomId)

    // регистрируем обработчики
    registerMessageHandlers(io, socket)
    registerUserHandlers(io, socket)

    // Обрабатываем отключение сокета-пользователя
    socket.on('disconnect', () => {
        // Выводим сообщение
        log('User disconnected')
        // Покидаем комнату
        socket.leave(roomId)
    })
}

// Обрабатываем подключение
io.on('connection', onConnection)

// Запуск сервера
const PORT = process.env.PORT || 5050 
server.listen(PORT, () => {
    console.log(`Server ready. Port: ${PORT}`)
});