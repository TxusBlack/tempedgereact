let getCountryList = (countryList) => {
  let country_list = [];

  countryList.map((country) => {
    country_list.push(country.countryName);
  });

  return country_list;
}

let getRegionList = (countryList, selectedCountry) => {
  let regions;
  let regions_list = [];

  countryList.map((country) => {
    if(country.countryName === selectedCountry){
      regions = country.regions;
    }
  });

  regions.map((region) => {
    regions_list.push(region.name);
  });

  return regions_list;
}

let parseCountryRegion = {
  getCountryList,
  getRegionList
}

export default parseCountryRegion;
