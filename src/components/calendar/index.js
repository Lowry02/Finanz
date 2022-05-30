import React, {useState, useEffect} from 'react'
import moment from "moment"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import "./style.css"

function CustomCalendar(props) {
  let date = props.date
  let setExternalDate = props.setDate

  let weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
  const [currentDate, setCurrentDate] = useState(moment())

  function changeDate(dateString) {
    let newDate = moment(dateString, "DD/MM/YYYY")
    setCurrentDate(newDate)
  }

  function getClass(dateString) {
    dateString = moment(dateString, "DD/MM/YYYY").format("DD/MM/YYYY")
    let currentDateString = currentDate.format("DD/MM/YYYY")
    let today = moment().format("DD/MM/YYYY")
    let classe = ""


    if(today == dateString) classe += "today"
    if(currentDateString == dateString) classe += " selected"
    if(date != undefined && date.includes(dateString)) classe += " events"

    return classe
  }

  function getTableRows() {
    let list = []
    let daysInMonth = currentDate.daysInMonth()
    let _copy = moment(currentDate.format("MM/YYYY"), "MM/YYYY")
    let firstDay = parseInt(_copy.startOf("month").format('d'))
    firstDay = firstDay == 0 ? 7 : firstDay
    let firstCicle = true
    let _month_year = currentDate.format("MM/YYYY")

    for(let i = -firstDay + 1; i < daysInMonth; i = i + 7) {
      if(firstCicle) {
        let emptyCells = firstDay - 1 > 0 ? [...Array(firstDay - 1).keys()] : []
        let notEmptyCells = 7 - firstDay + 1 > 0 ? [...Array(7 - firstDay + 1).keys()] : []
        let localList = [...emptyCells, ...notEmptyCells]
        list.push(
          <tr>
            {
              localList.map(
                (item, index) => 
                index + 1 < firstDay ?
                  <td key={index} className="empty_cell"></td>:
                  <td key={index}
                  onClick={() => changeDate((item +1) + "/" + _month_year)}
                  className={getClass((item + 1) + "/" + _month_year)}
                  >{item + 1}</td>
              )
            }
          </tr>
        )
        firstCicle = false
      } else {
        let localList = []
        for(let j = i; j < Math.min(i + 7, daysInMonth); j++) localList.push(j)
        list.push(
          <tr>
            {
              localList.map(
                (item) => 
                <td 
                onClick={() => changeDate((item + 1) + "/" + _month_year)}
                className={getClass((item + 1) + "/" + _month_year)}
                key={item}>{item + 1}</td>
              )
            }
          </tr>
        )
      }
    }
    return list
  }

  function nextMonth() {
    let newDate = moment(currentDate.format()).add(1, "month")
    setCurrentDate(newDate)
  }

  function prevMonth() {
    let newDate = moment(currentDate.format()).add(-1, "month")
    setCurrentDate(newDate)
  }

  useEffect(() => {
    if(date != undefined)
      date.sort((a,b) => moment(a).diff(moment(b, "DD/MM/YYYY")))
  }, [date])

  useEffect(() => {
    setExternalDate(currentDate.format("DD/MM/YYYY"))
  }, [currentDate])
  
  
  return (
    <div className="my_calendar">
      <h6><ArrowBackIosNewIcon onClick={prevMonth}/>{currentDate.format("MMMM YYYY")}<ArrowForwardIosIcon onClick={nextMonth}/></h6>
    <table>
      <thead>
      {
        weekDays && weekDays.map(
        (day) => <th key={day}>{day}</th>
        )
      }
      </thead>
      <tbody>
        {
          getTableRows().map(
            (item) => item 
          )
        }
      </tbody>
    </table>
    </div>
  )
}

export default CustomCalendar