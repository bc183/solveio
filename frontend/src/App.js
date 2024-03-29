import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoutes from './components/ProtectedRoutes';
import PreventLoginRoutes from './components/PreventLoginRoutes';
import Header from './components/Header';
import CreatePost from './pages/CreatePost';
import PostView from './pages/PostView';
import EditPost from './pages/EditPost';
import CreateAnswer from './pages/CreateAnswer';
import EditAnswer from './pages/EditAnswer';
import SearchView from './pages/SearchView';
import ViewUser from './pages/ViewUser';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import EditProfile from './pages/EditProfile';
import CheckPassword from './pages/CheckPassword';
function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route element={ <ProtectedRoutes /> }>
          <Route path="/post/create" element={ <CreatePost /> } />
          <Route path="/answer/create/:id" element={ <CreateAnswer /> } />
          <Route path="/post/:id/edit" element={ <EditPost /> } />
          <Route path="/user/:id/edit" element={ <EditProfile /> } />
          <Route path="/answer/:id/edit" element={ <EditAnswer /> } />
          <Route path="/update-password" element={ <CheckPassword /> } />
        </Route>
        <Route path="" element={ <Home /> } />
        <Route path="search/" element={ <SearchView /> } />
        <Route path="post/:id" element={ <PostView /> } />
        <Route path="user/:id" element={ <ViewUser /> } />
        <Route element={ <PreventLoginRoutes /> }>
          <Route path="/login" element={ <Login /> } preventLogin={true} />
          <Route path="/register" element={ <Register /> } preventLogin={true}/>
          <Route path="/forgot-password" element={ <ForgotPassword /> } preventLogin={true}/>
          <Route path="/update-password/:token" element={ <UpdatePassword /> } preventLogin={true}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
