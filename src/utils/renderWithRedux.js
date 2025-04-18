import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import createAppStore from '../store/createStore';

export const renderWithRedux = (node, initialState = { checkboxes: {} }) => {
    const store = createAppStore(initialState);

    return create(<Provider store={store}>{node}</Provider>);
};
