const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const Koa = require('koa');
const app = new Koa();


const projectRoot = '/tmp/data/'
const gitUrl = 'https://github.com/ctq123/vue-admin-template.git'
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

const downloadRepo = (gitUrl, projectRoot) => {
  try {
    const gitStrs = gitUrl.split('.git')[0]
    const names = gitStrs.split('/')
    const projectName = names[names.length - 1]
    const target = path.join(projectRoot, projectName)
    if (fs.existsSync(target)) {
      shell.cd(target)
      shell.exec(`git pull origin master`)
      console.log("git pull origin master")
    } else {
      shell.cd(projectRoot)
      shell.exec(`git clone ${gitUrl}`)
      console.log("git clone")
    }
    return target
  } catch(e) {}
  return null
}

const execPush = () => {
  shell.exec(`git add .`)
  console.log(`git add 成功！`)
  shell.exec(`git commit -m feat:robot-添加新文件`)
  console.log(`git commit 成功！`)
  shell.exec(`git push origin master`)
  console.log(`执行结束-成功！`)
  shell.exit(0)
}

const writeFile = (list=[], projectPath) => {
  return new Promise((resolve, reject) => {
    list.forEach((item, i) => {
      if (!item.filePath || !item.fileName) return
      const dirPath = path.join(projectPath, item.filePath)
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
          reject(err)
        };
        const filePath = path.join(dirPath, item.fileName);
        fs.writeFile(filePath, item.fileBody, function (err) {
          if (err) {
            console.log(err);
            reject(err)
          } else {
            console.log(filePath)
            if (i === list.length - 1) {
              resolve(true)
            }
          }
        });
      })
    })
  })
}

const main = async function (ctx) {
  const projectPath = downloadRepo(gitUrl, projectRoot)
  console.log("projectPath", projectPath)
  if (projectPath) {
    writeFile(list, projectPath).then(res => {
      execPush();
    })
  }
};

app.use(main);

app.listen(3000);

