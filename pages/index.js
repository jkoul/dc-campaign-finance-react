import Header from '../components/header'
import * as Races from '../lib/mockApi/races.json'
import * as Committees from '../lib/mockApi/committees.json'
import fetchContributions from '../lib/fetchContributions'


const Index = (props) => (
  <div>
    <Header />
    <div>Total Number of Races: {props.races.length}</div>
    <div>Total Number of Committees: {props.committees.length}</div>
    {/* <ContributionList
      contribs={props.contribs}
    /> */}
  </div>
)

Index.getInitialProps = async function() {
  let contribs = await fetchContributions({'ELECTIONYEAR': 2018, 'CANDIDATENAME': 'Anita Bonds'})
  return {contribs: contribs, races: Races.races, committees: Committees.committees}
}
export default Index