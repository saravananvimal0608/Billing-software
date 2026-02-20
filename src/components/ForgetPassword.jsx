import React from 'react'
import { Link } from 'react-router-dom'
import '../css/ForgetPassword.css'

const ForgetPassword = () => {
    return (
        <div className='forget-password-container'>
            <div className='forget-password-card'>
                <div className='coming-soon-icon'>🔒</div>
                <h1 className='coming-soon-title'>Coming Soon</h1>
                <p className='coming-soon-text'>Password recovery feature will be available soon</p>
                <Link to={'/'} className='back-login-btn'>Back to Login</Link>
            </div>
        </div>
    )
}

export default ForgetPassword