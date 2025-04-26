import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PiStarFourFill } from "react-icons/pi";

const GoogleCallback = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const navigate = useNavigate();

  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      navigate("/login", { replace: true });
    }
    const exchangeCode = async () => {
      try {
        const { data } = await axios.post<{
          accessToken: string;
          refreshToken: string;
          username: string;
          email: string;
          role: string;
        }>("https://stella.dacoban.studio/api/Auth/oauth/google", {
          code,
        });

        if (data.accessToken && data.refreshToken) {
          localStorage.setItem("userData", JSON.stringify(data));
          navigate("/profile", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error(error);
      }
    };
    exchangeCode();
  }, [code]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black bg-opacity-10">
      <p className="text-7xl text-blue-400 flex flex-col justify-center items-center">
        <PiStarFourFill className="animate-spin [animation-duration:3s]" />
      </p>
    </div>
  );
};

export default GoogleCallback;
