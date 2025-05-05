import { Link } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";

const createGoogleURL = () => {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
  const params = {
    client_id: import.meta.env.VITE_GCP_CLIENT_ID,
    redirect_uri: import.meta.env.MODE === 'development' 
      ? import.meta.env.VITE_GCP_REDIRECT_URI_DEV 
      : import.meta.env.VITE_GCP_REDIRECT_URI_PROD,
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
