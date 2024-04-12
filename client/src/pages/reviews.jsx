import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Modal, Form, InputNumber, Rate } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { getReviews } from '../handlers/apiHandlers';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Fetch reviews data
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviews();
                console.log(reviewsData);
                setReviews(reviewsData);
                setLoading(false); // Set loading state to false after data is fetched
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setLoading(false); // Set loading state to false in case of error
            }
        };

        fetchReviews();
    }, []);

    const handleReview = async (tacID) => {
        // Handle review
        await message.loading(`Reviewing ${tacID}`, 1);
       // message.warning('Reviewing is out of scope of this project!');

        Modal.confirm({
            title: `Reviewing ${tacID}`,
            content: (
                <div>
                    <Form>
                        <Form.Item label="Communication Skills" name="communicationSkills">
                            <Rate allowHalf defaultValue={0} />
                        </Form.Item>
                        <Form.Item label="Technical Competency" name="technicalCompetency">
                            <Rate allowHalf defaultValue={0} />
                        </Form.Item>
                        <Form.Item label="Team Involvement" name="teamInvolvement">
                            <Rate allowHalf defaultValue={0} />
                        </Form.Item>
                        <Form.Item label="Project Completion" name="projectCompletion">
                            <Rate allowHalf defaultValue={0} />
                        </Form.Item>
                        <Form.Item label="Reward Points Offering" name="rewardPointsOffering">
                            <InputNumber min={0} defaultValue={0} />
                        </Form.Item>
                    </Form>
                </div>
            ),
            okText: 'Submit',
            cancelText: 'Cancel',
            onOk: async () => {
                await message.loading('Submitting review...', 1);
                message.success('Review submitted successfully!');
                message.info('Reviewing is out of scope of this project!');
            },
            onCancel: () => message.info('Review cancelled!'),
        } 
    );
    };

    // Table columns
    const columns = [
        {
            title: 'TAC ID',
            dataIndex: 'tacID',
            key: 'tacID',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
        },
        {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
            render: students => students.map(student => student.rollNumber).join(', '),
        },
        {
            title: 'Document Link',
            dataIndex: 'documentLink',
            key: 'documentLink',
            render: documentLink => <Button 
                                        onClick={() => window.open(documentLink, '_blank')}
                                        icon={<FileOutlined />}
                                        type='link'
                                        > open </Button>,
        },
        {
            title: 'Applied Date',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: appliedDate => new Date(appliedDate).toLocaleDateString(),
        },
        {
            title: 'Approved Date',
            dataIndex: 'approvedDate',
            key: 'approvedDate',
            render: approvedDate => new Date(approvedDate).toLocaleDateString(),
        },
        {
            title: 'Appointment Date',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            render: (appointmentDate, record) => {
                const formattedDate = new Date(appointmentDate).toLocaleDateString();
                return record.isEarlyAppointment ? `${formattedDate} (early)` : formattedDate;
            },
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: '_id',
            render: (_, record) => (
                <Button onClick={() => handleReview(record.tacID)}>
                    Review Now
                </Button>
            ),
        }
    ];

    return (
        <div style={{ overflowX: 'auto' }}>
            {loading ? ( // Render loading spinner if loading state is true
                <Spin size="large" />
            ) : (
                <Table dataSource={reviews} columns={columns} />
            )}
        </div>
    );
};

export default Reviews;
