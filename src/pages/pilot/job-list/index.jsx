import { PlusOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { getJobListByPilot } from "../../../store/job/jobSlice";

const PilotJobListPage = () => {
  const jobList = useSelector(store => store.job.jobList);
  const userId = useSelector(store => store.user.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Created At',
      render: (date) => {
        return format(date, 'yyyy/MM/dd')
      },
      width: 120
    }
  ]

  useEffect(() => {
    if (userId) {
      dispatch(getJobListByPilot());
    }
  }, [dispatch, userId]);

  return (
    <div className="container">
      <div className="page-header">
        <span className="sub-title">Available Job List</span>
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
                navigate(`/pilot/jobs/${record._id}`)
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default PilotJobListPage;