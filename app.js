const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// вызов нашего модуля
const app = express();
// переменная окружения
const { PORT = 3000 } = process.env;

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// here can be varity of methods: get post delete patch
// (url, callback function)
app.use((req, res, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6279c5b997c9ccf1fad453c5',
    // _id: '6279c29aefb73e4c4303e451',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`server listen port ${PORT}`);
});
