import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { notification, Modal, Typography, Space } from "antd";
import axios from "axios";
import MarvelCredentialsContext from "../../../contexts/MarvelCredentialsContext";
import { ComicType } from "../../../types";

type BaseModalType = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  cover: React.ReactNode;
};

const { Title } = Typography;

const BaseModal = ({
  isModalOpen,
  setIsModalOpen,
  id,
  cover,
}: BaseModalType) => {
  const [item, setItem] = useState<any>();
  const { marvelURL, credentials } = useContext(MarvelCredentialsContext);
  const [api, contextHolder] = notification.useNotification();
  const [date, setDate] = useState("");

  const { ts, hash, marvelPublicKey } = credentials;

  useEffect(() => {
    const getItem = async () => {
      try {
        const { data } = await axios.get(`${marvelURL}/comics/${id}`, {
          params: {
            ts,
            hash,
            apikey: marvelPublicKey,
          },
        });

        setItem(data.data.results[0]);
      } catch (err: any) {
        api.error({
          message: err.message,
          placement: "topRight",
        });
      }
    };

    getItem();
  }, []);

  useEffect(() => {
    const date = new Date(item?.dates[1].date);
    setDate(date.toLocaleDateString("en-US"));
  }, [item]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <Title level={3}>About</Title>
          <Space style={{ width: "100%" }} align="start" size="large">
            {cover}

            <Space direction="vertical" align="start">
              <Title level={5}>{item?.title}</Title>
              <ul>
                <li>Description: {item?.description || "No description."}</li>
                <li>Date: {date}</li>
              </ul>
            </Space>
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default BaseModal;
