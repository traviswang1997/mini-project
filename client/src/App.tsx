import './App.css'

function App () {
  return (
    <div className="mini-project">
      <div className='grid grid-cols-2 '>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Number
          </label>
          <input className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Name
          </label>
          <input className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Student Class
          </label>
          <select className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></select>
        </div>
        <div className='w-full px-3'>
          <label className="pl-3 text-base font-medium text-[#07074D]">
            Vehicle Registration
          </label>
          <input className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'></input>
        </div>
      </div>
      <button className='w-1/5 my-3 hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none'>
          Add Student
      </button>

      <div className='flex justify-center'>
        <div className='classA'>
          Class A
          <div style={{ border: '1px solid black', width: '500px', height: '500px' }}>

          </div>
        </div>
        <div className='classB'>
          Class B
          <div style={{ border: '1px solid black', width: '500px', height: '500px' }}>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App
