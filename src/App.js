import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Create from './componentes/Create';
import Edit from './componentes/Edit';
import Show from './componentes/Show';
import Login from './componentes/Login';
import NavBar from './componentes/NavBar';
import Cabecera from './componentes/Cabecera';

const App =() => {
  return (
    <BrowserRouter>     
    <Cabecera />
    <NavBar> 
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Show" element={<Show />} />
        <Route path="/Create" element={<Create />} />
        <Route path="/Edit/:id" element={<Edit />} />    
    </Routes>
    </NavBar>
    </BrowserRouter>
   
  );
};

export default App;
