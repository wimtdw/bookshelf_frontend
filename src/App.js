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
import HomeRedirect from './components/HomeRedirect';
import Search from './components/Search';
import Achievements from './components/Achievements';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Router>
            <AuthButtons />
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/search" element={<Search />} />

              <Route path="/:username/*">
                <Route index element={<BookList />} />
                <Route path="shelves" element={<ShelfList />} />
                <Route path="shelves/create" element={<ShelfForm />} />
                <Route path="shelves/edit/:id" element={<ShelfForm />} />
                <Route path="books/:id" element={<BookDetail />} />
                <Route path="achievements" element={<Achievements />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
