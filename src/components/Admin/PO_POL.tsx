import React, { useEffect, useState } from "react";
import { getMappingPLO } from "../../services/PO_PLO";
import { MappingPLO, PO } from "../../models/PO_PLO";
import { RiEdit2Fill } from "react-icons/ri";
import { getCurriculumById } from "../../services/Curriculum";
import { useParams } from "react-router-dom";
import { Curriculum } from "../../models/Curriculum";
import { getPOByProgramId } from "../../services/PO_PLO";
import { Modal, Checkbox } from "antd";

interface POMappingListProps {
  ploId: string;
}

const POMappingList: React.FC<POMappingListProps> = ({ ploId }) => {
  const [mapping, setMapping] = useState<MappingPLO[]>([]);
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [pos, setPos] = useState<PO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPOIds, setSelectedPOIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const curriculumData = await getCurriculumById(curriculumId!);
        setCurriculum(curriculumData);

        const poData = await getPOByProgramId(curriculumData.programId);
        setPos(poData);

        const mappingData = await getMappingPLO(ploId);
        setMapping(mappingData);

        // Gán trước các PO đã mapping (nếu có)
        setSelectedPOIds(mappingData.map((po) => po.id));
      } catch (error) {
        console.error("Failed to fetch PO mapping:", error);
      }
    };

    fetchMapping();
  }, [ploId, curriculumId]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("Selected PO IDs:", selectedPOIds);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (checkedValues: any) => {
    setSelectedPOIds(checkedValues);
  };

  return (
    <div className="flex justify-between gap-5 items-center">
      <span>
        {mapping.length > 0 ? mapping.map((po) => po.name).join(", ") : "_ _"}
      </span>
      <div>
        <button
          onClick={handleEditClick}
          className="text-blue-600 hover:text-blue-800"
        >
          <RiEdit2Fill />
        </button>
      </div>

      {/* Modal hiện tất cả PO */}
      <Modal
        title="Edit PO Mapping"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        width={"60%"}
      >
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">
                Select
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                PO Name
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po) => (
              <tr key={po.id}>
                <td className="border border-gray-200 px-4 py-2">
                  <Checkbox
                    checked={selectedPOIds.includes(po.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setSelectedPOIds((prev) => [...prev, po.id]);
                      } else {
                        setSelectedPOIds((prev) =>
                          prev.filter((id) => id !== po.id)
                        );
                      }
                    }}
                  />
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {po.poName}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {po.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default POMappingList;
