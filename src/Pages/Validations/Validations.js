let validate = (formValues) => {
  let errors ={};

  if(!formValues.firstName){
    errors.firstName = 'Please enter your first name';
  }

  if(!formValues.lastName){
    errors.lastName = 'Please enter your last name';
  }

  if(!formValues.username){
    errors.username = 'Please enter your username.';
  }

  if(!formValues.password){
    errors.password = 'Please enter your password.';
  }

  let passwordRegX = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

  if(!formValues.initialpassword){
    errors.initialpassword = 'Please enter your password.';
  }else if(formValues.initialpassword){
    if(!passwordRegX.test(formValues.initialpassword)){
      errors.initialpassword = 'Please enter a valid password (8 characters, alphanumeric).';
    }
  }

  if(!formValues.confirmpassword){
    errors.confirmpassword = 'Please confirm your password.';
  }else if(formValues.confirmpassword){
    if(!passwordRegX.test(formValues.confirmpassword)){
      errors.confirmpassword = 'Please enter a valid password (8 characters, alphanumeric).';
    }
  }

  if(formValues.initialpassword !==  formValues.confirmpassword){
    if(passwordRegX.test(formValues.initialpassword)){
      errors.initialpassword = 'Password does not match.';
    }

    if(passwordRegX.test(formValues.confirmpassword)){
      errors.confirmpassword = 'Password does not match.';
    }
  }

  if (!formValues.email) {
      errors.email = 'Email field is required.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      errors.email = 'Invalid email address.'
  }

  if(!formValues.birthday){
    errors.birthday = "Please enter your birthday";
  }

  if(!formValues.agencyrole){
    errors.agencyrole = "Please enter role.";
  }

  if(!formValues.agencyorganization){
    errors.agencyorganization = "Please enter the organization name.";
  }

  if(!formValues.agencyclient){
    errors.agencyclient = "Please enter the client name.";
  }

  if(!formValues.agencycountry){
    errors.agencycountry = 'Country is required.';
  }

  if(!formValues.agencystate){
    errors.agencystate = 'State is required.';
  }

  if(!formValues.agencydropdown){
    errors.agencydropdown = 'Please choose an option from the list.';
  }

  if(!formValues.agencyname){
    errors.agencyname = 'Name is required.';
  }

  if(!formValues.agencyaddress){
    errors.agencyaddress = 'Address is required.';
  }

  if(!formValues.agencyappartment){
    errors.agencyappartment = 'Address is required.';
  }

  if(!formValues.agencycity){
    errors.agencycity = 'City is required.';
  }

  if(!formValues.agencyzipcode){
    errors.agencyzipcode = 'Zip code is required.';
  }

  if (!formValues.agencyphonenumbers || !formValues.agencyphonenumbers.length) {
    errors.agencyphonenumbers = { _error: 'At least one phone number must be entered' };
  } else {
    let agencyphonenumbersArrayErrors = [];
    formValues.agencyphonenumbers.forEach((agency, index) => {
      let agencyphonenumbersErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

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
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

      if(!recruitmentoffice.officeName){
        recruitmentofficephonenumbersErrors.officeName = 'Name is required.';
      }

      if(!recruitmentoffice.address){
        recruitmentofficephonenumbersErrors.address = 'Address is required.';
      }

      if(!recruitmentoffice.city){
        recruitmentofficephonenumbersErrors.city = "City is required.";
      }

      if(!recruitmentoffice.zip){
        recruitmentofficephonenumbersErrors.zip = "Zip code is required.";
      }

      if (!regX.test(recruitmentoffice.phonenumber)){
        recruitmentofficephonenumbersErrors.phonenumber = 'Phone number is required.';
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
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

      if (!regX.test(salesperson.salespersonphonenumber)){
        recruitmentofficesalespersonsErrors.salespersonphonenumber = 'Phone number is required.';
      }

      if(!salesperson.salespersonfirstname){
        recruitmentofficesalespersonsErrors.salespersonfirstname = 'Name is required.';
      }

      if(!salesperson.salespersonlastname){
        recruitmentofficesalespersonsErrors.salespersonlastname = 'Lastname is required.';
      }

      if(!salesperson.salespersongenre){
        recruitmentofficesalespersonsErrors.salespersongenre = "Please select a gender.";
      }

      recruitmentofficesalespersonsArrayErrors[index] = recruitmentofficesalespersonsErrors;
    });

    if(recruitmentofficesalespersonsArrayErrors.length){
      errors.recruitmentofficesalespersons = recruitmentofficesalespersonsArrayErrors;
    }
  }

  if(!formValues.weekdaysdropdown1){
    errors.weekdaysdropdown1 = "Please select a week day.";
  }

  if(!formValues.weekdaysdropdown2){
    errors.weekdaysdropdown2 = "Please select a week day.";
  }

  if(!formValues.weekdaysdropdown3){
    errors.weekdaysdropdown3 = "Please select a week day.";
  }

  if(!formValues.fundingCompanydropdown){
    errors.fundingCompanydropdown = "Please select a funding company."
  }

  if(!formValues.company){
    errors.company = 'Company is required.';
  }

  if(!formValues.salesman){
    errors.salesman = 'Salesman is required.';
  }

  if(!formValues.payrollCycle){
    errors.payrollCycle = 'Payroll Cycle is required.';
  }

  if(!formValues.workCompCode){
    errors.workCompCode = 'Work compensation code is required.';
  }

  if(!formValues.workCompRate){
    errors.workCompRate = 'Work compensation rate is required.';
  }

  if(!formValues.companyInitials){
    errors.companyInitials = 'Company initials required.';
  }

  if(!formValues.attnTo){
    errors.attnTo = 'Attn to required.';
  }

  if(!formValues.markupClient){
    errors.markupClient = 'Markup is required.';
  }

  if(!formValues.otMarkupClient){
    errors.otMarkupClient = 'Markup is required.';
  }

  if(!formValues.clientcountry){
    errors.clientcountry = 'Country is required.';
  }

  if(!formValues.clientstate){
    errors.clientstate = 'State is required.';
  }

  if(!formValues.clientaddress){
    errors.clientaddress = 'Address is required.';
  }

  if(!formValues.clientcity){
    errors.clientcity = "City is required.";
  }

  if(!formValues.clientzipcode){
    errors.clientzipcode = "Zip code is required.";
  }

  if(!formValues.clientlastName){
    errors.clientlastName = "Last name required.";
  }

  if(!formValues.clientfirstName){
    errors.clientfirstName = "First name required.";
  }

  if(!formValues.clientcontactphone){
    let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

    if (!regX.test(formValues.clientcontactphone)){
      errors.clientcontactphone = "Contact phone number required.";
    }
  }

  if(!formValues.clientcontactcellphone){
    let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

    if (!regX.test(formValues.clientcontactcellphone)){
      errors.clientcontactcellphone = "Contact cell phone number required.";
    }
  }

  //Clients Form
  if(!formValues.position){
    errors.position = 'Please enter position';
  }

  if(!formValues.description){
    errors.description = 'Please enter description';
  }

  if(!formValues.markup){
    errors.markup = 'Please enter markup value';
  }

  if(!formValues.otmarkup){
    errors.otmarkup = 'Please enter ot markup value';
  }

  if(!formValues.payRate){
    errors.payRate = 'Please enter pay rate';
  }

  if(!formValues.timeIn){
    errors.timeIn = 'Please enter time in.';
  }

  if(!formValues.timeOut){
    errors.timeOut = 'Please enter time out';
  }

  if(!formValues.employeeContact){
    errors.employeeContact = 'Please enter employee contact';
  }

  if(!formValues.contactPhone){
    let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);

    if (!regX.test(formValues.contactPhone)){
      errors.contactPhone = 'Phone number is required.';
    }
  }

  if(!formValues.departmentname){
    errors.departmentname = "Please enter department name"
  }

  return errors;
}

export default validate;
