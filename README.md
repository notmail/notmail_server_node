notMAIL server node
======================

## Developing and Running Instructions (DOCKER)
```
git clone https://github.com/notmail/notmail_server_node && cd notmail_server_node
docker-compose build
docker-compose up
``` 

## Developing and Running Instructions (DOCKER-LESS)
1. git clone https://github.com/notmail/notmail_server_node && cd notmail_server_node
1. replace mongo by localhost for docker-less setup in config.json
1. npm install
1. Start mongo database (mongod &, systemctl service start mongod, ... ...)
1. npm start

## config.json defaults
```json
{
    "port":          6060,
    "endpoint":      "/notmail_api",
    "dev":           true,
    "json_prettify": true,
    "db_url":        "mongodb://mongo/notmail"
}
```
