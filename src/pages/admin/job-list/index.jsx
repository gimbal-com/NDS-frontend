import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { getJobListByAdmin, getJobListByClient, updateJobStatusByAdmin } from "../../../store/job/jobSlice";

const AdminJobListPage = () => {
    const jobList = useSelector(store => store.job.jobList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState("");

    const columns = [
        {
            key: 'index',
            dataIndex: '_id',
            title: 'No',
            render: (_, row, index) => index + 1,
            width: 80
        },
        {
            key: 'title',
            dataIndex: 'j_title',
            title: 'Title'
        },
        {
            key: 'description',
            dataIndex: 'j_description',
            title: "Description",
            render: (desc) => desc.length > 50 ? desc.substr(0, 50) + '...' : desc
        },
        {
            key: 'creator',
            dataIndex: 'j_creator',
            title: "Creator",
            render: (creator) => creator.u_email,
            width: 200
        },
        {
            key: 'created_at',
            dataIndex: 'created_at',
            title: 'Created At',
            render: (date) => {
                return format(date, 'yyyy/MM/dd')
            },
            width: 120
        },
        {
            key: 'action',
            dataIndex: '_id',
            title: 'Action',
            render: (_id, row) => {
                return (
                    <Select
                        options={[
                            {value: "Pending", label:  'Pending'},
                            {value: "Approved", label: 'Approved'}
                        ]}
                        value={row.j_status}
                        onChange={(value) => handleUpdateStatus(_id, value)}
                    />
                )
            },
            width: 120  
        }
    ]

    useEffect(() => {
        dispatch(getJobListByAdmin(statusFilter));
    }, [dispatch, statusFilter]);

    const handleUpdateStatus = (jobId, status) => {
        dispatch(updateJobStatusByAdmin({jobId, status}));
    }

    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">Job List</span>
                <Select
                    value={statusFilter}
                    options={[
                        {
                            label: "All",
                            value: ""
                        },
                        {
                            label: "Pending",
                            value: "Pending"
                        },
                        {
                            label: "Approved",
                            value: "Approved"
                        }
                    ]}
                    onChange={(value) => setStatusFilter(value)}
                    style={{width: 120}}
                />
            </div>
            <div>
                <Table
                    bordered
                    size="small"
                    dataSource={jobList || []}
                    columns={columns}
                    rowKey={row => row._id}
                    onRow={(record, index) => {
                        return {
                            onClick: () => {
                                // navigate(`/admin/jobs/${record._id}`)
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default AdminJobListPage;