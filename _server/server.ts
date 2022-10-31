import { bodyParser, create, defaults } from 'json-server';

const barChart = require('./bar-char.json');

const server = create();
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

server.get('/api/bar-chart', (req: any, res: any) => {
  console.log('got request', req);

  res.send({
    code: 0,
    msg: 'success',
    data: barChart,
  });
});

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
