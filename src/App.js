import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import createAppStore from './store/createStore';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import LicenseAgreement from './components/LicenseAgreement';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const store = createAppStore();

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/license-agreement" element={<LicenseAgreement />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
