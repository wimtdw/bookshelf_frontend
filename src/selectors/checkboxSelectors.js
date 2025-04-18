export const getCheckboxState = (name) => (state) =>
    state.checkboxes[name] ?? false;
