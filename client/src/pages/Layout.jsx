import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'

const Layout = () => {

  const user = dummyUserData;

  return user ? (
    <div className="min-h-screen bg-slate-200">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
