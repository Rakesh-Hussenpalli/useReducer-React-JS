import React, { useState, useEffect, useReducer } from 'react';
import './index.css';

const HooksDemo = () => {

    const fetchUsersData = async (url) => {
        dispatch({ type: "IS_LOADING", payload: true })
        dispatch({ type: "IS_ERROR", payload: { status: false, msg: '' } })
        try {
            const response = await fetch(url);
            const data = await response.json();
            dispatch({ type: "RETRIVE_USERS_DATA", payload: data })
            dispatch({ type: "IS_LOADING", payload: false })
            const getLength = Object.keys(data)
            if (getLength.length === 0) {
                throw new Error("Data not Found")
            }

        }
        catch (error) {
            dispatch({ type: "IS_LOADING", payload: false })
            dispatch({ type: "IS_ERROR", payload: { status: true, msg: error.message || 'Something went wrong' } })

        }
    }

    useEffect(() => {
        const url = "https://jsonplaceholder.typicode.com/users"
        fetchUsersData(url)
    }, [])

    const initialState = {
        usersData: [],
        isLoading: false,
        isError: { status: false, msg: '' },
        isEditing: { status: false, id: '', name: '', email: '' }
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case "RETRIVE_USERS_DATA":
                return {
                    ...state,
                    usersData: action.payload
                }
            case "IS_LOADING":
                return {
                    ...state,
                    isLoading: action.payload
                }
            case "IS_ERROR":
                return {
                    ...state,
                    isError: { status: action.payload.status, msg: action.payload.msg }
                }
            case "CLICK_DELETE":
                const filteredUsers = state.usersData.filter((eachUser) => {
                    return eachUser.id !== action.payload
                })
                return {
                    ...state,
                    usersData: filteredUsers
                }
            default:
                return state

        }
    }

    const onClickDelete = (id) => {
        dispatch({
            type: "CLICK_DELETE",
            payload: id
        })
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    if (state.isLoading) {
        return (
            <h2>Loading...</h2>
        )
    }
    if (state?.isError?.status) {
        return (
            <h2>{state.isError.msg}</h2>
        )
    }
    if (state.usersData.length === 0) {
        return (
            <h2>Refresh page</h2>
        )
    }
    return (
        <div>
            <h2>Users Information</h2>
            <div className="users-data-container">
                {
                    state.usersData.map((eachUser) => {
                        const { id, name, email } = eachUser;
                        return (
                            <div className="users-data" key={id}>
                                <h3>{name}</h3>
                                <p>{email}</p>
                                <button type="button">Edit</button>
                                <button type="button" onClick={() => onClickDelete(id)}>Delete</button>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )

}

export default HooksDemo