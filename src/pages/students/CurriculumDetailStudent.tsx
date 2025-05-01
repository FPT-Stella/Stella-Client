import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCurriculumById } from "../../services/Curriculum";
import { getProgramById } from "../../services/Program";
import { getPloByCurriculum } from "../../services/PO_PLO";
// import { DescriptionFormatter } from "../../components/Student/DescriptionFormatter";
import { Curriculum } from "../../models/Curriculum";
import { Program } from "../../models/Program";
import { PLO } from "../../models/PO_PLO";

/* const formatDescription = (description: string) => {
  // Split by common section delimiters like numbers followed by dot or parentheses
  const sections = description.split(/(?:\r?\n|\r)|(?:\d+[\)\.]\s+)/g);
  
  return sections
    .filter(section => section && section.trim()) // Remove empty sections
    .map((section, index) => {
      const trimmedSection = section.trim();
      
      // Check if the section looks like a header (ends with ':' or all caps)
      const isHeader = trimmedSection.endsWith(':') || 
                      (trimmedSection === trimmedSection.toUpperCase() && 
                       trimmedSection.length > 3);
      
      return (
        <div key={index} className={`
          ${isHeader ? 'font-semibold text-gray-800 mt-3 mb-2' : 'text-gray-600 mb-2 pl-4'}
        `}>
          {trimmedSection}
        </div>
      );
    });
}; */

function CurriculumDetailStudent() {
  const navigate = useNavigate();
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [plos, setPlos] = useState<PLO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!curriculumId) return;

        // Fetch curriculum data
        const curriculumData = await getCurriculumById(curriculumId);
        setCurriculum(curriculumData);

        // Fetch program data
        const programData = await getProgramById(curriculumData.programId);
        setProgram(programData);

        // Fetch PLO data
        const ploData = await getPloByCurriculum(curriculumId);
        setPlos(ploData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [curriculumId]);

  const ploColumns: ColumnsType<PLO> = [
    {
      title: "PLO Name",
      dataIndex: "ploName",
      key: "ploName",
      width: "30%",
      className: "font-medium",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "70%",
    },
  ];

  const handleViewPO = () => {
    if (program) {
      navigate(`/program/${program.id}/curriculum/${curriculumId}/outcomes`);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }

  if (!curriculum || !program) {
    return (
      <div className="text-center text-red-500 mt-8">Curriculum not found</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Curriculum Header */}
      <div className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Curriculum Details
      </div>

      {/* Curriculum Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
          {curriculum.curriculumCode} - {curriculum.curriculumName}
        </h2> */}

        <table className="min-w-full border border-gray-200">
          <tbody>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border">
                Curriculum Code
              </td>
              <td className="py-4 px-6 border">{curriculum.curriculumCode}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border">
                Program
              </td>
              <td className="py-4 px-6 border">
                {program.programCode} - {program.programName}
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border">
                Curriculum Name
              </td>
              <td className="py-4 px-6 border">{curriculum.curriculumName}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border align-top">
                Description
              </td>
              <td className="py-4 px-6 border">
                {JSON.parse(curriculum.description)
                  .split("\n")
                  .map((line: string, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      {index !==
                        JSON.parse(curriculum.description).split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border">
                Total Credits
              </td>
              <td className="py-4 px-6 border">{curriculum.totalCredit}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 bg-gray-50 font-medium w-48 border">
                Duration
              </td>
              <td className="py-4 px-6 border">
                {curriculum.startYear} - {curriculum.endYear}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            onClick={handleViewPO}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            View Program Outcomes
          </Button>
        </div>
      </div>

      {/* PLO Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Program Learning Outcomes (PLOs)
        </h2>

        <Table
          columns={ploColumns}
          dataSource={plos}
          rowKey="id"
          pagination={{
            pageSize: plos.length,
            // position: ["bottomCenter"],
            // showSizeChanger: true,
            /* showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} PLOs`, */
          }}
          className="border border-gray-200"
          size="large"
        />
      </div>
    </div>
  );
}

export default CurriculumDetailStudent;
