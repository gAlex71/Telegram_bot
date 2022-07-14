const TelegramApi = require('node-telegram-bot-api')
const token = ''
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, againOptions} = require('./options')
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю тебе число от 0 до 9, и ты должен его угадать!)')
    const randomNum = Math.floor(Math.random()*10)
    chats[chatId] = randomNum
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    //Вывод всех команд
    bot.setMyCommands([
        {command: '/start', description: 'Приветсвие пользователя'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Давай поиграем!'}
    ])

    //Создаем слушатель событий, при получении сообщения ботом
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b28/1ed/b281ed45-e1f7-43c0-9a90-2aa9db63c8d1/12.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в мой Telegram-bot, меня зовут Александр`)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    //Слушатель нажатой кнопки во время игры
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        //Играть заново
        if(data === '/again'){
            return startGame(chatId)
        }
        //Нам необходимо сравнить нажатое число, с числом, лежащем в id чата
        if(data === chats[chatId]){
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал число ${chats[chatId]}!!!`, againOptions)
        }else{
            await bot.sendMessage(chatId, `К сожалению ты не угадал число ${chats[chatId]} (`, againOptions)
        }
    })
}

start()