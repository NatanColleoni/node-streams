import sqlite3 from "sqlite3";
import { faker } from "@faker-js/faker";
import { promisify } from "node:util";

const connection = sqlite3.verbose();
const db = new connection.Database("./data/db");
const serializeAsync = promisify(db.serialize.bind(db));
const runAsync = promisify(db.run.bind(db));

console.time("db-insert");

await serializeAsync;

// await runAsync(
//   "CREATE Table users (id TEXT, name TEXT, age NUMBER, company TEXT)"
// );

function generateUser() {
  const data = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 15, max: 80}),
    company: faker.company.name()
  };
  return [data.id, data.name, data.age, data.company]
}

const promises = []

for(let i = 0; i < 1e5; i++) {
  const user = generateUser()
  promises.push(
    runAsync(
      `INSERT INTO users (id, name, age, company) VALUES(${user.map((_) => "?").join(",")})`
    )
  )
}

await Promise.all(promises)
console.log("terminando de inserir os dados", promises.length, "itens inseridos")

db.all("SELECT COUNT(rowid) as counter from users", (err, row) => {
  if(err) {
    console.error("erro", err)
    return
  }
  
  console.log(row)
  console.timeEnd("db-insert");
})

