import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { getMe } from "../../services/user";
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

          const student = await getMe(data.accessToken);
          const majorId = student?.majorId;

          if (majorId) {
            localStorage.setItem("majorId", majorId);

            if (majorId === "00000000-0000-0000-0000-000000000000") {
              navigate("/profile", { replace: true });
            } else {
              navigate("/curriculum", { replace: true });
            }
          } else {
            navigate("/profile", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error(error);
      }
    };
    exchangeCode();
  }, [code, navigate]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black bg-opacity-10">
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum data..." />
      </div>
    </div>
  );
};

export default GoogleCallback;
