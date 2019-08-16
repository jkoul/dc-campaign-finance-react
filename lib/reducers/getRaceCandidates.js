const getRaceCandidates = (race, committees) => {
  const raceCommittees = committees.filter((committee) => committee.raceId === race.raceId )
  const candidateNames = raceCommittees.map(committee => committee.candidateName )
  const candidatesList = new Set(candidateNames)
  return [...candidatesList].sort()
}

export default getRaceCandidates