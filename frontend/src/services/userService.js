import { api, requestConfig } from '../utils/config.js';

// Get user details
const profile = async (data, token) => {
    const config = requestConfig('GET', data, token);

    try {

        const res = await fetch(`${api}/users/profile`, config)
            .then((res) => res.json())
            .catch((err) => err)

        return res;
        
    } catch (error) {
        
        console.log(error);

    }
}

// Update user details
const updateProfile = async (data, token) => {
    
    const config = requestConfig('PUT', data, token, true);

    try {

        const res = await fetch(`${api}/users/`, config)
            .then((res) => res.json())
            .catch((err) => err)

        return res;
        
    } catch (error) {

        console.log(error);
        
    }
}

// Get user details
const getUserDetails = async (id) => {

    const config = requestConfig('GET');

    try {
        
        const res = await fetch(`${api}/users/${id}`, config)
            .then((res) => res.json())
            .catch((err) => err)

        return res;

    } catch (error) {
        console.log(error);
    }
}

// Delete user profile
const deleteUserProfile = async (token) => {

    const config = requestConfig('DELETE', null, token);

    try {
        
        const res = await fetch(`${api}/users/delete`, config)
            .then((res) => res.json())
            .catch((err) => err)

        return res;

    } catch (error) {
        console.log(error);
    }
}

const userService = {
    profile,
    updateProfile,
    getUserDetails,
    deleteUserProfile
}

export default userService;