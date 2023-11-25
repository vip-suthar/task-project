import { useEffect, useState } from "react";
import { Button, Input, Layout, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";

import UsersDataTable from "./UsersDataTable";
import Messages from "./Messages";

const { Title } = Typography;

const getUsersData = async function (searchQuery, page = 1) {
  try {
    const data = await fetch(
      `https://api.github.com/search/users?q=${searchQuery} in:name type:user sort:followers&page=${page}`
    );
    return await data.json();
  } catch (error) {
    console.error("error occured");
    return null;
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [messageType, setMessageType] = useState("info");
  const [message, setMessage] = useState("Type something to search...");

  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 500]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUsersDataSearch = () => {
    if (!(debouncedInputValue && debouncedInputValue.trim() !== "")) return;
    setLoading(true);
    setMessage(`Searching results for "${debouncedInputValue}" ...`);
    getUsersData(debouncedInputValue)
      .then((data) => {
        if (!data) {
          setMessageType("error");
          setMessage(`Some Error Occured; Please try again :(`);
          setUsersData(null);
        } else if (!data.total_count) {
          setMessageType("warning");
          setMessage(`No results found for "${debouncedInputValue}" ...`);
          setUsersData(null);
        } else if (data.incomplete_results) {
          setMessageType("error");
          setMessage("Search time limit exceeded; Please try again :(");
          setUsersData(null);
        } else {
          setUsersData(data);
          setMessage(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setMessageType("error");
        setMessage("Some Error Occured: " + err.message);
        setLoading(false);
        console.error(err);
      });
  };

  const [usersData, setUsersData] = useState(null);
  useEffect(() => {
    if (debouncedInputValue && debouncedInputValue.trim() !== "")
      handleUsersDataSearch();
    else {
      setUsersData(null);
      setLoading(true);
      setMessage("Type something to search...");
    }
  }, [debouncedInputValue]);

  return (
    <Layout
      style={{
        backgroundColor: "#fff",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <Space.Compact>
          <Input
            placeholder="Type Something..."
            allowClear
            style={{ width: 250 }}
            onChange={handleInputChange}
          />
          <Button icon={<SearchOutlined />} onClick={handleUsersDataSearch} />
        </Space.Compact>
        <Title level={3}>GitHub Users Data</Title>
      </Header>
      <Content style={{ height: "calc(100vh - 80px)", overflow: "hidden" }}>
        <Messages
          loading={loading}
          message={message}
          messageType={messageType}
        />
        {usersData !== null && Array.isArray(usersData.items) ? (
          <>
            <Title level={5} type="secondary">
              Found {usersData.total_count} users for "{inputValue}" ...
            </Title>
            <UsersDataTable
              data={usersData.items}
              total={usersData.total_count}
              fetchRecords={async (page) => {
                try {
                  const data = await getUsersData(debouncedInputValue, page);
                  if (!data) {
                    setMessageType("error");
                    setMessage(`Some Error Occured; Please try again :(`);
                  } else if (data.incomplete_results) {
                    setMessageType("error");
                    setMessage(
                      "Search time limit exceeded; Please try again :("
                    );
                  } else {
                    setUsersData(data);
                  }
                } catch (err) {
                  setMessageType("error");
                  setMessage("Some Error Occured: " + err.message);
                  setLoading(false);
                  console.error(err);
                }
              }}
            />
          </>
        ) : null}
      </Content>
    </Layout>
  );
}

export default App;
