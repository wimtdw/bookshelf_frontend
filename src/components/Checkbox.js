// Checkbox.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCheckboxState } from '../selectors/checkboxSelectors';
import { checkboxClick } from '../actions/checkboxActions';
import styles from './Checkbox.module.css';

const Checkbox = ({ name, label }) => {
  const dispatch = useDispatch();
  const checked = useSelector(getCheckboxState(name));

  const handleClick = () => {
    dispatch(checkboxClick(name));
  };

  return (
    <div className={styles.checkboxContainer}>
      <input id={name} type="checkbox" checked={checked} onChange={handleClick} className={styles.checkboxInput} />
      <label htmlFor={name} className={styles.checkboxLabel}>{label}</label>
    </div>
  );
};

export default Checkbox;
