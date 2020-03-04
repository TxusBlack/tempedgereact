let getCountryList = (countryList) => {
  let country_list = [];

  countryList.map((country) => {
    country_list.push({
      name: country.name,
      countryId: country.countryId
    });
  });

  return {
    countryList,
    country_list
  };
};

let getRegionList = async (countryList, selectedCountry) => {
  let regions;
  let regions_list = [];

  await countryList.map((country) => {
    if (country.name === selectedCountry) {
      regions = country.regionEntityList;
    }
  });

  regions.map((region) => {
    regions_list.push({
      name: region.name,
      regionId: region.regionId,
      shortCode: region.shortCode
    });
  });

  return regions_list;
};

let parseCountryRegion = {
  getCountryList,
  getRegionList
};

export default parseCountryRegion;
