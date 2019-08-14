const sortRaces = (races) => {
  const raceTypes = ["Mayor","Attorney General","Council","School Board","Shadow Delegation","Partisan Positions", "Other"]

  const raceTypeDetails = ["Chairman","President","At-Large","District 1","District 2","District 3","District 4","Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","US Senator","US Representative",""]


  function compareRaces(a, b){
    const raceTypeOrder = (item) => raceTypes.findIndex(type => type === item.raceType)
    const raceTypeDetailOrder = (item) => raceTypeDetails.findIndex(type => type === item.raceTypeDetail)
    
    if (a.electionYear < b.electionYear || 
      (a.electionYear === b.electionYear && raceTypeOrder(a) > raceTypeOrder(b)) || 
      (a.electionYear === b.electionYear && raceTypeOrder(a) === raceTypeOrder(b) && raceTypeDetailOrder(a) > raceTypeDetailOrder(b))) {
      return 1
    }
    else if (a.electionYear > b.electionYear || 
      (a.electionYear === b.electionYear && raceTypeOrder(a) < raceTypeOrder(b)) || 
      (a.electionYear === b.electionYear && raceTypeOrder(a) === raceTypeOrder(b) && raceTypeDetailOrder(a) < raceTypeDetailOrder(b))) {
      return -1
    }
    else {
      if (a.raceTypeDetail > b.raceTypeDetail) {
        return 1
      }
      
      else if (a.raceTypeDetail < b.raceTypeDetail) {
        return -1
      }
      else {
        return 0
      }
    }
  }

  return races.sort((a,b) => compareRaces(a,b))
  
}

export default sortRaces