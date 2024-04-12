import React from 'react';
import { getAnalytics } from '../handlers/apiHandlers';
import { Card, Row, Col, Button, Spin } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export const Home = (props) => {
    const { name } = props;

    const [analytics, setAnalytics] = React.useState({});
    const [loading, setLoading] = React.useState(true); // Add loading state

    React.useEffect(() => {
        getAnalytics()
            .then((data) => {
                console.log(data);
                setAnalytics(data);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((err) => {
                console.error(err);
                setLoading(false); // Set loading to false on error as well
            });

        console.log("day before: "+ analytics.totalTacAppliedDayBefore);
        console.log("yesterday: "+ analytics.totalTacAppliedYesterday);
        console.log("today: "+ analytics.totalTacAppliedToday);
    }, []);

    const [showMore, setShowMore] = React.useState(false);

    const handleViewMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div>
            <h1>Hello {name.split(" ")[0]}!</h1>
            <Card title="Some Analytics">
                {loading ? ( // Render loading spinner while data is loading
                    <Spin size="large" />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card title="Software vs Hardware TACs">
                                    <BarChart width={400} height={300} data={[
                                        { name: 'Software TACs', value: analytics.totalSoftwareTacs },
                                        { name: 'Hardware TACs', value: analytics.totalHardwareTacs },
                                        { name: 'Total TACs', value: analytics.totalTacs },
                                    ]}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="TAC Status">
                                    <PieChart width={400} height={300}>
                                        <Pie data={[
                                            { name: 'Initiated', value: analytics.totalPendingTacs },
                                            { name: 'Approved', value: analytics.totalApprovedTacs },
                                            { name: 'Rejected', value: analytics.totalRejectedTacs }
                                        ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                            <Cell fill="grey" />
                                            <Cell fill="#8884d8" />
                                            <Cell fill="red" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card style={{ margin: '20px' }} title="Daily TACs Applied">
                                    <LineChart width={800} height={200} data={[
                                        { name: 'Day Before', value: analytics.totalTacAppliedDayBefore },
                                        { name: 'Yesterday', value: analytics.totalTacAppliedYesterday },
                                        { name: 'Today', value: analytics.totalTacAppliedToday },
                                    ]}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                    </LineChart>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Button 
                                    type='text' 
                                    onClick={handleViewMore}
                                    icon={<CaretDownOutlined />}
                                    style={{margin:'20px', color:'#8884d8'}}
                                >
                                    View More
                                </Button>
                            </Col>
                        </Row>
                        {showMore && (
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Card title="Total TACs">{analytics.totalTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Software TACs">{analytics.totalSoftwareTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Hardware TACs">{analytics.totalHardwareTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Approved TACs">{analytics.totalApprovedTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Rejected TACs">{analytics.totalRejectedTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Pending TACs">{analytics.totalPendingTacs}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Users">{analytics.totalUsers}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Appointments">{analytics.totalAppointments}</Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Early Appointments">{analytics.totalEarlyAppointments}</Card>
                                </Col>
                            </Row>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
