import React, {Component} from 'react';
import './Navigation.css';
import imageLogo from '../../images/imageLogo.png';
import { NavLink } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

class Navigation extends Component {
	constructor(props) {
    super(props);
    this.state = {
      menu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(){
    this.setState({ menu: !this.state.menu })
  }
  render() {
	const show = (this.state.menu) ? "show" : "" ;
    return (

      <nav class="navbar navbar-expand-sm navbar-light" > 
		<a class="navbar-brand">
			<NavLink to="/" >
			   <img src={imageLogo} alt = "Logo" className="fixed_img"/>
			</NavLink>
		</a>
		  <button class="navbar-toggler" type="button" onClick={ this.toggleMenu }>
			<span class="navbar-toggler-icon"></span>
		   </button>

		  <div class={"collapse navbar-collapse " + show} >
		  </div>
		  
			<form class="form-inline my-2 my-lg-0" >
			<GoogleLogin
				clientId="779203911044-dtcm94n9lukj7d50nqfhchoqre4511k9.apps.googleusercontent.com"
				buttonText="Login"
				cookiePolicy={'single_host_origin'}
			/>
			  {/* <button class="btn btn-outline-info my-2 my-sm-0 mr-1" type="submit" >
			  <NavLink to="/login">Login</NavLink>
			  </button>
			  <button class="btn btn-outline-info my-2 my-sm-0" type="submit">
			  <NavLink to="/signup">Signup</NavLink>
			  </button> */}
		   </form>
	   </nav>
    );
}
}
 
export default Navigation;

/*
import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
		  <button class="btn btn-outline-success my-2 my-sm-0 mr-2" type="submit">
			<NavLink to="/login">Login</NavLink>
		  </button>
		  
		  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
			<NavLink to="/signup">Signup</NavLink>
		  </button>
       </div>
    );
}
 
export default Navigation;*/