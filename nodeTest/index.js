import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
const Redis = require('redis');

const redisClient = Redis.createClient()

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    console.log('[TEST34]');

    res.send('HELLOOOO');
});

app.listen(PORT, () => console.log(`assss${PORT}`));

/*
Express를 사용하여 요청에 대한 응답을 처리할 때
위 console.log(post) 부분에서 undefined를 볼 수 있습니다.
즉, req.body 부분을 undefined로 처리하고 있습니다.

여기서 body-parser를 이용하면 req.body 데이터를 내가 원하는 형태로 데이터를 parsing 해줘
문제를 해결할 수 있습니다.
*/

//서버 코드를 변경 할 때마다, 서버를 재시작하는게 꽤 귀찮지요? nodemon 이라는 도구를 사용하면 이를 자동으로 해줍니다.