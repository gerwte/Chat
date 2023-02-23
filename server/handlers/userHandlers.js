// нормализованная структура 
// имитация БД
const users = {
    1: {userName: 'Alice', online: false},
    2: {userName: 'Bob', online: false}
}

module.exports = (io, socket) => {
    // обрабатываем запрос на получение пользователей
    // свойство "roomId" является распределенным
    // поскольку используется как для работы с пользователями
    // так и для работы с сообщениями
    const getUsers = () => {
        io.in(socket.roomId).emit('users', users)
    }

    // Обрабатываем добавление пользователя
    // функция принимает объект с именем пользователя и его id
    const addUser = ({ username, userId }) => {
        // проверяем, имеется ли пользователь в БД
        if(!users[userId]) {
            // Если не имеется, добавляем его в БД
            users[userId] = { username, online: true }
        } else {
            // если имеется, меняем его статус на online
            users[userId].online = true
        }
        // Выполняем запрос на получение пользователей
        getUsers()
    }

    // Обрабатываем удаление пользователя 
    const removeUser = (userId) => {
        // одно из преимуществ нормализованных структур состоит в том,
        // что мы можем моментально (0(1)) получать данные по ключу
        // это актуально только без изменяемыхъ (мутабельных) данных
        // в redux, например, без immer, нормализованные структуры привносят дополнительную сложность
        users[userId].online = false
        getUsers()
    }

    // регистрируем обработчики 
    socket.on('user:get', getUsers)
    socket.on('user:add', addUser)
    socket.on('user:leave', removeUser)
}