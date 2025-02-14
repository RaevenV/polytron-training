# NodeJS Project Template

Template for starting new NodeJs Project.

![](https://img.shields.io/badge/docker-blue)

## Installation

1. Clone project with SSH or HTTPS
```bash
  ssh://git@repo.polytron.co.id:1234/ADA/material/node_template.git
```
   or
```bash
  https://repo.polytron.co.id/ADA/material/node_template.git
```

2. Open Project with your IDE (Usually VS Code)
3. Install listed node modules in project
```bash
  npm install
```
4. Start the project!
```bash
  npm start
```


## Storing Credentials & Keys
1. We will store said keys and creds in ENV File.
2. Store it according to used environment.
3. Project will have a folder with 3 ENV (dev,stag,prod) with different environment settings

      <img src='https://i.imgur.com/TBDhDNa.png'></img>

4. You can make your own ENV if needed.


ENV File Example:
```env
#ENV - Environment Variables Development Example
#Store in ENV (api key,PORT,ETC)


#APP PORT
APP_PORT = "3001"

#NODE_ENV
NODE_ENV = "dev"

#Database Config
DB_HOST= "[DB_HOST]" # 172.17.0.1
DB_PORT= "[DB_PORT]" # 1047
DB_USER= "[DB_USER]" # fira
DB_PASS= "[DB_PASS]" # Fira132
DATABASE= "[DATABASE]" # cb_res_panel

#Redis Config
REDIS_HOST="[REDIS_HOST]" # 172.17.0.1
REDIS_PORT="[REDIS_PORT]" # 6379
REDIS_PASS="[REDIS_PASS]"
```

## Normal & Multi Environment Deployment
You can deploy nodejs project in 2 ways: 
1. Run Script from package.json
```javascript
 "scripts": {
    "start": "nodemon index.js",
    "dev": "NODE_ENV='dev' nodemon index.js",
    "stag": "NODE_ENV='stag' nodemon index.js",
    "prod": "NODE_ENV='prod' nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
 - Use one of the script to run the application according to wanted environment
```bash
   #Run the app in dev environment
   npm run dev
   
   #Run the app in stag environment
   npm run stag
   
   #Run the app in prod environment
   npm run prod
```

2. Using Docker command
- You need to install docker first to use this way of deployment.
- You can install it from here
 [Docker Linux](https://docs.docker.com/desktop/install/linux-install/)
| [Docker Windows](https://docs.docker.com/desktop/install/windows-install/)
- After installing docker you can use below command to create an docker image from the yaml file and start up a docker container containing the application.

```bash
   #Base Syntax
   docker compose -f [yamlfile] up --force-recreate -d --build
   
   #Usage Example
   docker compose -f docker.dev.yaml up --force-recreate -d --build
```
- We will differentiate environment according to yaml file.

<img style='background-color:white; justify-self:center' src='https://mermaid.ink/img/pako:eNp1kkGP0zAQhf_KyKjKpZFKJWDJAbRJt8sFgdQVB5I9eOPJ1tT2RM6EErX97-vEQFshckgm733PGo3nIGpSKDKRpmnlWLPBDFbYGhosOoa1oX3lJnM2O1QOQDvNGUwlQMJbtJhkkDzJDpP5pfpNei2fDHbJXzxYrddW-qEgQ37Mvcrz5ZvlzZ_omXjAX3ymmqb5F8nJK_Rn6F2xCM8FZ7TDs72-yZfL9xd2hzU5ddXNYvH29dURjJ71FTK2Eu3T-Amv02xWuco1YVb1VnqGh1UEvpcbDv-PkKYfbqN0WxaGHMJXTz-wjlZ08vJLi-7KgOLwifYQfSZQ08V8PEWhGJGjI2-lOcKqdK0Nt9OxNCam15PkewcJup_JJN5fZhXVO_RHuCtjBTXZljqEZJDWrLXBGIL78s6pxxgNQ91teDAY2mlkbxg69rQLe7Pfasb_QdJ72v9mRkLMhcXQulZh-6b9qMS0N5XIQmn085YrEYYbQNkzbQZXi4x9j3PRt0oyrrR89tKKrJGmCyoqzeQ_x32e1vr0Arh35KI?type=png'></img>


## Included modules
1. MySQL Connector 
   - Used for initiate config & connecting to mysql database.
2. Redis Connector
   - Used for initiate redis config.
3. Poly Logger
   - Used for logging access,api,error to txt file.
4. Configuration
   - Used for getting all process.env to easy to use variable in js.
5. SSE
   - Used for creating SSE(Server Sent Events) Object. 

## License

[Polytron](https://choosealicense.com/licenses/mit/)
