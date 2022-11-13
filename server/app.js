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

if(Object.keys(db.data).length === 0) {
    db.data = {
        studentdb: [],
        vehicledb: [],
        classdb: [
            {
                id: nanoid(),
                classId: 'classA',
                students: []
            },
            {
                id: nanoid(),
                classId: 'classB',
                students: []
            }
        ]
    }
    db.write()
}

const { studentdb, classdb, vehicledb } = db.data

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(bodyParser.json())

// Student services

//get all students
app.get('/students', (req, res) => {
    const students = studentdb
    return res.status(200).json(students);
})

//get a student by id
app.get('/students/:id', async (req, res) => {
    const student = studentdb.find((p) => p.id === req.params.id)
    res.status(200).json(student);
})

//create a student
app.post('/students', async (req, res, next) => {
    try {
        const {studentNumber, name, registration, classId} = req.body
        //vechile is 1..1 with student
        const currentVehicle = vehicledb.find((item) => item.registration === registration)

        if(!currentVehicle){
            var student = studentdb.find((item) => item.studentNumber === studentNumber)

            if(!student){
                student = {
                    id: nanoid(),
                    studentNumber,
                    name,
                    status: false,
                    classId
                }
                studentdb.push(student)

                const currentClass = classdb.find((item) => item.classId === classId)
                currentClass.students.push(student.id)
            }

            vehicledb.push({
                id: nanoid(),
                registration,
                pickupStudentId: student.id
            })

            await db.write()
            res.status(200).json(student);
        } else {
            res.status(500).json('Error - Vehicle exist')
            res.end()
        }
    } catch(e) {
        next(e.status, 'Error')
    }
})

//find student by vechile registration
app.get('/students/vehicle/:registration', async (req, res) => {
    const vehicle = vehicledb.find((p) => p.registration === req.params.registration)
    const student = studentdb.find((p) => p.id === vehicle.pickupStudentId)
    res.status(200).json(student);
})

app.get('/students/class/:classId', async (req, res) => {
    const classItem = classdb.find((p) => p.classId === req.params.classId)
    const studentList = []

    classItem.students.map((studentId) => {
        const studentItem = studentdb.find((p) => p.id === studentId)
        studentList.push(studentItem)
    })

    res.status(200).json(studentList);
})

//update student status (left or not)
app.patch('/students/:id', async (req, res, next) => {
    try {
        const {status} = req.body
        const student = studentdb.find((p) => p.id === req.params.id)
        if(typeof status !== 'boolean'){
            throw new Error('Error - status must be a Boolean value')
        }
        student.status = status
        await db.write()
        res.status(200).json(student);
    } catch(e) {
        next(e.status, 'Error')
    }
})

app.get('/vehicles/:id', async (req, res) => {
    const vehicle = vehicledb.find((p) => p.id === req.params.id)
    res.status(200).json(vehicle);
})



app.listen(PORT, ()=> {
    console.log(`Backend is running on http://localhost:${PORT}`)
})