@ECHO OFF
start cmd /k "ngrok http --url=engaged-typically-weasel.ngrok-free.app 80"
start cmd /k "cd .. & cd discord-example-app & SET PORT=80 & npm run start"