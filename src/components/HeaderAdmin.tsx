import logo from "../assets/logo.jpg";
function HeaderAdmin() {
  return (
    <div className="bg-white w-full h-full ">
      <div className="w-1/6 h-full flex gap-2 items-center px-6 pt-2">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <div className="text-[#635BFF] h-full text-2xl font-bold italic flex justify-center items-center">
          Stella FPT
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
