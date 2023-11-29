import {
  Avatar,
  Button,
  Card,
  Flex,
  Modal,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Text, Title } = Typography;

export default function UserProfileCard({ url, unsetUrl }) {
  const [open, setOpen] = useState(!!url);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!!url) {
      setLoading(true);
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (!data) setError("Some Error Occured; Please try again :(");
          else setUserData(data);
          setLoading(false);
        }).catch(err=> {
            setError("Some Error Occured; Please try again :(");
            console.error(err);
            setLoading(false);
        })
    }
    setOpen(!!url);
  }, [url]);

  const handleOk = () => {
    unsetUrl();
  };
  const handleCancel = () => {
    unsetUrl();
  };

  return (
    <Modal open={open} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      {error ? (
        <Flex justify="center" style={{ width: "100%" }}>
          <Title type="secondary" level={3}>
            {error}
          </Title>
        </Flex>
      ) : (
        <Card style={{ marginTop: 30 }}>
          <Skeleton loading={loading} avatar active>
            {userData ? (
              <>
                <Tooltip title="Open Github Profile">
                  <Button
                    icon={<ExportOutlined />}
                    style={{ float: "right" }}
                    onClick={() => {
                      window.open(userData.html_url, "_blank");
                    }}
                  />
                </Tooltip>
                <Flex gap={10}>
                  <Avatar src={userData.avatar_url} style={{ marginTop: 5 }} />
                  <Space direction="vertical" size="small">
                    <Title level={5} style={{ margin: 0 }}>
                      {userData.name} ({userData.login})
                    </Title>
                    <Text type="secondary">
                      Followers: {userData.followers}
                      <br />
                      Following: {userData.following}
                    </Text>
                  </Space>
                </Flex>
                <Flex vertical style={{ marginTop: 10 }}>
                  <Text>
                    <Text strong>Public Repository:</Text>{" "}
                    {userData.public_repos}
                  </Text>
                  <Text>
                    <Text strong>Public Gists:</Text> {userData.public_gists}
                  </Text>
                  {userData.email && (
                    <Text>
                      <Text strong>Email:</Text> {userData.email}
                    </Text>
                  )}
                  {userData.bio && (
                    <Text>
                      <Text strong>Bio:</Text> {userData.bio}
                    </Text>
                  )}
                  {userData.blog && (
                    <Text>
                      <Text strong>Blog:</Text> {userData.blog}
                    </Text>
                  )}
                  {userData.location && (
                    <Text>
                      <Text strong>Location:</Text> {userData.location || "N/A"}
                    </Text>
                  )}

                  {userData.company && (
                    <Text>
                      <Text strong>Company:</Text> {userData.company}
                    </Text>
                  )}
                </Flex>
              </>
            ) : null}
          </Skeleton>
        </Card>
      )}
    </Modal>
  );
}
