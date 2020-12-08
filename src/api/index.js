import axios from 'axios'

const api = axios.create({
    // baseURL: "http://dev-smilecdr-alb-1293625517.us-west-2.elb.amazonaws.com:31001",
    // // baseURL: 'http://192.81.133.207:8080/fhir/',
    // withCredentials: false,
    headers: {
        // 'Authorization': 'Basic' + process.env.REACT_APP_FHIR_CREDENTIALS,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        'Accept': 'application/fhir+json'
    }
})

export const insertMeasurement = payload => api.post(`/Observation`, payload)
export const getAllMeasurements = () => api.get(`/Observation`)
export const createPatient = payload => api.post(`/Patient`, payload)
export const getPatient = (ehr_id) => api.get(`/Patient/${ehr_id}`)
export const getPatients = () => api.get(`/Patient`, {
    auth: { username: process.env.REACT_APP_FHIR_USERNAME, password: process.env.REACT_APP_FHIR_PASSWORD }
});

const apis = {
    insertMeasurement,
    getAllMeasurements,
    createPatient,
    getPatient,
    getPatients
}

export default apis