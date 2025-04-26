import React, { useState, useEffect } from "react";
import { PiStarFourFill } from "react-icons/pi";
import { getProgramsByMajor } from "../../services/Program";
import { Program } from "../../models/Program";

function Curriculum() {
  const studentInfo = {
    id: "929c9879-8f7d-4658-ba22-f63d4737945f",
    userId: "2ac1c89b-1667-481c-b8ea-d69350e023b3",
    majorId: "3e50ecf9-aa53-4ba8-8e2c-0ae0143145b4",
    studentCode: "SE171117",
    phone: "0902982731",
    address:
      "273 Nguyễn Văn Lượng, phường 21, Quận Gò Vấp, Thành phố Hồ Chí Minh",
  };

  const [program, setProgram] = useState<Program>({} as Program);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getProgramsByMajor(studentInfo.majorId);

        setProgram(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [studentInfo.majorId]);

  return (
    <div className="my-12 mx-10">
      <div className="text-4xl font-semibold text-center mb-5">Curriculum</div>
      <div>
        <div className="text-2xl font-semibold mb-5">Program of you:</div>
        <table className="min-w-full border border-gray-200">
          <tbody>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                Program Code :
              </td>
              <td className="py-3.5 border border-gray-200 px-4">
                {program.programCode}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                Curriculum Name:
              </td>
              <td className="py-3.5 border border-gray-200 px-4 ">
                {program.programName}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                Description:
              </td>
              <td className="py-3.5 border border-gray-200 px-4">
                {program.description}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Curriculum;
