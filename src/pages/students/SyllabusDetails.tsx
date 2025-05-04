import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Table } from "antd";
import { getSubjectByID } from "../../services/Subject";
import { Subject } from "../../models/Subject";
import { getCLOBySubjectId } from "../../services/CLO";
import { CLO } from "../../models/CLO";

function SyllabusDetails() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [clos, setCLOs] = useState<CLO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [closLoading, setCLOsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        if (!subjectId) {
          console.error("Subject ID is missing");
          return;
        }
        const data = await getSubjectByID(subjectId);
        setSubject(data);
      } catch (error) {
        console.error("Failed to fetch subject details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCLOs = async () => {
      try {
        if (!subjectId) {
          console.error("Subject ID is missing");
          return;
        }
        const data = await getCLOBySubjectId(subjectId);
        setCLOs(data);
      } catch (error) {
        console.error("Failed to fetch CLOs:", error);
      } finally {
        setCLOsLoading(false);
      }
    };

    fetchSubjectDetails();
    fetchCLOs();
  }, [subjectId]);

  const handleBack = () => {
    navigate("/syllabus");
  };

  // Function to format CLO ID (e.g., CLO1, CLO2, etc.)
  const formatCLOId = (_id: string, index: number) => {
    return `CLO${index + 1}`;
  };

  // Function to render JSON content with line breaks
  const renderJsonContent = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      return (
        <div>
          {parsedContent.split("\n").map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              {index !== parsedContent.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    } catch (e) {
      return <div>{content}</div>;
    }
  };

  // CLO table columns
  const cloColumns = [
    {
      title: "CLO ID",
      key: "cloId",
      width: "20%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (_: any, _record: any, index: number) => (
        <div className="font-medium">{formatCLOId(_record.id, index)}</div>
      ),
    },
    {
      title: "Description",
      dataIndex: "details",
      key: "description",
      width: "80%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading syllabus details..." />
      </div>
    );
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="flex flex-col px-10 py-5">
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span
          className="text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={handleBack}
        >
          Syllabus Management /
        </span>
        <span className="text-[#2A384D]">{subject.subjectCode}</span>
      </div>
      <div className="flex-1 bg-white  rounded-md py-5 px-10">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          Syllabus: {subject.subjectCode} - {subject.subjectName}
        </h2>

        <div className="mt-5">
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Subject Code:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.subjectCode}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Subject Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.subjectName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Credits:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.credits}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Prerequisite:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.prerequisiteName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Degree Level:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.degreeLevel}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Time Allocation:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.timeAllocation}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Scoring Scale:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.scoringScale}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Min Average Mark to Pass:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.minAvgMarkToPass}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Subject Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {renderJsonContent(subject.subjectDescription)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Syllabus Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {renderJsonContent(subject.sysllabusDescription)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Student Tasks:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {renderJsonContent(subject.studentTask)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Topics:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {renderJsonContent(subject.topic)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Notes:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {renderJsonContent(subject.note)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Learning Teaching Type:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.learningTeachingType
                    ? "At School"
                    : "Online meeting"}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Term Number:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.termNo}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Created Date:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {new Date(subject.insDate).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CLO Table Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Course Learning Outcomes (CLOs)
          </h3>

          {closLoading ? (
            <div className="flex justify-center items-center h-20">
              <Spin size="small" tip="Loading CLOs..." />
            </div>
          ) : (
            <Table
              columns={cloColumns}
              dataSource={clos}
              rowKey="id"
              pagination={false}
              className="border border-gray-200"
              locale={{ emptyText: "No CLOs found for this subject" }}
            />
          )}
        </div>
        <div className="flex justify-end mt-8">
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={handleBack}
          >
            Back to Syllabus
          </Button>
        </div>
      </div>
    </div>
  );
}
export default SyllabusDetails;
