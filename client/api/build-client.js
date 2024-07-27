import axios from "axios";

export default ({ req }) => {
  // we are on the server
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  // we are on the client
  } else {
    return axios.create({
      baseURL: '/'
    });
  }
}
