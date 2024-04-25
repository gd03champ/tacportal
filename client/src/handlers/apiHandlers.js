import axios from 'axios';

const api = axios.create({
  //baseURL: process.env.baseURL || 'http://localhost:3001/api/',
  baseURL: process.env.baseURL || `${process.env.REACT_APP_API_URL}api/`,
});

const getTacs = async () => {

  const token = localStorage.getItem('accessToken');

  try {
    console.log(token);
    const res = await api.post('/getTacs', {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    throw err;
  }
};

const applyTac = async (
  title,
  description,
  domain,
  students,     //object of students (roll, techStack)
  documentLink,
) => {

  try {

    const token = localStorage.getItem('accessToken');

    const res = await api.post('/applyTac', {
      title,
      description,
      domain,
      students,
      documentLink
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log(res);
  } catch (err) {
    throw err
  }

}

const updateTac = async (tacUid, action, remarks) => {
  try {

    const token = localStorage.getItem('accessToken');

    const res = await api.post('/updateTac', {
      tacUid,
      action,
      remarks
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log(res);
  } catch (err) {
    throw err
  }
};

const bookAppointment = async (tacUid, appointmentDate, isEarlyAppointment) => {
  try {

    console.log("Recieved from dashboard to client api handler");

    const token = localStorage.getItem('accessToken');

    console.log("Making request to server to book appointment");
    const res = await api.post('/bookAppointment', {
      tacUid,
      appointmentDate,
      isEarlyAppointment
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log(res);

  } catch (err) {
    throw err
  }
}

const getAnalytics = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await api.post('/getAnalytics', {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    throw err;
  }
};

const getReviews = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await api.post('/getReviews', {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { getTacs, applyTac, updateTac, bookAppointment, getAnalytics, getReviews };