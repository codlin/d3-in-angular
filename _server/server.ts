import { bodyParser, create, defaults } from 'json-server';

const server = create();
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

// let jsonFile = './bar-char.json';
let jsonFile = './mock_data.json';

const data = require(jsonFile);
server.get('/api/bar-chart', (req: any, res: any) => {
  console.log('got request', req);

  res.send({
    code: 0,
    msg: 'success',
    data,
  });
});

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
