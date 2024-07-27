import { useState } from "react"
import { useRouter } from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password } ,
    onSuccess: () => router.push('/')
  });

  const signup = async event => {
    event.preventDefault();

    doRequest();
  }

  return(
    <form onSubmit={signup}>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email" 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password" 
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}