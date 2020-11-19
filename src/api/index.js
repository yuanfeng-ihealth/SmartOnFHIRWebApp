import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:4000/api',
    // baseURL: 'http://192.81.133.207:8080/fhir/',
    // withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        'Accept': 'application/fhir+json'
    }
})

// export const insertMeasurement = payload => api.post(`/measurement`, payload)
// export const getAllMeasurements = () => api.get(`/measurements`)
// export const createUser = payload => api.post(`/user`, payload)
// export const getUser = (ehr_id) => api.get(`/user/${ehr_id}`)

export const insertMeasurement = payload => api.post(`/Observation`, payload)
export const getAllMeasurements = () => api.get(`/Observation`)
export const createPatient = payload => api.post(`/Patient`, payload)
export const getPatient = (ehr_id) => api.get(`/Patient/${ehr_id}`)

const apis = {
    insertMeasurement,
    getAllMeasurements,
    createPatient,
    getPatient
}

export default apis