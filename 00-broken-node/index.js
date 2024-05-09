import { promises } from 'node:fs'

const filename = "big-file.txt"

try {
    const file = await promises.readFile(filename);

    console.log("file size", file.byteLength / 1e9, "GB", "\n");
    console.log("fileBuffer", file)
} catch(error) {
    console.error("error: max 2GB reached...", error.message)
}