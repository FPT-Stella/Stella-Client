import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCurriculumById } from "../../services/Curriculum";
import { getProgramById } from "../../services/Program";
import { getPloByCurriculum } from "../../services/PO_PLO";
import { getSubjectInCurriculumByCurriID } from "../../services/Subject";
import { getSubjectByID } from "../../services/Subject";
import { Curriculum } from "../../models/Curriculum";
import { Program } from "../../models/Program";
import { PLO } from "../../models/PO_PLO";
import { Subject } from "../../models/Subject";
import { Link } from "react-router-dom";

function CurriculumDetailStudent() {
  const navigate = useNavigate();
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [plos, setPlos] = useState<PLO[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!curriculumId) return;

        setSubjectsLoading(true);
        // Get subject IDs in curriculum
        const subjectIds = await getSubjectInCurriculumByCurriID(curriculumId);

        // Fetch each subject's details
        const subjectPromises = subjectIds.map((item: Subject) =>
          getSubjectByID(item.id),
        );

        const subjectData = await Promise.all(subjectPromises);
        setSubjects(subjectData);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    if (!loading && curriculum) {
      fetchSubjects();
    }
  }, [curriculumId, loading, curriculum]);

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

  const subjectColumns: ColumnsType<Subject> = [
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: "15%",
      sorter: (a, b) => a.subjectCode.localeCompare(b.subjectCode),
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
      width: "40%",
      render: (text: string, record: Subject) => (
        <Link
          to={`/syllabus/${record.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Term",
      dataIndex: "termNo",
      key: "termNo",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.termNo - b.termNo,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: "10%",
      align: "center",
    },
    {
      title: "Prerequisite",
      dataIndex: "prerequisiteName",
      key: "prerequisiteName",
      width: "25%",
    },
  ];

  const handleViewPO = () => {
    if (program) {
      navigate(`/program/${program.id}/curriculum/${curriculumId}/outcomes`);
    }
  };
  const handleViewCombo = () => {
    if (program) {
      navigate(`/program/${program.id}/combos`);
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
          <Button
            type="primary"
            onClick={handleViewCombo}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            View Subject Combos
          </Button>
        </div>
      </div>

      {/* Subjects Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Curriculum Subjects
        </h2>

        <Table
          columns={subjectColumns}
          dataSource={subjects}
          rowKey="id"
          loading={subjectsLoading}
          pagination={{ pageSize: 10 }}
          className="border border-gray-200"
          size="middle"
        />
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
          }}
          className="border border-gray-200"
          size="large"
        />
      </div>
    </div>
  );
}

export default CurriculumDetailStudent;
