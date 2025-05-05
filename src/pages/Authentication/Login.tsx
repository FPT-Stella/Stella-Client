import { useState } from "react";

import bg from "../../assets/bg.png";
import logo from "../../assets/logo.jpg";

import { BsStars } from "react-icons/bs";
import LoginAdmin from "./LoginAdmin";
import LoginStudent from "./LoginStudent";
import { ToastContainer } from "react-toastify/unstyled";
// import { Link } from "react-router-dom";
// const createGoogleURL = () => {
//   const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

//   const params = {
//     client_id: import.meta.env.VITE_GCP_CLIENT_ID,
//     redirect_uri: import.meta.env.VITE_GCP_REDIRECT_URI,
//     response_type: "code",
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.email",
//       "https://www.googleapis.com/auth/userinfo.profile",
//     ].join(" "),
//     prompt: "consent",
//     access_type: "offline",
//   };

//   return `${baseUrl}?${new URLSearchParams(params)}`;
// };

// const googleURL = createGoogleURL();
function Login() {
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  // const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  // Update the handleSubmit function
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   try {
  //     const response = login(email, password);
  //     const userDatas = response?.userDatas;

  //     if (userDatas) {
  //       localStorage.setItem("userData", JSON.stringify(userDatas));

  //       switch (userDatas.roleName) {
  //         case "Student":
  //           if (userDatas.StudentId) {
  //             navigate(`/curriculum`);
  //           } else {
  //             navigate("/profile");
  //           }
  //           break;
  //         case "Admin":
  //           navigate("/dashboard");
  //           break;
  //         default:
  //           navigate("/login");
  //           break;
  //       }
  //     }
  //   } catch {
  //     setError("Sai tên người dùng hoặc mật khẩu!");
  //   }
  // };

  // const handleGoogleLogin = () => {
  //   navigate(googleURL);
  // };
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex w-full h-screen items-center pl-10 pr-32 justify-between  bg-gradient-to-tr from-[#8c92e9] to-[#A4E4F2]">
      <ToastContainer />
      <div className="w-[65%] flex justify-center flex-col ">
        <div className="w-[80%] flex ml-10 mx-auto">
          <p className="text-6xl text-yellow-300">
            <BsStars />
          </p>
          <p className=" font-sans text-5xl text-white font-semibold  border-r-2 border-white whitespace-nowrap overflow-hidden w-[28ch] animate-typing">
            WELCOME TO <strong>STELLA FPT</strong> !!!
          </p>
        </div>
        <img src={bg} className="w-[80%] animate-zoom" />
      </div>
      <div className="bg-white w-[35%] h-[70%] rounded-lg shadow-lg px-10 py-10 flex flex-col justify-between">
        <div>
          <div className=" mb-10">
            <div className=" flex items-center justify-center px-6 ">
              <img src={logo} alt="logo" className="w-16 h-16" />
            </div>
            <div className="font-sans font-bold flex text-center  gap-3 text-4xl mt-4  w-fit mx-auto pb-2 px-5">
              Login {isAdmin ? <p>Admin</p> : <p>Student</p>}
            </div>
          </div>
          <div>
            {isAdmin ? (
              <LoginAdmin key="admin" />
            ) : (
              <LoginStudent key="student" />
            )}
          </div>

          <div
            className="text-center flex gap-2 justify-center mx-auto mt-5 font-medium text-gray-400  cursor-pointer "
            onClick={() => setIsAdmin(!isAdmin)}
          >
            Do you want to log in as ?
            {isAdmin ? (
              <p className="text-[#635BFF] font-bold hover:underline">
                Student
              </p>
            ) : (
              <p className="text-[#635BFF] font-bold hover:underline pb-2">
                Admin
              </p>
            )}
          </div>
        </div>

        <div className="text-gray-500 text-center text-sm font-bold">
          Support you in learning
        </div>
      </div>
    </div>
  );
}

export default Login;
