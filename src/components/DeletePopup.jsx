import React from 'react'
import { IoMdClose } from "react-icons/io";
import '../css/Popup.css';

const DeletePopup = ({ setTogglePopup, name, handleDelete }) => {

    return (
        <div className='popup-overlay'>
            <div className='popup-box'>
                <div className='popup-header'>
                    <h4>Delete Modal</h4>
                    <IoMdClose size={28} className='close-icon' onClick={() => setTogglePopup(false)} />
                </div>
                <div className='popup-body'>
                    <p>Are you sure you want to delete this {name}?</p>
                    <div className='popup-footer'>
                        <button className='btn-cancel' onClick={() => setTogglePopup(false)}>Cancel</button>
                        <button className='btn-delete' onClick={handleDelete}>Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DeletePopup