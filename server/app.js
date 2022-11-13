import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile  } from 'lowdb/node'
import bodyParser from 'body-parser'
import { nanoid } from 'nanoid'


dotenv.config()
const adapter = new JSONFile('db.json')
const db = new Low(adapter)

await db.read()
db.data = db.data || {
    students: [],
    classes: [],
    vehicles: []
}

const { students, classes, vehicles } = db.data

console.log(students)

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [process.env.ORIGIN],
  }))
app.use(bodyParser.json())

app.get('/students', (req, res) => {
  const data = students
  return res.status(200).json(data);
})

app.get('/students/:id', async (req, res) => {
    const data = students.find((p) => p.id === req.params.id)
    res.status(200).json(data);
})

app.post('/students', async (req, res, next) => {
    const data = students.push({
        ...req.body,
        id: nanoid()
    })
    await db.write()
    res.status(200).json(req.body);
})

app.listen(PORT, ()=> {
  console.log(`Backend is running on http://localhost:${PORT}`)
})