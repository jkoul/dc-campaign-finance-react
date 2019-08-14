const getElectionYears = (races) => {
  if(!races || !races.length) {
    return false;
  }

  const allRaceYears = races.map(race => race.electionYear)
  const uniqueRaceYears = new Set(allRaceYears)
  return [...uniqueRaceYears].sort()
}

export default getElectionYears