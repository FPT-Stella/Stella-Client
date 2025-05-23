import { useEffect, useState } from "react";
import { getPOById } from "../../services/PO_PLO";
import { PO } from "../../models/PO_PLO";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin } from "antd";
import { Program } from "../../models/Program";
import { getProgramById } from "../../services/Program";
function DetailPO() {
  const { poId } = useParams<{ poId: string }>();
  const [po, setPO] = useState<PO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [program, setProgram] = useState<Program | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!poId) return;
        const POData = await getPOById(poId);
        setPO(POData);

        const programData = await getProgramById(POData.programId);
        setProgram(programData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poId]);
  const handleBack = () => {
    navigate(`/ProgramOutcomes`);
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }

  if (!po) {
    return <div>Curriculum not found</div>;
  }
  return (
    <div className=" flex flex-col px-10 py-5">
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span className="text-gray-500 cursor-pointer " onClick={handleBack}>
          Manage Program Outcomes /
        </span>
        <span className="text-[#2A384D]"> {po?.poName} </span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-10 ">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          Program Outcome: {po.poName}
        </h2>
        <div>
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Program Outcome ID :
                </td>
                <td className="py-3.5 border border-gray-200 px-4">{po.id}</td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Program Outcome Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {po.poName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Program Outcome Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {program?.programCode}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Program Outcome Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {po.description}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h4 className="text-center text-lg font-medium">
            List Program Learning Outcomes
          </h4>
          <Button>+ Add PLO</Button>
        </div>
      </div>
    </div>
  );
}

export default DetailPO;
