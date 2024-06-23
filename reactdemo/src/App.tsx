import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import { faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [people, setPeople] = useState([])
  const [currentSort, setCurrentSort] = useState({'type':'name', 'direction':true})

  var getNextPerson = function(){
    fetch('https://randomuser.me/api/').then(function(result){
      //console.log(result)
      return result.json()
    }).then(function(result){ 
      //console.log(result)
      setPeople([...people, result.results[0]])
      return result
    }).catch(function(e){console.log(e)})
  }
  var sortPeopleByName = function(){
    var newSort = {'type': 'name', 'direction': true}
    if (currentSort.type == 'name'){
      newSort.direction = !currentSort.direction
    } 
    setCurrentSort(newSort)
    var sorted = people.sort(function(a,b){return (newSort.direction?a:b).name.last.localeCompare((newSort.direction?b:a).name.last)})
    setPeople([...sorted])
  }
  var sortPeopleByPhone = function(){
    var newSort = {'type': 'phone', 'direction': true}
    if (currentSort.type == 'phone'){
      newSort.direction = !currentSort.direction
    }
    setCurrentSort(newSort)
    
    var sorted = people.sort(function(a,b){return (newSort.direction?a:b).phone.localeCompare((newSort.direction?b:a).phone)})
    setPeople([...sorted])
  }



  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React</h1>
      <p>People are gathered from api at <a href="https://randomuser.me/api">https://randomuser.me/api</a> and displayed with React.<br/>Sort the table in ascending or descending order by clicking the column name.<br/>Sort icon imported from fontawesome.</p>
      <div className="card">
        {<table>
          <thead>
            <tr><th>Img</th>
            <th><a onClick={sortPeopleByName}>Name{currentSort.type == 'name' ? (!currentSort.direction ?<FontAwesomeIcon icon={faArrowUpWideShort} />:<FontAwesomeIcon icon={faArrowDownShortWide} />):''}</a></th>
            <th><a onClick={sortPeopleByPhone}>Phone{currentSort.type == 'phone' ? (!currentSort.direction ?<FontAwesomeIcon icon={faArrowUpWideShort} />:<FontAwesomeIcon icon={faArrowDownShortWide} />):''}</a></th>
            </tr></thead>
            <tbody>
            {people.map((person,index) => {return (
          <tr key={index}>
              <td><img src={person.picture.thumbnail}></img></td>
              <td>{person.name.title + ' ' + person.name.first + ' ' + person.name.last}</td>
              <td>{person.phone}</td>
              
            </tr>
        )})}
            </tbody>
            </table>}
        
        <button onClick={getNextPerson}>Get a person</button>
      </div>
    </>
  )
}

export default App