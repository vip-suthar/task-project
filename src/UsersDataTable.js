import { Button, Image, Table, Typography } from "antd";
import { useState } from "react";
import UserProfileCard from "./UserProfileCard";

const { Link } = Typography;

export default function UsersDataTable({ data, total, fetchRecords }) {
  const [openProfileUrl, setOpenProfileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar",
      render: (col_data) => (
        <Image
          width={50}
          src={col_data}
          style={{
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "login",
      key: "username",
      render: (col_data, row_data) => (
        <Link href={row_data.html_url} target="_blank">
          {col_data}
        </Link>
      ),
    },
    {
      title: "Profile",
      dataIndex: "url",
      key: "profile",
      render: (col_data) => (
        <Button
          onClick={() => {
            setOpenProfileUrl(col_data);
          }}
        >
          Open Profile
        </Button>
      ),
    },
  ];

  return (
    data && (
      <>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ y: "calc(100vh - 260px)" }}
          pagination={{
            total: total,
            pageSize: 30,
            showSizeChanger: false,
            onChange: (page) => {
              setLoading(true);
              fetchRecords(page).then(() => {
                setLoading(false);
              });
            },
          }}
        />
        <UserProfileCard
          url={openProfileUrl}
          unsetUrl={() => {
            setOpenProfileUrl(null);
          }}
        />
      </>
    )
  );
}
