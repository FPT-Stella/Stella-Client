import React, { useEffect, useState } from "react";
import { getMappingCLO, updateMappingCLO } from "../../services/CLO";
import { MappingCLO, CloPloMapping } from "../../models/CLO";
import { getAllPLO } from "../../services/PO_PLO";
import { RiEdit2Fill } from "react-icons/ri";
import { Modal, Checkbox } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PLO } from "../../models/PO_PLO";

interface CLOMappingListProps {
  cloId: string;
}

const CLOMappingList: React.FC<CLOMappingListProps> = ({ cloId }) => {
  const [mapping, setMapping] = useState<MappingCLO[]>([]);
  const [plos, setPlos] = useState<PLO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPLOIds, setSelectedPLOIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ploData = await getAllPLO();
        setPlos(ploData);

        const mappingData = await getMappingCLO(cloId);
        setMapping(mappingData);

        setSelectedPLOIds(mappingData.map((m) => m.id));
      } catch (error) {
        console.error("Fail load Mapping CLO:", error);
      }
    };

    fetchData();
  }, [cloId]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const data: CloPloMapping = {
        cloId: cloId,
        ploIds: selectedPLOIds,
      };

      await updateMappingCLO(data);
      const updated = await getMappingCLO(cloId);
      setMapping(updated);
      toast.success("Update CLO_PLO success!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Fair update:", error);
      toast.error("Fairl update!");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <ToastContainer />
      <div className="flex-1 mr-3.5">
        {mapping.length > 0 ? mapping.map((m) => m.ploName).join(", ") : "_ _"}
      </div>
      <button
        onClick={handleEditClick}
        className="text-blue-600 hover:text-blue-800"
      >
        <RiEdit2Fill />
      </button>

      <Modal
        title="Update Mapping CLO - PLO"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <div className="flex justify-end gap-2.5" key="footer">
            <button
              onClick={() => setSelectedPLOIds([])}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            >
              Reset
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              SaveSave
            </button>
          </div>,
        ]}
        width={"70%"}
        height={"80%"}
      >
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Select</th>
              <th className="border px-4 py-2 text-left">PLO Name</th>
              <th className="border px-4 py-2 text-left">Name Curriculum</th>
              <th className="border px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {plos.map((plo) => (
              <tr key={plo.id}>
                <td className="border px-4 py-2">
                  <Checkbox
                    checked={selectedPLOIds.includes(plo.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPLOIds((prev) => [...prev, plo.id]);
                      } else {
                        setSelectedPLOIds((prev) =>
                          prev.filter((id) => id !== plo.id)
                        );
                      }
                    }}
                  />
                </td>
                <td className="border px-4 py-2">{plo.ploName}</td>
                <td className="border px-4 py-2">{plo.curriculumCode}</td>
                <td className="border px-4 py-2">{plo.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default CLOMappingList;
