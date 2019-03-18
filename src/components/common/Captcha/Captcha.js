import React from 'react';
import ReCaptcha from "react-google-recaptcha";
import keys from '../../../apiKeys/keys';

let Captcha = (props) => {
  let errorClass = `col-xs-12 ${(props.formProps.meta.error && props.formProps.meta.touched)? 'has-error-login login-input-error': 'captcha'}`;

  console.log("props: ", props);
  return(
    <div className={errorClass}>
      <ReCaptcha
          ref={(ref) => props.setCaptchaRef(ref) }
          size={props.formProps.size}
          height={props.formProps.height}
          sitekey={keys.RECAPTCHA_SITE_KEY}
          onChange={props.onChange}
      />
    </div>
  );
}

export default Captcha;
