import axios from "axios"

export const getUserName = async (userId) => {
    const response = await axios.get('/user?user_id=' + userId, {    
    })
    return response.data[0].name
}

export const getUserPermit = async (userId) => {
    const response = await axios.get('/user?user_id=' + userId, {    
    })
    return response.data[0]?.permit
}

export const getProject = async(projectId) => {
    const response = await axios.get('/project?project_id=' + projectId, {    
    })
    return response.data[0]
}