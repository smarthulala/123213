import React, { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'
import calculateWorkPeriod from './components/CalculateWorkPeriod'

type Role = 'Manager' | 'Dealer'

interface Employee {
  name: string
  role: string
  startTime?: string
  endTime?: string
  isWorking?: boolean
}

const supabase = createClient()

function EmployeeSelection() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedName, setSelectedName] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role | ''>('')
  const [allEmployeeNames, setAllEmployeeNames] = useState<string[]>([])

  const handleNameChange = (name: string) => {
    setSelectedName(name)
  }

  const handleConfirm = async () => {
    if (selectedName && selectedRole) {
      try {
        const { data, error } = await supabase
          .from('employee')
          .update({ role: selectedRole })
          .eq('name', selectedName)

        if (error) {
          console.error('Error updating role:', error.message)
          return
        }

        console.log(`Role for ${selectedName} updated to ${selectedRole}`)

        // Update the state to reflect the changes
        // const updatedEmployees = employees.map(employee =>
        //   employee.name === selectedName
        //     ? { ...employee, role: selectedRole }
        //     : employee
        // )

        const newEmployee: Employee = { name: selectedName, role: selectedRole }
        setEmployees([...employees, newEmployee])

        console.log(employees)
      } catch (error) {
        console.error('Error in handleConfirm:', error)
      }
    }
  }

  const fetchEmployeeNames = async () => {
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('name')
        .eq('is_working', false)

      if (error) {
        console.error('Error fetching employee names:', error.message)
        return
      }

      const employeeNames = data.map((employee: any) => employee.name)
      setAllEmployeeNames(employeeNames)
    } catch (error) {
      console.error('Error in fetchEmployeeNames:', error)
    }
  }

  const fetchWorkingEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('*')
        .eq('is_working', true)

      if (error) {
        console.error('Error fetching working employees:', error.message)
        return
      }
      console.log('data', data)

      const workingEmployees = data.map((employee: any) => ({
        name: employee.name,
        role: employee.role,
        startTime:
          new Date(employee.start_time).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) || undefined,
        isWorking: true
      }))

      console.log('workingEmployee,', workingEmployees)

      setEmployees(workingEmployees)
    } catch (error) {
      console.error('Error in fetchWorkingEmployees:', error)
    }
  }

  const handleStartEmployee = async (employeeName: string) => {
    try {
      const { data, error } = await supabase
        .from('employee')
        .update({
          start_time: new Date().toISOString(),
          is_working: true
        })
        .eq('name', employeeName)

      if (error) {
        console.error('Error starting employee:', error.message)
        return
      }

      console.log(`Employee ${employeeName} started.`)
      fetchEmployeeNames()
    } catch (error) {
      console.error('Error in handleStartEmployee:', error)
    }
  }

  const handleEndEmployee = async (employeeName: string) => {
    try {
      const { data: startData, error: startDataError } = await supabase
        .from('employee')
        .select('start_time')
        .eq('name', employeeName)

      if (startDataError) {
        console.error('Error fetching start_time:', startDataError.message)
        return
      }

      const startTime = startData[0]?.start_time

      const { error } = await supabase
        .from('employee')
        .update({
          end_time: new Date().toISOString(),
          work_period: calculateWorkPeriod(startTime, new Date().toISOString()),
          is_working: false
        })
        .eq('name', employeeName)

      if (error) {
        console.error('Error ending employee:', error.message)
        return
      }

      const updatedEmployees = employees.filter(
        employee => employee.name !== employeeName
      )
      setEmployees(updatedEmployees)

      console.log(`Employee ${employeeName} ended.`)
      fetchEmployeeNames()
    } catch (error) {
      console.error('Error in handleEndEmployee:', error)
    }
  }

  const handleEndAllEmployees = async () => {
    try {
      await Promise.all(
        employees.map(async employee => {
          await handleEndEmployee(employee.name)
        })
      )

      fetchWorkingEmployees()
    } catch (error) {
      console.error('Error in handleEndAllEmployees:', error)
    }
  }

  useEffect(() => {
    fetchEmployeeNames()
    fetchWorkingEmployees()
    console.log('employee', employees)
  }, [])

  return (
    <div className='-ml-20 flex gap-2'>
      <div>
        <AlertDialog>
          <AlertDialogTrigger className='my-2 flex h-10 w-[150px] items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-2xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
            Add Staff
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-3xl'>
                Add Staff:
              </AlertDialogTitle>
              <AlertDialogDescription className='text text-center text-3xl font-bold'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {selectedName || 'Name'}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='rounded'>
                    {allEmployeeNames.map(employeeName => (
                      <DropdownMenuItem
                        inset
                        key={employeeName}
                        onClick={() => handleNameChange(employeeName)}
                      >
                        {employeeName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className='my-2'>
                  <ToggleGroup type='single'>
                    <ToggleGroupItem
                      value='manager'
                      className='rounded'
                      onClick={() => setSelectedRole('Manager')}
                    >
                      Manager
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value='dealer'
                      className='rounded'
                      onClick={() => setSelectedRole('Dealer')}
                    >
                      Dealer
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className='ml-4 h-10 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger className='my-2 flex h-10 w-[150px] items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-2xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
            End All
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to END ALL EMPLOYEE?
              </AlertDialogTitle>
              <AlertDialogDescription />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className='ml-4 h-10 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                <button
                  type='button'
                  className='my-2 flex h-10 w-[200px] items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-2xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'
                  onClick={handleEndAllEmployees}
                >
                  End All
                </button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        {employees.map(employee => (
          <div className='mt-2 text-2xl' key={employee.name}>
            <span className='font-bold'>{employee.name}</span> {employee.role}
            {employee.isWorking ? (
              <AlertDialog>
                <AlertDialogTrigger className='ml-4 h-10 w-fit items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                  End
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to END?</AlertDialogTitle>
                    <AlertDialogDescription className='text-end text-white'>
                      <div className='text-xl font-bold'>{employee.name}</div>
                      <div className='text-xl'>{employee.role}</div>
                      <div>
                        Start at:{' '}
                        <span className='text-xl font-bold'>
                          {employee.startTime}
                        </span>
                      </div>
                      <div>
                        End at:{' '}
                        <span className='text-xl font-bold'>
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='ml-4 h-10 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                      <button
                        type='button'
                        onClick={() => handleEndEmployee(employee.name)}
                      >
                        End
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger className='ml-4 h-10 w-fit items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                  Start
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to START?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div>{employee.name}</div>
                      <div>{employee.role}</div>
                      <div>{new Date().toLocaleTimeString()}</div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='ml-4 h-10 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                      <button
                        type='button'
                        onClick={() => {
                          handleStartEmployee(employee.name)
                          const updatedEmployees = employees.map(emp =>
                            emp.name === employee.name
                              ? { ...emp, isWorking: true }
                              : emp
                          )
                          setEmployees(updatedEmployees)
                        }}
                      >
                        Start
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployeeSelection
