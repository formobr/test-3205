import { parentPort, workerData } from 'worker_threads';
import db from './users.json';
import { User } from './types';

const users: User[] = db as User[];

const { email, number } = workerData as User

setTimeout(() => {
    let results = users.filter((user) => user.email === email);

    if (number) {
        results = results.filter((user) => user.number === number);
    }

    if (parentPort) {
        parentPort.postMessage(results);
    }
}, 5000);