import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import createAppStore from './store/createStore';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import LicenseAgreement from './components/LicenseAgreement';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ShelfList from './components/ShelfList';
import ShelfForm from './components/ShelfForm';
import ShelfDetail from './components/ShelfDetail'; // Заглушка, пока не реализована

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const store = createAppStore();

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/shelves" element={<ShelfList />} />
            <Route path="/shelves/:id" element={<ShelfDetail />} />
            <Route path="/shelves/create" element={<ShelfForm />} />
            <Route path="/shelves/edit/:id" element={<ShelfForm />} />
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
