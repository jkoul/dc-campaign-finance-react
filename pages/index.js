import Header from '../components/header'
import * as Races from '../lib/mockApi/races.json'
import * as Committees from '../lib/mockApi/committees.json'
// import fetchContributions from '../lib/fetchContributions'
import IndexFilters from '../components/indexFilters'


const Index = (props) => (
  <div>
    <Header />
    
    <IndexFilters 
      props={props}
    />



    {/* <ContributionList
      contribs={props.contribs}
    /> */}
  </div>
)

Index.getInitialProps = async function() {
  // let contribs = await fetchContributions({'ELECTIONYEAR': 2018, 'CANDIDATENAME': 'Anita Bonds'})
  return {races: Races.races, committees: Committees.committees}
}
export default Index