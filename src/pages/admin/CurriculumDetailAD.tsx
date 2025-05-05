import { useEffect, useState } from "react";
import { Spin, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurriculumDetail from "./CurriculumDetail";
import { getCurriculumById } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";
import PLO from "../../components/Admin/PLO";
import SubjectInCurriculum from "../../components/Admin/SubjectInCurriculum";
function CurriculumDetailAD() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!curriculumId) {
          console.error("curriclumId ID is missing");
          return;
        }
        const data = await getCurriculumById(curriculumId);
        if (!data) {
          console.error("No data received from API");
          return;
        }
        setCurriculum(data);
      } catch (error) {
        console.error("Failed to fetch subject details:", error);
        toast.error("Failed to load subject details. Please try again later.");
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
        <Spin size="large" tip="Loading Subject details..." />
      </div>
    );
  }

  if (!curriculum) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="flex flex-col px-10 py-5">
      <ToastContainer />
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span
          className="text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={handleBack}
        >
          Curriculum Management /
        </span>
        <span className="text-[#2A384D]">{curriculum.curriculumCode}</span>
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
              label: "Subject Detail",
              children: <CurriculumDetail />,
            },
            {
              key: "2",
              label: "PLO",
              children: <PLO />,
            },
            {
              key: "3",
              label: "Subject In Curriculum",
              children: <SubjectInCurriculum />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default CurriculumDetailAD;
