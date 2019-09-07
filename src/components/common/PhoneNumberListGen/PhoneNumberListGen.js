import React from 'react';
import { Field } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

let renderPhoneNumberInputs = (formProps) => {
  let phoneTypeList = ["fax", "local", "other", "toll-free", "tty"];

  if(formProps.fields.length < 1){
    formProps.fields.push({});
  }

  return(
    <div className="list" style={{padding: 0}}>
      {formProps.fields.map((phoneOwner, index) => {
        return(
          <div key={index} className="list-item row">
            <div className="col-md-4">
              <label className="control-label">{formProps.label.substring(0, formProps.label.indexOf(":"))}</label>
              <Field name={`${phoneOwner}.phonenumber`} type="text" index={index} placeholder="xxx-xxx-xxxx" component={InputBox} />
            </div>

            <div className="col-md-4">
              <label className="control-label">{formProps.label.substring(formProps.label.indexOf(":")+2, formProps.label.lastIndexOf(":"))}</label>
              <Field name={`${phoneOwner}.phoneext`} type="text" index={index} placeholder="xxxx" component={InputBox} />
            </div>

            <div className="col-md-4 agency-phone-type">
              { <span className="pull-right" title="Remove Phone" onClick={() => formProps.fields.remove(index)}><img className="delete-icon-phones" src={deleteIcon} alt="deleteIcon" /></span> }
            </div>
          </div>
        );
        })
      }

      <div className="list-item row">
        <div className="col-md-12">
          <span className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} alt="addIcon" /></span>
        </div>
      </div>
    </div>
  );
}

export default renderPhoneNumberInputs;
