let validate = (formValues) => {
  let errors ={};

  console.log("formValues: ", formValues);

  if(!formValues.firstName){
    errors.firstName = 'Please enter your first name';
  }

  if(!formValues.middleName){
    errors.middleName = 'Please enter your middle name or initial';
  }

  if(!formValues.lastName){
    errors.lastName = 'Please enter your last name';
  }

  if(!formValues.username){
    errors.username = 'Please enter a username';
  }

  if (!formValues.email) {
      errors.email = 'Email field is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      errors.email = 'Invalid email address'
  }

  if(!formValues.gender){
    errors.gender = 'Please select a gender';
  }

  if(!formValues.agencycountry){
    errors.agencycountry = 'Please choose a country from the list.';
  }

  if(!formValues.agencystate){
    errors.agencystate = 'Please choose a state from the list.';
  }

  if(!formValues.agencydropdown){
    errors.agencydropdown = 'Please choose an option from the list.';
  }

  if(!formValues.agencyname){
    errors.agencyname = 'Please enter the agency name.';
  }

  if(!formValues.agencyaddress){
    errors.agencyaddress = 'Please enter the agency address.';
  }

  if(!formValues.agencyappartment){
    errors.agencyappartment = 'Please enter the agency appartment.';
  }

  if(!formValues.agencycity){
    errors.agencycity = 'Please enter the agency city.';
  }


  if(!formValues.agencyzipcode){
    errors.agencyzipcode = 'Please enter the agency zip code.';
  }

  if (!formValues.agencyphonenumbers || !formValues.agencyphonenumbers.length) {
    errors.agencyphonenumbers = { _error: 'At least one phone number must be entered' };
  } else {
    let agencyphonenumbersArrayErrors = [];
    formValues.agencyphonenumbers.forEach((agency, index) => {
      let agencyphonenumbersErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);

      if (!agency || !regX.test(agency.phonenumber)) {
        agencyphonenumbersErrors.phonenumber = 'Please enter a phone number.';
        agencyphonenumbersArrayErrors[index] = agencyphonenumbersErrors;
      }
    });
    if (agencyphonenumbersArrayErrors.length) {
      errors.agencyphonenumbers = agencyphonenumbersArrayErrors;
    }
  }

  if (!formValues.recruitmentofficephonenumbers || !formValues.recruitmentofficephonenumbers.length) {
    errors.recruitmentofficephonenumbers = { _error: 'At least one recruitment office phone number must be entered.' };
  }else{
    let recruitmentofficephonenumbersArrayErrors = [];

    formValues.recruitmentofficephonenumbers.forEach((recruitmentoffice, index) => {
      let recruitmentofficephonenumbersErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);

      if (!regX.test(recruitmentoffice.phonenumber)){
        recruitmentofficephonenumbersErrors.phonenumber = 'Enter the recruitment office phone number.';
      }

      if(!recruitmentoffice.officeName){
        recruitmentofficephonenumbersErrors.officeName = 'Enter the recruitment office name.';
      }

      if(!recruitmentoffice.address){
        recruitmentofficephonenumbersErrors.address = 'Enter the recruitment office address.';
      }

      if(!recruitmentoffice.city){
        recruitmentofficephonenumbersErrors.city = "Enter the recruitment office city.";
      }

      recruitmentofficephonenumbersArrayErrors[index] = recruitmentofficephonenumbersErrors;
    });

    if(recruitmentofficephonenumbersArrayErrors.length){
      errors.recruitmentofficephonenumbers = recruitmentofficephonenumbersArrayErrors;
    }
  }

  if (!formValues.recruitmentofficesalespersons || !formValues.recruitmentofficesalespersons.length) {
    errors.recruitmentofficesalespersons = { _error: 'At least one sales person must be entered.' };
  }else{
    let recruitmentofficesalespersonsArrayErrors = [];

    formValues.recruitmentofficesalespersons.forEach((salesperson, index) => {
      let recruitmentofficesalespersonsErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);

      if (!regX.test(salesperson.salespersonphonenumber)){
        recruitmentofficesalespersonsErrors.salespersonphonenumber = 'Enter the sales person phone number.';
      }

      if(!salesperson.salespersonfirstname){
        recruitmentofficesalespersonsErrors.salespersonfirstname = 'Enter the sales person first name.';
      }

      if(!salesperson.salespersonlastname){
        recruitmentofficesalespersonsErrors.salespersonlastname = 'Enter the sales person last name.';
      }

      if(!salesperson.salespersongenre){
        recruitmentofficesalespersonsErrors.salespersongenre = "Enter a genre.";
      }

      recruitmentofficesalespersonsArrayErrors[index] = recruitmentofficesalespersonsErrors;
    });

    if(recruitmentofficesalespersonsArrayErrors.length){
      errors.recruitmentofficesalespersons = recruitmentofficesalespersonsArrayErrors;
    }
  }

  return errors;
}

export default validate;
