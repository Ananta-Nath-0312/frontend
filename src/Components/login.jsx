import {React,useState} from 'react'
import {useNavigate, Link} from "react-router-dom";
import Cookies from 'universal-cookie';
import "./CSSstyles/login.css";
import logo from '../Images/logo.png'
// import Headerl from "./Headerl";
import bgimage from "../Images/bgi.jpg"

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();  //needed to parse cookies

  const addCookies = (accessToken)=>{
    cookies.set("accessToken",accessToken,{ path: '/' })//path : '/' means cookie can be accessible everywhere in the app
  }

  const getAccessToken = (configObject)=>{
    return new Promise((resolve,reject)=>{
      fetch(configObject.url,{
        method:configObject.method?configObject.method:'GET',
        body:configObject.body?JSON.stringify(configObject.body):null,
        headers:configObject.headers?configObject.headers:{},
      }).then((response)=>resolve(response.json()))
    })
  }

  const APICall = (configObject)=>{
    return new Promise((resolve,reject)=>{
      fetch(configObject.url,{
        method:configObject.method?configObject.method:'GET',
        body:configObject.body?JSON.stringify(configObject.body):null,
        headers:configObject.headers?configObject.headers:{},
      }).then((response)=>resolve(response.json()))
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const objectBody = {
      email,password
    }
    const token = cookies.get("accessToken"); // to get token already present.If there is token ,login page should not be rendered
    const configObject = {
      url:"http://localhost:8081/user/login",
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization': token},
      body:objectBody
    }
    const responseData = await getAccessToken(configObject)
    if(responseData["access-token"]){
      console.log(responseData)
      const accessToken = responseData['access-token']
      addCookies(accessToken)
      //navigating after successful login
      // http://localhost:8081/user
      const configObject1 = {
        url:"http://localhost:8081/user",
        method:'GET',
        headers:{'Content-Type':'application/json','Authorization': accessToken},
        // body:objectBody
      }

      var loggedUser = await APICall(configObject1)
      console.log(loggedUser)
      if(loggedUser.data.role=="TEAM LEAD"){
        navigate("/teamleadhome")
        return
      }else if(loggedUser.data.role=="GRASSROOT"){
        navigate("/grassDashboard")
        return
      }else if(loggedUser.data.role=="OPERATION"){
        navigate('/operationshome');
        return
      } 
    }else{
      alert("Invalid credentials")
    }
  }
  return (
    <div className='bgi' style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
      {/* <Headerl/> */}
      <header className="App-header1">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
        />
      </header>

      <div className='login-inner'>
      <form onSubmit={handleSubmit} className="box">
        <h2 className='headinglogin'>Login</h2>
        <div className="row">
        <div className="column"> 
        <div className="form-group">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        </div>
        </div>
        <button type="submit" className='login-sub'>Login</button>
      </form>
      <p >
                If you do not have an account, {" "}
                <Link to="/register">Register here</Link>.
              </p>
</div>
    </div>
  );
}

export default Login;
