import { createReadStream, createWriteStream} from 'node:fs'
import { createInterface } from 'node:readline'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

console.time("json-reader")

const filePath = "./data/users.ndjson";

const stream = createReadStream(filePath, { encoding: "utf-8" });
const readLine = createInterface({ input: stream }); // ler linha por linha da stream

// chunk sao pequenas partes dos dados da stream
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const data = JSON.parse(chunk)
        data.name = data.name.toUpperCase()
        const json = JSON.stringify(data)
        console.log(json)

        callback(null, json + "\n");
    }
})

// ler o resultado final da streams
const outputStream = createWriteStream("./data/output.ndjson")

//sequencia de ações
pipeline(
    readLine, // 1o - leitura do arquivo
    transformStream, // 2o - manipulação do arquivo
    outputStream  // 3o - escrita da manipulação em um novo arquivo
).then(() => {
    console.log("End of file")
}).catch((err) => {
    console.error(err)
})

console.timeEnd("json-reader")