import { useEffect, useState } from "react";
import { Spin, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import PO from "../../components/Admin/PO";
import SubjectCombo from "../../components/Admin/SubjectCombo";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgramDetail from "./ProgramDetail";

import { Program } from "../../models/Program";
import { getProgramById } from "../../services/Program";
function SubjectDetailAD() {
  const { programId } = useParams<{ programId: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId) {
          console.error("Program ID is missing");
          return;
        }
        const data = await getProgramById(programId);
        if (!data) {
          console.error("No data received from API");
          return;
        }
        setProgram(data);
      } catch (error) {
        console.error("Failed to fetch program details:", error);
        toast.error("Failed to load Program details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const handleBack = () => {
    navigate(`/manageProgram`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading Subject details..." />
      </div>
    );
  }

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div className="flex flex-col px-10 py-5">
      <ToastContainer />
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span
          className="text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={handleBack}
        >
          Program Management /
        </span>
        <span className="text-[#2A384D]">{program.programCode}</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-10">
        {/* <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          View Subject: {subject.subjectCode}
        </h2> */}

        <Tabs
          defaultActiveKey="1"
          type="line"
          tabBarGutter={40}
          className="[&_.ant-tabs-tab-btn]:text-base [&_.ant-tabs-tab-btn]:font-semibold"
          items={[
            {
              key: "1",
              label: "Program Detail",
              children: <ProgramDetail />,
            },
            {
              key: "2",
              label: "PO",
              children: <PO />,
            },
            {
              key: "3",
              label: "Subject Combo",
              children: <SubjectCombo />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default SubjectDetailAD;
