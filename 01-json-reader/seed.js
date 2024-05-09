import { createWriteStream } from 'node:fs'
import { faker } from '@faker-js/faker'

const stream = createWriteStream("./data/users.ndjson");

for(let i = 0; i < 1e5; i++) {
    const data = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        jobTitle: faker.person.jobTitle(),
        companyName: faker.company.name(),
    }

    const json = JSON.stringify(data)
    stream.write(json + "\n")
    console.log(data)
}

stream.end();