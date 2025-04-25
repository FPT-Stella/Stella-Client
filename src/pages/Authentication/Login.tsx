import React, { useState } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaGoogle } from "react-icons/fa";

// Modify the login function to include majorId in return data
const login = (email: string, password: string) => {
  const users = [
    { email: "admin", password: "123", role: "Admin" },
    { email: "user1", password: "123", role: "Student", StudentId: "1", id: 1 },
    {
      email: "user2",
      password: "123",
      role: "Student",
      StudentId: null,
      id: 2,
    },
  ];

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    return {
      userDatas: {
        roleName: user.role,
        email: user.email,
        id: user.id,
        StudentId: user.StudentId,
      },
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

const createGoogleURL = () => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const params = {
    client_id: import.meta.env.VITE_GCP_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GCP_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline'
  }

  return `${baseUrl}?${new URLSearchParams(params)}`
}

const googleURL = createGoogleURL()

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = login(email, password);
      const userDatas = response?.userDatas;

      if (userDatas) {
        localStorage.setItem("userData", JSON.stringify(userDatas));

        switch (userDatas.roleName) {
          case "Student":
            if (userDatas.StudentId) {
              navigate(`/curriculum`);
            } else {
              navigate("/profile");
            }
            break;
          case "Admin":
            navigate("/dashboard");
            break;
          default:
            navigate("/login");
            break;
        }
      }
    } catch {
      setError("Sai tên người dùng hoặc mật khẩu!");
    }
  };

  const handleGoogleLogin = () => {
    navigate(googleURL)
  };

  return (
    <div className="flex w-full h-screen items-center justify-center"><Link to={googleURL}>Login with Google</Link></div>
  );
}

export default Login;
