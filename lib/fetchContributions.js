import fetch from 'node-fetch'
import Moment from 'moment'


const baseUrl = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/34/query"

const settings = {
  maxResults: 1000,
  stepMax: 200,
}

const stringifyParams = (paramsObj={}) => {
  let paramArray = []
  let keys = Object.keys(paramsObj)
  if(keys.length) {
    keys.forEach(key => {
      let itemString = (typeof paramsObj[key] === 'string') ? `${key}='${paramsObj[key]}'` : `${key}=${paramsObj[key]}`
      paramArray = [...paramArray, itemString]
    })

    let paramString = paramArray.join(' AND ')
    return paramString
  }
  else {
    return '1=1'
  }
}

const getIds = async (params) => {
  const query = await fetch(`${baseUrl}?returnGeometry=false&returnIdsOnly=true&f=json&where=${params}`)
  const data = await query.json()
  return data.objectIds
}

const querySmall = async (params) => {
  const response = await fetch(`${baseUrl}?where=${params}&outFields=*&f=json`)
  const data = await response.json()
  return data
}

const queryLarge = async (queryIds) => {
  let count = 0
  const queryUrls = []
  while(count < queryIds.length){
    const idsString = queryIds.slice(count, count+settings.stepMax).join(',')
    queryUrls.push(`${baseUrl}?objectIds=${idsString}&outFields=*&f=json`)
    count += settings.stepMax;
  }

  const singleQuery = async (url) => {
    const partialQuery = await fetch(url)
    const partialData = await partialQuery.json()
    return partialData
  }

  const fetchPartialQueries = async(queryUrls) => {
    const queries = queryUrls.map((url) => {
      return singleQuery(url)
    })

    return Promise.all(queries)
  }


  return await fetchPartialQueries(queryUrls)
  .then((res) => {
    const response = {features:[]}
    res.forEach((partialQuery) => {
      const features = partialQuery.features;
      response.features = [...response.features, ...features]
    })
    return response
  })
}

const fetchContributions = async (paramsObj) => {
  const params = stringifyParams(paramsObj)
  const queryIds = await getIds(params)
  
  // first query didn't return any results
  if(!queryIds) {
    return;
  }
  // simple small query when <=1K results
  else if(queryIds.length <= settings.maxResults) {
    let data = await querySmall(params)
    return processQueryResults(data.features)
  }

  // larger query by IDs
  else {
    let data = await queryLarge(queryIds)
    return processQueryResults(data.features)
  }
}

const processQueryResults = (contribData) => {
  return contribData.map((contrib) => {
    return {
      address: contrib.attributes.ADDRESS,
      addressId: contrib.attributes.ADDRESS_ID,
      amount: contrib.attributes.AMOUNT,
      candidateName: contrib.attributes.CANDIDATENAME,
      committeeName: contrib.attributes.COMMITTEENAME,
      contributionType: contrib.attributes.CONTRIBUTIONTYPE,
      contributorName: contrib.attributes.CONTRIBUTORNAME,
      contributorType: contrib.attributes.CONTRIBUTORTYPE,
      dateReceived: Moment(contrib.attributes.DATEOFRECEIPT),
      electionYear: contrib.attributes.ELECTIONYEAR,
      employer: contrib.attributes.EMPLOYER,
      employerAddress: contrib.attributes.EMPLOYERADDRESS,
      normalizedAddress: contrib.attributes.FULLADDRESS,
      lat: contrib.attributes.LATITUDE,
      long: contrib.attributes.LONGITUDE,
      objectId: contrib.attributes.OBJECTID,
      ward: contrib.attributes.WARD
    }
  })
}



export default fetchContributions
