import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import React from 'react'

function Layout({children}) {
  return (
    <div>
        <Sidebar />
        {children}
        <Footer />
    </div>
  )
}

export default Layout