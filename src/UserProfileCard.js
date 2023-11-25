import {
  Avatar,
  Button,
  Card,
  Flex,
  Image,
  Modal,
  Skeleton,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Link, Text, Title } = Typography;

const data = {
  login: "vip-suthar",
  id: 78523125,
  node_id: "MDQ6VXNlcjc4NTIzMTI1",
  avatar_url: "https://avatars.githubusercontent.com/u/78523125?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/vip-suthar",
  html_url: "https://github.com/vip-suthar",
  followers_url: "https://api.github.com/users/vip-suthar/followers",
  following_url:
    "https://api.github.com/users/vip-suthar/following{/other_user}",
  gists_url: "https://api.github.com/users/vip-suthar/gists{/gist_id}",
  starred_url: "https://api.github.com/users/vip-suthar/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/vip-suthar/subscriptions",
  organizations_url: "https://api.github.com/users/vip-suthar/orgs",
  repos_url: "https://api.github.com/users/vip-suthar/repos",
  events_url: "https://api.github.com/users/vip-suthar/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/vip-suthar/received_events",
  type: "User",
  site_admin: false,
  name: "Vipin Suthar",
  company: null,
  blog: "",
  location: null,
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 10,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: "2021-02-04T04:37:55Z",
  updated_at: "2023-09-11T16:56:01Z",
};

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
