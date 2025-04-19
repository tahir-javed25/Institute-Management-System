import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const StudentDetails = () => {
    const [student, setStudent] = useState([]);
    const [feeList, setFeeList] = useState([]);
    const [course, setCourse] = useState([]);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        getStudentDetails();
      }, []);
    
      const getStudentDetails = () => {
        axios
          .get("http://localhost:3000/student/student-details/"+params.id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            console.log(res.data);
            setStudent(res.data.studentResult);
            setFeeList(res.data.feeResult)
            setCourse(res.data.courseDetails)
          })
          .catch((error) => {
            // setLoading(false)
            // console.log(error)
            toast.error("Can't access the Student for Now.....");
          });
        }
  return (
    // The structure of Students Details is used that's why classNames are same as course details.
    <>
      <div className='course-detail-main-wraper'>
      <div className='course-detail'>
        <img className='course-detial-logo' src={student.stdImgUrl} alt="Student Picture" />
        <div className='course-info'>
          <h1>{student.fullName}</h1>
          <h2><b>Email:-</b> {student.email} </h2>
          <p><b>Phone:-</b> {student.phone} </p>
          <p><b>Address:-</b> {student.address} </p>
          <h3>Enrolled Courses:- {course.courseName} </h3>
        </div>

        <div className='course-btn'> 
        <button className='btn edit-btn' onClick={()=>{navigate("/dashboard/update-student/"+student._id, {state:{student}})}}>Edit</button>
        <button className='btn delete-btn'>Delete</button></div>
      </div>
      <div className='course-description'>
          <p><b>Payment History:- </b>  </p>
        </div>
    </div>    
    </>
    
  )
}

export default StudentDetails;
