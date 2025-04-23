import React, { useEffect, useState } from "react";
import { getCurriculumById } from "../../services/Curriculum";
import { getProgramById } from "../../services/Program";
import { Program } from "../../models/Program";
import { Curriculum } from "../../models/Curriculum";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin } from "antd";
function CurriculumDetail() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!curriculumId) return;
        const curriculumData = await getCurriculumById(curriculumId);
        setCurriculum(curriculumData);

        const programData = await getProgramById(curriculumData.programId);
        setProgram(programData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [curriculumId]);
  const handleBack = () => {
    navigate(`/manageCurriculum`);
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }

  if (!curriculum) {
    return <div>Curriculum not found</div>;
  }

  return (
    <div className=" flex flex-col px-10 py-5">
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span className="text-gray-500 cursor-pointer " onClick={handleBack}>
          Curriculum Management /
        </span>
        <span className="text-[#2A384D]"> {curriculum.curriculumCode} </span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-10 ">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          View Curriculum: {curriculum.curriculumCode}
        </h2>
        <div className="mt-5">
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Curriculum Code :
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {curriculum.curriculumCode}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Program Code :
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {program?.programCode || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Curriculum Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {curriculum.curriculumName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {curriculum.description}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Total Credit:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {curriculum.totalCredit}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Start Year:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {curriculum.startYear}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  End Year:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {curriculum.endYear}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-5 mt-8">
          <Button>Edit</Button>
          <Button>Delete</Button>
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={handleBack}
          >
            Back Curriculum Management{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CurriculumDetail;
