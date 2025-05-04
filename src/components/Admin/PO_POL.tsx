import React, { useEffect, useState } from "react";
import { getMappingPLO, updateMappingPLO } from "../../services/PO_PLO";
import { MappingPLO, PO, PoPloMapping } from "../../models/PO_PLO";
import { RiEdit2Fill } from "react-icons/ri";
import { getCurriculumById } from "../../services/Curriculum";
import { useParams } from "react-router-dom";
import { getPOByProgramId } from "../../services/PO_PLO";
import { Modal, Checkbox } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface POMappingListProps {
  ploId: string;
}

const POMappingList: React.FC<POMappingListProps> = ({ ploId }) => {
  const [mapping, setMapping] = useState<MappingPLO[]>([]);
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [pos, setPos] = useState<PO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPOIds, setSelectedPOIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const curriculumData = await getCurriculumById(curriculumId!);

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

  const handleOk = async () => {
    try {
      const data: PoPloMapping = {
        ploId: ploId,
        poIds: selectedPOIds,
      };

      await updateMappingPLO(data);
      const updatedMapping = await getMappingPLO(ploId);
      setMapping(updatedMapping);

      toast.success(" Update PLO sucsses!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Fail update PLO:", error);
      toast.error(" Fail update PLO!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-between items-center">
      <ToastContainer />
      <div className="flex-1 mr-3.5">
        {mapping.length > 0 ? mapping.map((po) => po.name).join(", ") : "_ _"}
      </div>
      <div>
        <button
          onClick={handleEditClick}
          className="text-blue-600 hover:text-blue-800"
        >
          <RiEdit2Fill />
        </button>
      </div>

      <Modal
        title="Edit PO Mapping"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <div className="flex justify-end gap-2.5">
            <button
              key="clear"
              onClick={() => setSelectedPOIds([])}
              className="bg-green-600 hover:bg-gray-300 text-white px-4 py-1 rounded"
            >
              Reset
            </button>

            <button
              key="cancel"
              onClick={handleCancel}
              className="bg-red-600 border border-gray-300 hover:bg-gray-100 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>

            <button
              key="submit"
              onClick={handleOk}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>,
        ]}
        width={"68%"}
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
