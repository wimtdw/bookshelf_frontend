import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import createAppStore from './store/createStore';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ShelfList from './components/ShelfList';
import ShelfForm from './components/ShelfForm';
import { AuthProvider } from './components/AuthContext';
import AuthButtons from './components/AuthButtons';

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
      <AuthProvider>
        <div className="App">
          <Router>
            <AuthButtons />
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/shelves" element={<ShelfList />} />
            <Route path="/shelves/create" element={<ShelfForm />} />
            <Route path="/shelves/edit/:id" element={<ShelfForm />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
      </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
