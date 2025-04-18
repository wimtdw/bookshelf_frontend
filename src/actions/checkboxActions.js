import { CHECKBOX_CLICK } from './actionTypes';

export const checkboxClick = (name) => ({
  type: CHECKBOX_CLICK,
  payload: name,
});
