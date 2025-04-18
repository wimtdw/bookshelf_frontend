// AgreementSubmitButton.js
import React from 'react';
import { useSelector } from 'react-redux';
import { getCheckboxState } from '../selectors/checkboxSelectors';
import { useNavigate } from 'react-router-dom';
import styles from './AgreementSubmitButton.module.css';

const AgreementSubmitButton = () => {
  const checkboxName = 'agree';
  const agreed = useSelector(getCheckboxState(checkboxName));
  const navigate = useNavigate();

  const handleClick = () => {
    if (agreed) {
      navigate('/');
    }
  };

  return (
    <input
      type="button"
      value="Submit"
      disabled={!agreed}
      onClick={handleClick}
      className={styles.submitButton} 
    />
  );
};

export default AgreementSubmitButton;
