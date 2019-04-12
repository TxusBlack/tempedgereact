let getCountryList = (countryList) => {
  let country_list = [];

  countryList.map((country, index) => {
    country_list.push({
      country: country.countryName,
      value: index
    });
  });

  return {
    countryList,
    country_list
  };
}

let getRegionList = (countryList, selectedCountry) => {
  let regions;
  let regions_list = [];

  countryList.map((country) => {
    if(country.countryName === selectedCountry){
      regions = country.regions;
    }
  });

  regions.map((region, index) => {
    regions_list.push({
      region: region.name,
      value: index
    });
  });

  return regions_list;
}

let parseCountryRegion = {
  getCountryList,
  getRegionList
}

export default parseCountryRegion;
