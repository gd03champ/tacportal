import React, { useState, useEffect } from "react";
import { bookAppointment, getTacs, updateTac } from "../handlers/apiHandlers";
import { Card, Badge, Dropdown, Button, Menu, Row, Col, message, Tabs, Modal, DatePicker, Input, Table, Radio, Tag } from "antd";
import { FileOutlined, DeleteOutlined, CheckOutlined, TeamOutlined, ExclamationCircleOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
const { TextArea } = Input;

const Dashboard = (props) => {

  const { userRole } = props;

  const [tacs, setTacs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [bookingDate, setBookingDate] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  useEffect(() => {
    handleGetTacs();
  }, []);

  const getRemarks = async () => {
    let remarks = "";
    try {
      const myRemarks = await new Promise((resolve, reject) => {
        Modal.confirm({
          title: "Enter the remarks for rejection",
          icon: <ExclamationCircleOutlined />,
          content: <TextArea
            rows={4}
            placeholder="Enter remarks here..."
            //onChange={(e) => console.log(e.target.value)} />,
            onChange={(e) => {remarks = e.target.value}} />,
            onOk: () => {
            resolve(remarks);
          },
          onCancel: () => {
            reject("Remarks input cancelled");
          },
        });
      });
      return myRemarks;
    } catch (err) {
      console.error("Failed to get remarks: ", err.message);
      throw err;
    }
  };

  const handleGetTacs = async () => {
    const myTacs = await getTacs();
    setTacs(myTacs);
    console.log(myTacs);
    message.success("Tacs fetched successfully!");
  };

  const handleBookAppointment = async (tacUid) => {
    try {
      // Implement this function to book an appointment
      //message.warning("Book appointment for tac: " + tacUid + " not implemented yet!");
      const today = new Date();
      const approvedDate = new Date(tacs.find((tac) => tac._id === tacUid).approvedDate);
      const remainingDays = 5 - Math.ceil((today - approvedDate) / (1000 * 60 * 60 * 24));

      const getDate = () => {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Select Date",
            content: (
              <DatePicker
                variant="filled"
                onChange={(date) => {
                  console.log(date);
                  setBookingDate(date);
                }}
                disabledDate={(current) => {
                  const currentDate = new Date();
                  return current && current < currentDate.setHours(0, 0, 0, 0);
                }}
              />
            ),
            okText: "OK",
            cancelText: "Cancel",
            onOk: () => {
              resolve();
            },
            onCancel: () => {
              reject(new Error("Booking cancelled!"));
            },
          });
        });
      };

      if (remainingDays > 0) {
        const confirmBooking = () => {
          return new Promise((resolve, reject) => {
            Modal.confirm({
              title: `${remainingDays} days remaining for time limit!`,
              content: "You will be provided only 30% of rp. Do you want to proceed?",
              okText: "Yes",
              cancelText: "No",
              onOk: () => {
                // Proceed with booking
                resolve();
              },
              onCancel: () => {
                // Cancel booking
                reject(new Error("Booking cancelled!"));
              },
            });
          });
        };
        await confirmBooking();
      }
      await getDate();

      // Book appointment to api
      await bookAppointment(tacUid, bookingDate, remainingDays > 0 ? true : false);

      message.success(`Appointment booked on ${bookingDate} successfully!`);

      // Refresh tacs
      handleGetTacs();

    } catch (err) {
      message.error("Failed to book appointment: " + err.message);
    }
  };

  const handleCancelTac = async (tacUid) => {
    // Implement this function to cancel a tac
    message.warning("Cancel request for tac: " + tacUid + " not implemented yet!");
  };

  // admin handlers
  const handleApproveTac = (tacUid) => {
    // Implement this function to approve a tac
    // message.warning("Approve request for tac: " + tacUid + " not implemented yet!");
    try {
      updateTac(tacUid, "approve", "");
      message.success("Tac approved successfully!");
      handleGetTacs();
    } catch (err) {
      message.error("Failed to approve tac: " + err.message);
    }
  };

  const handleRejectTac = async (tacUid) => {
    // Implement this function to reject a tac
    //message.warning("Reject request for tac: " + tacUid + " not implemented yet!");
    try {
      const remarks = await getRemarks();
      await updateTac(tacUid, "reject", remarks);
      message.success("Tac application rejected successfully!");
      handleGetTacs();
    } catch (err) {
      message.error("Failed to reject tac: " + err.message);
    }
  };

  const renderStudentsDropdown = (students) => {
    return (
      <Menu>
        {students.map((student) => (
          <Menu.Item key={student.rollNumber}>{student.rollNumber + " 👉 " + student.techStack}</Menu.Item>
        ))}
      </Menu>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "initiated":
        return "gray";
      default:
        return "gray";
    }
  }

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const filterTacsByStatus = (status) => {
    if (status === "all") {
      return tacs;
    } else {
      return tacs.filter((tac) => tac.status === status);
    }
  };

  const renderTac = (tac) => {
    return (
      <Col key={tac._id} style={{ marginBottom: "30px", width: tacs.length < 3 ? "33.33%" : "auto" }}>
        <Card
          style={{ marginBottom: "30px" }}
          title={tac.title}
          hoverable
          bordered
          loading={false}
          extra={
            <Badge
              style={{ backgroundColor: "#001529" }}
              className="domain-badge"
              count={tac.domain}
            />
          }
          headStyle={{ backgroundColor: "#001529", color: "white" }} // Add this line to set the header color
        >
          <div style={{ display: "flex", justifyContent: "center" }}> {/* Add this div to center the badge */}
            <Badge
              style={{ backgroundColor: getStatusColor(tac.status), color: getStatusColor(tac.status) === "yellow" ? "black" : "white" }}
              count={tac.status}
            />
            {tac.status === 'approved' &&
              <Badge
                style={{ backgroundColor: '#001529', color: 'white', marginLeft: '8px' }}
                count={tac.tacID}
              />
            }
          </div>
          <div style={{ height: "70px", overflow: "hidden" }}>
            <p style={{ textAlign: "center" }}>{tac.description}</p>
          </div>
          {tac.status === 'rejected' &&
            <div style={{ height: "70px", overflow: "hidden" }}>
              <p style={{ textAlign: "center", color: 'red' }}>{tac.remarks}</p>
            </div>
          }
          <div style={{ display: "flex", justifyContent: "center" }}> {/* Add this div to center the child divisions */}
            <div style={{ display: 'flex' }}>
              <Dropdown overlay={renderStudentsDropdown(tac.students)}>
                <Button
                  icon={<TeamOutlined />}
                  type="dashed"
                  style={{ marginRight: "8px" }}>
                  View Team
                </Button>
              </Dropdown>
              <Button
                type="default"
                icon={<FileOutlined />}
                onClick={() => {
                  // Replace https: with http: to fix SSL errors
                  const documentUrl = tac.documentLink.replace('https:', 'http:');
                  window.open(documentUrl, "_blank");
                }}
                style={{ marginLeft: "8px" }}
              >
                Document
              </Button>
            </div>
          </div>
          <p>
            {"Applied on: " +
              new Date(tac.appliedDate).getDate() +
              "/" +
              new Date(tac.appliedDate).getMonth() +
              "/" +
              new Date(tac.appliedDate).getFullYear()}
          </p>

          <p>
            {tac.status === "approved" &&
              "Approved on: " +
              new Date(tac.approvedDate).getDate() +
              "/" +
              new Date(tac.approvedDate).getMonth() +
              "/" +
              new Date(tac.approvedDate).getFullYear()}
          </p>

          <p>
            {tac.isAppointmentBooked &&
              "Review on: " +
              new Date(tac.appointmentDate).getDate() +
              "/" +
              new Date(tac.appointmentDate).getMonth() +
              "/" +
              new Date(tac.appointmentDate).getFullYear()}
            {tac.isAppointmentBooked && tac.isEarlyAppointment && " (Early Appointment)"}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {tac.status === 'approved' && userRole === "student" && !tac.isAppointmentBooked &&
              <Button
                style={{ backgroundColor: '#001529' }}
                type="primary"
                onClick={() => handleBookAppointment(tac._id)}
              > Book
              </Button>
            }

            {tac.status === 'initiated' && userRole === 'student' &&
              <Button
                onClick={() => handleCancelTac(tac._id)}
                type="danger"
                icon={<DeleteOutlined />}
                style={{ color: "red" }}>
                Cancel
              </Button>}

            {tac.status === 'initiated' && userRole === 'staff' &&
              <div>
                <Button
                  onClick={() => handleApproveTac(tac._id)}
                  type="text"
                  icon={<CheckOutlined />}
                  style={{ color: "green", marginRight: '25px' }}>
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejectTac(tac._id)}
                  type="danger"
                  icon={<DeleteOutlined />}
                  style={{ color: "red", marginLeft: '25px' }}>
                  Reject
                </Button>
              </div>
            }
          </div>
        </Card>
      </Col>
    );
  };

  // Table columns definition
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      render: (domain) => <Tag color="#001529">{domain}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Applied Date',
      key: 'appliedDate',
      render: (_, record) => (
        <span>
          {new Date(record.appliedDate).getDate()}/
          {new Date(record.appliedDate).getMonth()}/
          {new Date(record.appliedDate).getFullYear()}
        </span>
      ),
    },
    {
      title: 'Team',
      key: 'team',
      render: (_, record) => (
        <Dropdown overlay={renderStudentsDropdown(record.students)}>
          <Button icon={<TeamOutlined />} type="dashed">View Team</Button>
        </Dropdown>
      ),
    },
    {
      title: 'Document',
      key: 'document',
      render: (_, record) => (
        <Button
          type="default"
          icon={<FileOutlined />}
          onClick={() => {
            const documentUrl = record.documentLink.replace('https:', 'http:');
            window.open(documentUrl, "_blank");
          }}
        >
          Document
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.status === 'approved' && userRole === "student" && !record.isAppointmentBooked && (
            <Button
              style={{ backgroundColor: '#001529' }}
              type="primary"
              onClick={() => handleBookAppointment(record._id)}
            >
              Book
            </Button>
          )}
          {record.status === 'initiated' && userRole === 'student' && (
            <Button
              onClick={() => handleCancelTac(record._id)}
              danger
              icon={<DeleteOutlined />}
            >
              Cancel
            </Button>
          )}
          {record.status === 'initiated' && userRole === 'staff' && (
            <>
              <Button
                onClick={() => handleApproveTac(record._id)}
                type="text"
                icon={<CheckOutlined />}
                style={{ color: "green" }}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleRejectTac(record._id)}
                danger
                icon={<DeleteOutlined />}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Render the table view
  const renderTableView = (tacs) => {
    return (
      <Table
        dataSource={tacs.reverse()}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    );
  };

  // Render the card view
  const renderCardView = (tacs) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row gutter={16}>
          {tacs.reverse().map((tac) => renderTac(tac))}
        </Row>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Radio.Group 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="card"><AppstoreOutlined /> Card View</Radio.Button>
          <Radio.Button value="table"><UnorderedListOutlined /> Table View</Radio.Button>
        </Radio.Group>
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="All" key="all">
          {viewMode === "card" 
            ? renderCardView(filterTacsByStatus("all"))
            : renderTableView(filterTacsByStatus("all"))}
        </TabPane>
        <TabPane tab="Initiated" key="initiated">
          {viewMode === "card"
            ? renderCardView(filterTacsByStatus("initiated"))
            : renderTableView(filterTacsByStatus("initiated"))}
        </TabPane>
        <TabPane tab="Approved" key="approved">
          {viewMode === "card"
            ? renderCardView(filterTacsByStatus("approved")) 
            : renderTableView(filterTacsByStatus("approved"))}
        </TabPane>
        <TabPane tab="Rejected" key="rejected">
          {viewMode === "card"
            ? renderCardView(filterTacsByStatus("rejected"))
            : renderTableView(filterTacsByStatus("rejected"))}
        </TabPane>
      </Tabs>
      <Button
        style={{ marginTop: "20px", marginLeft: "auto", marginRight: "auto", display: "block" }}
        type="primary"
        onClick={handleGetTacs}
      >
        Refresh Tacs
      </Button>
    </div>
  );
};

export default Dashboard;
