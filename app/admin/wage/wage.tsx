import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

const supabase = createClient()

interface Employee {
  name: string
  role: string
  startTime?: string
  endTime?: string
  work_period?: number
  isWorking?: boolean
  tip?: number
}

function Wage() {
  const [employees, setEmployees] = useState<Employee[]>([])

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('*')
        .not('work_period', 'is', null)

      if (error) {
        console.error('Error fetching employee names:', error.message)
        return
      }

      const employeeData = data as Employee[]
      console.log('employeedata', employeeData)

      setEmployees(employeeData)
    } catch (error) {
      console.error('Error in fetchEmployeeNames:', error)
    }
  }

  const handleClearEmployeeData = async (employeeName: string) => {
    try {
      // Clear values and update is_working
      const { data, error } = await supabase
        .from('employee')
        .update({
          start_time: null,
          end_time: null,
          work_period: null,
          tip: 0,
          is_working: false
        })
        .eq('name', employeeName)

      if (error) {
        console.error('Error clearing employee data:', error.message)
        return
      }

      console.log(`Employee data cleared for ${employeeName}`)

      // Update the state to reflect the changes
      const updatedEmployees = employees.map(employee =>
        employee.name === employeeName
          ? {
              ...employee,
              startTime: undefined,
              endTime: undefined,
              isWorking: false
            }
          : employee
      )

      setEmployees(updatedEmployees)
      fetchEmployee()
    } catch (error) {
      console.error('Error in handleClearEmployeeData:', error)
    }
  }

  useEffect(() => {
    fetchEmployee()
    console.log(employees)
  }, [])

  return (
    <div className='flex flex-col justify-center gap-4'>
      {employees.map(employee => {
        const baseWage = employee.work_period ? employee.work_period * 40 : 0
        const tips = employee.tip ?? 0
        let total

        if (employee.tip && employee.tip > (employee.work_period ?? 0) * 10) {
          total = baseWage + employee.tip
        } else {
          total = (employee.work_period ?? 0) * 50
        }

        return (
          <div key={employee.name} className='flex items-center gap-5 text-xl'>
            <p>{employee.role}:</p>
            <p>{employee.name}</p>
            <p>
              Hours:{' '}
              <span className='font-bold'>
                {employee.work_period?.toFixed(2) ?? 0}
              </span>
            </p>
            <p>
              Base wage:{' '}
              <span className='font-bold'>${baseWage.toFixed(2)}</span>
            </p>
            <p>
              Tips: <span className='font-bold'>${tips}</span>
            </p>
            <p>
              Total: <span className='font-bold'>${total.toFixed(2)}</span>
            </p>
            <AlertDialog>
              <AlertDialogTrigger className='ml-4 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-4 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                Finalise
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure to Clear data for {employee.name}?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className='ml-4 h-10 items-center justify-center rounded bg-gradient-to-br from-[#fc6076] to-blue-600 px-2 py-1 text-xl font-bold text-white duration-300 ease-in-out hover:scale-105 hover:from-[#fc6076] hover:to-blue-500'>
                    <button
                      type='button'
                      onClick={() => handleClearEmployeeData(employee.name)}
                    >
                      Clear Data
                    </button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      })}
    </div>
  )
}

export default Wage
