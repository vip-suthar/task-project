import { Alert, Flex, Typography } from "antd";
import { useCallback } from "react";

const { Title } = Typography;

export default function Messages({ loading, message, messageType }) {
  const getAlertTitle = useCallback((msgType) => {
    switch (msgType) {
      case "info":
        return "Information";
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      default:
        return "";
    }
  }, []);

  return message ? (
    loading ? (
      <Flex justify="center" style={{ width: "100%" }}>
        <Title type="secondary" level={3}>
          {message}
        </Title>
      </Flex>
    ) : (
      <Alert
        message={getAlertTitle(messageType)}
        description={message}
        type={messageType}
        showIcon
      />
    )
  ) : null;
}
