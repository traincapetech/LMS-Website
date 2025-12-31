import React from 'react'

const Signup1 = () => {
    const { isRightPanelActive, setIsRightPanelActive } = useStore();
     const handleSignInClick = () => {
       setIsRightPanelActive(false);
     };
  return (
    <div className="flex justify-center items-center h-screen w-full font-poppins">
      <div
        className={`container-loginform  ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        <div className="form-container sign-up-container">
          <form className="loginform" action="#">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span className="py-2 text-sm">
              or use your email for registration
            </span>
            <input className="logininput" type="text" placeholder="Name" />
            <input className="logininput" type="email" placeholder="Email" />
            <input
              className="logininput"
              type="password"
              placeholder="Password"
            />
            <Button className="w-full">Sign Up</Button>
          </form>
        </div>
       
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left space-y-5">
              <h1 className="font-bold text-4xl ">Welcome Back!</h1>
              <p className="font-inter text-sm px-3 text-white">
                To keep connected with us please login with your personal info
              </p>
              <Button
                className="bg-transparent border rounded-full px-10 py-5 hover:bg-transparent mt-4"
                id="signIn"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup1