'use client';
import DashboardHome from '../dashboard/home'
import Container from '@mui/material/Container';
// import React from 'react';
import { Routes, Route } from 'react-router-dom';


 function App() {
  return (
    // <DashboardHome />
    <Container>
      <Routes>
          <Route path="/" element={<DashboardHome />} />
          {/* <Route path="/test" element={<div>error</div>} /> */}
      </Routes>
  </Container>

  )
}
export default App;