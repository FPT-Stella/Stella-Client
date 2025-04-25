import React from "react";
import { Link } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";

const createGoogleURL = () => {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id: import.meta.env.VITE_GCP_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GCP_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };

  return `${baseUrl}?${new URLSearchParams(params)}`;
};

const googleURL = createGoogleURL();
function LoginStudent() {
  return (
    <div className="mt-24">
      <button className="w-full bg-[#5B62E6] hover:bg-[#5b62e64f] text-white font-semibold py-3 rounded-lg transition">
        <Link to={googleURL}>
          <div className="flex justify-center items-center gap-2">
            <GrGoogle />
            Login with Google
          </div>
        </Link>
      </button>
    </div>
  );
}

export default LoginStudent;

// import React, { useState } from "react";

// import bg from "../../assets/bg.png";
// import logo from "../../assets/logo.jpg";

// import { BsStars } from "react-icons/bs";
// import LoginAdmin from "./LoginAdmin";
// import LoginStudent from "./LoginStudent";
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
// function Login() {
//   // const [email, setEmail] = useState<string>("");
//   // const [password, setPassword] = useState<string>("");
//   // const [error, setError] = useState<string | null>(null);
//   // const navigate = useNavigate();

//   // Update the handleSubmit function
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError(null);
//   //   try {
//   //     const response = login(email, password);
//   //     const userDatas = response?.userDatas;

//   //     if (userDatas) {
//   //       localStorage.setItem("userData", JSON.stringify(userDatas));

//   //       switch (userDatas.roleName) {
//   //         case "Student":
//   //           if (userDatas.StudentId) {
//   //             navigate(`/curriculum`);
//   //           } else {
//   //             navigate("/profile");
//   //           }
//   //           break;
//   //         case "Admin":
//   //           navigate("/dashboard");
//   //           break;
//   //         default:
//   //           navigate("/login");
//   //           break;
//   //       }
//   //     }
//   //   } catch {
//   //     setError("Sai tên người dùng hoặc mật khẩu!");
//   //   }
//   // };

//   // const handleGoogleLogin = () => {
//   //   navigate(googleURL);
//   // };
//   const [isAdmin, setIsAdmin] = useState(false);

//   return (
//     <div className="flex w-full h-screen items-center pl-10 pr-32 justify-between  bg-gradient-to-tr from-[#8c92e9] to-[#A4E4F2]">
//       <div className="w-[65%] flex justify-center flex-col ">
//         <div className="w-[80%] flex ml-10 mx-auto">
//           <p className="text-6xl text-yellow-300">
//             <BsStars />
//           </p>
//           <p className=" font-sans text-5xl text-white font-semibold  border-r-2 border-white whitespace-nowrap overflow-hidden w-[28ch] animate-typing">
//             WELCOME TO <strong>STELLA FPT</strong> !!!
//           </p>
//         </div>
//         <img src={bg} className="w-[80%] animate-zoom" />
//       </div>
//       <div className="bg-white w-[35%] h-[75%] rounded-lg shadow-lg px-10 py-10 flex flex-col justify-between">
//         <div>
//           <div className=" mb-10">
//             <div className=" flex items-center justify-center px-6 ">
//               <img src={logo} alt="logo" className="w-16 h-16" />
//             </div>
//             <div className="font-sans font-bold text-center text-4xl mt-4  w-fit mx-auto pb-2 px-5">
//               Login account
//             </div>
//           </div>
//           <div>{isAdmin ? <LoginAdmin /> : <LoginStudent />}</div>
//         </div>
//         <div
//           className="text-center text-sm font-medium text-[#635BFF] cursor-pointer hover:underline"
//           onClick={() => setIsAdmin(!isAdmin)}
//         >
//           {isAdmin
//             ? "Bạn muốn đăng nhập là student?"
//             : "Bạn muốn đăng nhập là quản lý?"}
//         </div>
//         <button className="w-full">
//           <Link to={googleURL}>Login with Google</Link>
//         </button>
//         <div className="text-[#635BFF] text-center text-sm font-medium">
//           Support you in learning
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
