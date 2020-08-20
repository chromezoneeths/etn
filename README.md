# etn
Evanston Township Notepad and Planner  
Made by Andrew Denczek [(email)](mailto:asdenczek@eths202.org)
# install
```sh
$ git clone https://github.com/chromezoneeths/etn.git
$ cd etn
$ touch .env
$ nano .env
```
In the `.env`
```env
SESSIONSECRET=whatever secret you want
# optional (hosting on heroku or something)
PORT=80
```
CTRL+X  
Y  
Enter  
```sh
$ npm i
$ node index
```