import React, { useEffect, useState } from "react";
import { Button, Modal, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Subject } from "../../models/Subject";
import { getSubjectByID, deleteSubject } from "../../services/Subject";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subjectId) {
          console.error("Subject ID is missing");
          return;
        }
        const data = await getSubjectByID(subjectId);
        if (!data) {
          console.error("No data received from API");
          return;
        }
        setSubject(data);
      } catch (error) {
        console.error("Failed to fetch subject details:", error);
        toast.error("Failed to load subject details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);
  const success = () => {
    Modal.success({
      content: "Delete success",
    });
  };
  <Button onClick={success}>Success</Button>;
  const handleBack = () => {
    navigate(`/manageSubject`);
  };
  const handleDelete = async () => {
    try {
      toast.success("Subject deleted successfully!");
      await deleteSubject(subjectId!);

      setIsDeleteModalVisible(false);

      setTimeout(() => {
        navigate(`/manageSubject`);
      }, 1800);
    } catch (error) {
      console.error("Failed to delete Subject:", error);
      toast.error("Failed to delete Subject.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading Subject details..." />
      </div>
    );
  }

  if (!subject) {
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
          Subject Management /
        </span>
        <span className="text-[#2A384D]">{subject.subjectCode}</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-10">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          View Subject: {subject.subjectCode}
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
                  Subject Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {JSON.parse(subject.subjectDescription)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(subject.subjectDescription).split("\n")
                            .length -
                            1 && <br />}
                      </React.Fragment>
                    ))}
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
                  Syllabus Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {JSON.parse(subject.sysllabusDescription)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(subject.sysllabusDescription).split("\n")
                            .length -
                            1 && <br />}
                      </React.Fragment>
                    ))}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Student Tasks:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {JSON.parse(subject.sysllabusDescription)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(subject.studentTask).split("\n").length -
                            1 && <br />}
                      </React.Fragment>
                    ))}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Topics:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {JSON.parse(subject.topic)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(subject.topic).split("\n").length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Notes:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {JSON.parse(subject.note)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(subject.note).split("\n").length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  TermNo:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.termNo}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Learning Teaching Type
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {subject.learningTeachingType
                    ? "At School"
                    : "Online meeting"}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Create Date:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {new Date(subject.insDate).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Update Date:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {new Date(subject.updDate).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-5 mt-8">
          <Button
            className="bg-blue-500 font-medium text-white"
            onClick={() => navigate(`/manageSubject/update/${subjectId}`)}
          >
            Edit
          </Button>
          <Button
            className="bg-red-500 font-medium text-white"
            onClick={showDeleteModal}
          >
            Delete
          </Button>
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={handleBack}
          >
            Back Subject Management
          </Button>
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the Subject?</p>
      </Modal>
    </div>
  );
}

export default SubjectDetail;
