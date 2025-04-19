import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseDetails = () => {
    const params = useParams();
    const [course, setCourse] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
      getCourseDetails();
    }, []);
  
    const getCourseDetails = () => {
      axios
        .get("http://localhost:3000/course/course-detail/"+params.id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res.data.studentsList);
          setCourse(res.data.course);
          setStudentList(res.data.studentsList)
        })
        .catch((error) => {
          // setLoading(false)
          // console.log(error)
          toast.error("Can't access the Courses for Now.....");
        });
    };
  return (
    <div className='course-detail-main-wraper'>
      <div className='course-detail'>
        <img className='course-detial-logo' src={course.thumbNailUrl} alt="" />
        <div className='course-info'>
          <h1>{course.courseName}</h1>
          <h2><b>Price:-</b> {course.prise}</h2>
          <p><b>Start Date:-</b> {course.startDate}</p>
          <p><b>End Date:-</b> {course.endDate}</p>
        </div>


        <div className='course-btn'> 
        <button className='btn edit-btn' onClick={()=>{navigate("/dashboard/update-course/"+course._id, {state:{course}})}}>Edit</button>
        <button className='btn delete-btn'>Delete</button></div>
      </div>
      <div className='course-description'>
          <p><b>Description:- </b> {course.description} </p>
        </div>

        {studentList && studentList.length>0 && 

      <div className='student-list'>
        {/* here we can use the table as well instead of ul */}
        <ul className='student-ul'>
          {
            studentList.map(student=>{
              return(
                <li key={student._id} className='student-list-item' onClick={()=>{navigate("/dashboard/student-details/"+student._id)}}>
                  
                  <img src={student.stdImgUrl} alt="" width={"100px"}  />
                    <p>{student.fullName}</p>
                    <p>{student.email}</p>
                    <p>{student.phone}</p>
                    <p>{student.address}</p>
                </li>
              )
            })
          }
        </ul>
      </div>}

    </div>
  )
}

export default CourseDetails
