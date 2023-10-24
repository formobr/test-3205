import express from "express";
const app = express();
const port = 3000;

import bodyParser from "body-parser";
app.use(bodyParser.json());

import { Request, Response } from "express";
import { User } from './types';

// Worker для прерывания предыдущей операции поиска, если пользователь начал новый поиск
import { Worker } from "worker_threads";
let worker: Worker | null = null;

const searchUser = (req: Request, res: Response) => {
  // Если worker уже выполняется, остановить его
  const { email, number } = req.body;
  if (worker) {
    worker.terminate();
    console.log(`Выполнение предыдущего запроса остановлено. Выполняю новый запрос ${email} ${number}`);
  }
  //Запускаем worker
  worker = new Worker("./dist/worker.js", { workerData: { email, number } });

  // При получении сообщения от worker, отправляем результат клиенту и останавливаем worker
  worker.on("message", (results: User[]) => {
    res.send(results);
    worker?.terminate();
  });

};

app.post("/search", searchUser);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
