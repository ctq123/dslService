const Koa = require('koa');
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = new Koa();

const main = async function (ctx) {
  // const files = ctx.request.body.files || {};

  // const data= 'Hello, Node.js';
  // const tmpdir = os.tmpdir();
  // const filePath = path.join(tmpdir, 'index.vue')
  const list = [
    {
      fileBody: `
      <template>
        <div class="alert">
          hello
        </div>
      </template>
      
      <script>
        import * as API from './api';
        export default {
          data() {
            return {}
          },
          methods: {

          }
         }
      </script>
      <style scoped lang="scss">
        .alert {
          color: red;
        }
      </style>
      `,
      fileName: 'index.vue',
      filePath: '/user'
    },
    {
      fileBody: `
      export const getList = (params) => UmiRequest.request({
        url: '/api/h5/user/list',
        params: params
      })
      `,
      fileName: 'api.js',
      filePath: '/user'
    },
  ]
  list.forEach((item) => {
    if (!item.filePath || !item.fileName) return
    const dirPath = '/tmp/data/crm/' + item.filePath
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) throw err;
      const filePath = path.join(dirPath, item.fileName);
      fs.writeFile(filePath, item.fileBody, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('ok.');
          console.log(filePath)
        }
      });
    })
  })
  
};

app.use(main);

app.listen(3000);
