import { useState } from 'react'
import axios from 'axios'
import './App.css'

interface Student {
  id: number,
  name: string,
  studentNumber: string,
  status: boolean,
  classId: string
}

interface CreateStudent {
  name?: string,
  studentNumber?: string,
  status?: boolean,
  classId?: string,
  registration?: string
}

const SERVER_ENDPOINT = 'http://localhost:3001'

function App () {
  const [students, setStudents] = useState<Student[]>([])
  const [content, setContent] = useState<CreateStudent>({
    classId: 'classA'
  })
  const [searchRegistration, setSearchRegistration] = useState<string>('')
  const [countLeftA, setCountLeftA] = useState<number>(0)
  const [countLeftB, setCountLeftB] = useState<number>(0)

  // useEffect(() => {
  //   axios.get('http://localhost:3001/students')
  //     .then(res => {
  //       const studentList = res.data
  //       setStudents(studentList)
  //     })
  // }, [])

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const name: string = e.target.name
    const value: string = e.target.value
    setContent(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    axios.post(`${SERVER_ENDPOINT}/students`, content, { headers })
      .then((res) => {
        alert(`Success - ${res.data.name} has been added`)
      })
      .catch(e => alert(e))

    setContent({
      classId: 'classA'
    })
  }

  const handleSearchChange = (e: { target: { value: string } }) => {
    const value: string = e.target.value
    setSearchRegistration(value)
  }

  const handleSearchSubmit = () => {
    axios.get(`${SERVER_ENDPOINT}/students/vehicle/${searchRegistration}`)
      .then(res => {
        if (!students.find(student => student.id === res.data.id)) {
          if (res.data.status === true) {
            alert(`${res.data.name} has left`)
          } else {
            setStudents([...students, res.data])
          }
        }
      })
      .catch(e => alert(e))
    setSearchRegistration('')
  }

  const handleLeave = (student: Student) => {
    if (!student.status) {
      const headers = {
        'Content-Type': 'application/json'
      }

      const body = {
        status: true
      }

      axios.patch(`${SERVER_ENDPOINT}/students/${student.id}`, body, { headers })
        .then(res => {
          res.data.classId === 'classA' ? setCountLeftA(pre => pre + 1) : setCountLeftB(pre => pre + 1)
          setStudents(pre => pre.filter((studentItem) => studentItem.id !== student.id))
        })
        .catch(e => alert(e))
    }
  }

  return (
    <div className="mini-project">
      {/* Search for student by entering registration part */}
      <div className='flex items-center mb-8 shadow-lg bg-stone-100'>
        <div className='w-4/5 px-3'>
          <input
          type="text"
          name='searchRegistration'
          value={searchRegistration}
          onChange={handleSearchChange}
          placeholder="Vehicle Registration"
          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
        <button onClick={handleSearchSubmit} className='w-1/5 my-3 mx-3 hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none'>
            Search Student
        </button>
      </div>
      {/* students in classroom A */}
      <div className='flex w-full my-8 justify-around'>
        <div className='classA w-1/3'>
          <div className='font-bold text-sky-500'>Class A</div>
          <div className='h-96 divide-y divide-solid divide-sky-300 border-sky-500 border-solid border'>
            <div className='flex justify-around'>
              <div><span className='font-semibold'>{students.filter(student => student.classId === 'classA').length}</span> in Classroom</div>
              <div><span className='font-semibold'>{countLeftA}</span> have Left</div>
            </div>
            {students && students.map((student, key) => {
              return (
                student.classId === 'classA' && !student.status &&
                <div className='flex w-full bg-stone-100 p-2 items-center' key={key}>
                  <div className='w-1/2'>{student.name}</div>
                  <button onClick={() => handleLeave(student)} className='w-1/3 placeholder:hover:shadow-form rounded-md bg-[#aeb0b3] p-2 text-center text-base font-semibold text-white outline-none' style={{ backgroundColor: student.status ? '#aeb0b3' : '#407ef1' }}>
                    {student.status ? 'Left' : 'Leave'}
                  </button>
                </div>
              )
            }
            )}
          </div>
        </div>
        {/* students in classroom B */}
        <div className='classB w-1/3'>
          <div className='font-bold text-sky-500'>Class B</div>
          <div className='h-96 divide-y divide-solid divide-sky-300 border-sky-500 border-solid border'>
            <div className='flex justify-around'>
              <div><span className='font-semibold'>{students.filter(student => student.classId === 'classB').length}</span> in Classroom</div>
              <div><span className='font-semibold'>{countLeftB}</span> have Left</div>
            </div>
            {students && students.map((student, key) => {
              return (
                student.classId === 'classB' && !student.status &&
                <div className='flex w-full bg-stone-100 p-2 items-center' key={key}>
                  <div className='w-1/2'>{student.name}</div>
                  <button onClick={() => handleLeave(student)} className='w-1/3 placeholder:hover:shadow-form rounded-md bg-[#aeb0b3] p-2 text-center text-base font-semibold text-white outline-none' style={{ backgroundColor: student.status ? '#aeb0b3' : '#407ef1' }}>
                    {student.status ? 'Left' : 'Leave'}
                  </button>
                </div>
              )
            }
            )}
          </div>
        </div>
      </div>
      {/* add student to the database */}
      <div className='grid grid-cols-2 mt-8 shadow-lg py-8 bg-stone-100'>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Number
          </label>
          <input
          type="text"
          name='studentNumber'
          value={content?.studentNumber || ''}
          onChange={handleChange}
          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Name
          </label>
          <input
          type="text"
          name='name'
          value={content?.name || ''}
          onChange={handleChange}
          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Class
          </label>
          <select
          name='classId'
          value={content.classId || 'classA'}
          onChange={handleChange}
          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'>
            <option value="classA">ClassA</option>
            <option value="classB">ClassB</option>
          </select>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Vehicle Registration
          </label>
          <input
          type="text"
          name='registration'
          value={content?.registration || ''}
          onChange={handleChange}
          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
      </div>
      <button onClick={handleSubmit} className='w-1/5 my-3 hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none'>
          Add Student
      </button>
    </div>
  )
}

export default App
