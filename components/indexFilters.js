import {useState, useEffect} from 'react'
import getElectionYears from '../lib/reducers/getElectionYears'
import Select from 'react-select'
import sortRaces from '../lib/reducers/sortRaces';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const IndexFilters = props => {
  const allRaces = props.props.races
  const allCommittees = props.props.committees
  const electionYears = getElectionYears(allRaces)

  const [activeYear, setYear] = useState(Math.max(...electionYears))
  const yearOptions = electionYears.map(year => ( {value: year, label: year.toString()} ))


  const filterRaces = (races=allRaces, year=activeYear) => sortRaces(races.filter(race => {return race.electionYear === year}))
  const [activeRaces, setActiveRaces] = useState(new Array)

  const mapRacesToOptions = (races) => races.map(race => ( {value: race.raceId, label: race.raceTypeDisplay} ))
  const [raceOptions, setRaceOptions] = useState(mapRacesToOptions(filterRaces()))

  
  const handleYearChange = (selectedYear => {
    setYear(selectedYear.value)
    setActiveRaces([])
    setRaceOptions(mapRacesToOptions(filterRaces(allRaces, selectedYear.value)))
  })

  const handleRacesChange = (selectedItems) => {
    selectedItems && selectedItems.length ?
    setActiveRaces(sortRaces(selectedItems.map(item => filterRaces(allRaces, activeYear).find(race => (item.value === race.raceId))))) :
    setActiveRaces([])
  }

  return (
    <div>
      <div>Total Number of Races: {allRaces.length}</div>
      <div>Total Number of Committees: {allCommittees.length}</div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper>
            <h3>Year</h3>
            <Select 
              className="year-filter"
              classNamePrefix="year"
              inputId="year-filter-single"
              defaultValue={yearOptions.find(yearObj => {return yearObj.value === activeYear })}
              options={yearOptions.reverse()}
              onChange={handleYearChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper>
            <h3>Select One or More Races (<button onClick={() => setActiveRaces(filterRaces())}>show all</button>)</h3>
            <Select
              options={raceOptions}
              hideSelectedOptions={false}
              value={mapRacesToOptions(activeRaces)}
              isMulti
              // controlShouldRenderValue={false}
              onChange={handleRacesChange}
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <h2>Races in {activeYear}</h2>
            <div className="races-list">
              {activeRaces && activeRaces.length ? activeRaces.map(race => (
                <h3 key={race.raceId}>{race.raceTypeDisplay}</h3>
              )) : <div>No Races to Display</div>
              }
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default IndexFilters