import { useState } from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './App.css'
import { Signup } from '../components/Signup'
import { Dashboard } from '../components/Dashboard'
import { Login } from '../components/Login'
import { ToastContainer } from 'react-toastify';

import Home from '../components/Home'
import Courses from '../components/Courses'
import Students from '../components/Students'
import AddStudents from '../components/AddStudents'
import Fee from '../components/Fee'
import FeeStatement from '../components/FeeStatement'
import AddCourses from '../components/AddCourses'
import CourseDetails from '../components/CourseDetails'
import StudentDetails from '../components/StudentDetails'

function App() {

  const Router  = createBrowserRouter([
    {
      path: '/',
      element: <Login/>,
    },
    {
      path:'/login',
      element: <Login/>,
    },
    {
      path:'/signup',
      element: <Signup/>
    },
    {
      path:'/dashboard',
      element: <Dashboard/>,
      children:[
      {path:'',element: <Home/>},
      {path:'home',element: <Home/>},
      {path:'courses',element:<Courses/>},
      {path:'add-courses', element:<AddCourses/>},
      {path:'students',element:<Students/>},
      {path:'add-student',element:<AddStudents/>},
      {path:'add-fee',element:<Fee/>},
      {path:'fee-history',element:<FeeStatement/>},
      {path:'course-details/:id',element:<CourseDetails/>},
      {path:'update-course/:id', element: <AddCourses/>},
      {path:'update-student/:id', element: <AddStudents/>},
      {path:'student-details/:id',element:<StudentDetails/>},
    ]
    },

  ])

  // if(loading){
  //   return <div>
  //     <img src="favicon-.png" alt="Institute Logo" />
  //     <h2>
  //     Loading...
  //     </h2>
  //     </div>
  // }
//  setLoading(false)
  return (
    <>
    <RouterProvider router={Router}/>
    <ToastContainer/>
    
    </>
  )
}

export default App
