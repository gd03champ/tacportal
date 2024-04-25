import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Radio } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { message } from 'antd';

import { applyTac } from "../handlers/apiHandlers";

const { Dragger } = Upload;
const { Option } = Select;



const fileUploadProps = {
  name: 'file',
  multiple: false,
  //action: 'http://localhost:3001/api/upload',
  //action: 'https://tacportal.onrender.com/api/upload',
  action: `${process.env.REACT_APP_API_URL}api/upload`,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`); // Use name as filename
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`); // Use name as filename
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
    message.info('File(s) dropped');
  },
  beforeUpload(file) {
    // custom rename file name
    const extension = file.name.split('.').pop()
    const newName = `${file.uid}.${extension}`;
    // replace origin File
    const newFile = new File([file], newName, { type: file.type })
    return newFile
  }
};

const ApplyTac = (props) => {

  const { setScreen } = props;
  const { userRole } = props;

  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [domain, setDomain] = useState("software");

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleAddStudent = () => {
    setStudents([...students, { rollNumber: "", techStack: "" }]);
  };

  const handleRemoveStudent = (index) => {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1);
    setStudents(updatedStudents);
  };

  const handleSubmit = async (values) => {
    // Handle form submission
    const title = values.title;
    const description = values.description;
    const documentLink = values.documents.file.response.url;
    //const domain = domain;
    //const students = students;
    //console.log("Title: ", title, "\nDescription: ", description, "\nDomain: ", domain, "\nDocument Link: ", documentLink);
    //console.log(students);
    
    try {
      await applyTac(
        title,
        description,
        domain,
        students,
        documentLink
      );
      message.success("tac applied successfully.");
      setScreen('dashboard');
    } catch (err) {
      message.error(err);
    }
  };

  if (userRole !== "student") {
    return (
      <div>
        <h1>Admin cannot apply for tac</h1>
        <h1>You are a {userRole}</h1>
      </div>
    );
  }

  return (

    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="title" label="">
        <Input placeholder="title of the project" />
      </Form.Item>
      <Form.Item name="description" label="">
        <Input.TextArea placeholder="A short description about the project" />
      </Form.Item>

      <Radio.Group
        style={{ margin: '0 16px 20px 24px' }}
        defaultValue={domain}
        buttonStyle="solid"
        onChange={(e) => {
          setDomain(e.target.value);
          setStudents([]);
        }}>
        <Radio.Button value="software">Software</Radio.Button>
        <Radio.Button value="hardware">Hardware</Radio.Button>
      </Radio.Group>

      <Button onClick={handleAddStudent}>Add Student</Button>

      {students.map((student, index) => (
        <div key={index}>
          <Form.Item
            name={`students[${index}].rollNumber`}
            label="Roll Number"
          >
            <Input
              value={student.rollNumber}
              onChange={(e) =>
                handleStudentChange(index, "rollNumber", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name={`students[${index}].techStack`}
            label="Tech Stack"
          >
            <Select
              value={student.techStack}
              onChange={(value) =>
                handleStudentChange(index, "techStack", value)
              }
            >
              {domain === "software" ? (
                <>
                  <Option value="frontend">Frontend</Option>
                  <Option value="backend">Backend</Option>
                </>
              ) : (
                <>
                  <Option value="designing">Designing</Option>
                  <Option value="prototyping">Prototyping</Option>
                </>
              )}
            </Select>
          </Form.Item>
          <Button onClick={() => handleRemoveStudent(index)}>Remove</Button>
        </div>
      ))}


      <Form.Item style={{ margin: '48px' }} name="documents" label="">
        <Dragger {...fileUploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Upload the tac document only in the specified format.</p>
        </Dragger>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ApplyTac;
