import { useEffect, useState } from "react";
import { Button, Modal, Table, Checkbox, Input } from "antd";
import {
  getToolBySubjectId,
  getTool,
  updateSubjectTool,
} from "../../services/Tool";
import { MappingBySubject, CreateMappingTool, Tool } from "../../models/Tool";
import { useParams } from "react-router-dom";

function MappingTool() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [mappedTools, setMappedTools] = useState<MappingBySubject[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredMappedTools, setFilteredMappedTools] = useState<
    MappingBySubject[]
  >([]);
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  useEffect(() => {
    const fetchData = async () => {
      const allTools = await getTool();
      setTools(allTools);
      const mapped = await getToolBySubjectId(subjectId!);
      setMappedTools(mapped);
      setFilteredMappedTools(mapped);
      setSelectedToolIds(mapped.map((item: Tool) => item.id));
    };

    fetchData();
  }, [subjectId]);

  const handleOk = async () => {
    const payload: CreateMappingTool = {
      subjectId: subjectId!,
      toolIds: selectedToolIds,
    };
    await updateSubjectTool(subjectId!, payload);
    setIsModalOpen(false);
    const mapped = await getToolBySubjectId(subjectId!);
    setMappedTools(mapped);
  };

  const filteredTools = tools.filter((tool) =>
    tool.toolName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-5">
      <div className="text-xl font-bold mb-4">Manage Tools for Subject</div>
      <div className="flex justify-between">
        <Input
          placeholder="Search Tool Name..."
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);
            const filtered = mappedTools.filter((tool) =>
              tool.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMappedTools(filtered);
          }}
          className="mb-4 w-[350px]"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          type="primary"
          className="bg-[#635BFF]"
        >
          Update Tools
        </Button>
      </div>

      <Table
        dataSource={filteredMappedTools}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
            onHeaderCell: () => ({
              style: {
                backgroundColor: headerBg,
                color: headerColor,
                fontWeight: "bold",
              },
            }),
          },
          {
            title: "Tool Name",
            dataIndex: "name",
            key: "name",
            onHeaderCell: () => ({
              style: {
                backgroundColor: headerBg,
                color: headerColor,
                fontWeight: "bold",
              },
            }),
          },
        ]}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Select Tools"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={"50%"}
      >
        <Input
          placeholder="Search tools..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-10"
        />
        <div className="max-h-[300px] overflow-y-auto space-y-4">
          {filteredTools.map((tool) => (
            <Checkbox
              key={tool.id}
              checked={selectedToolIds.includes(tool.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedToolIds([...selectedToolIds, tool.id]);
                } else {
                  setSelectedToolIds(
                    selectedToolIds.filter((id) => id !== tool.id)
                  );
                }
              }}
            >
              <span className="font-medium">{tool.toolName}</span> –{" "}
              {tool.description}
            </Checkbox>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default MappingTool;
