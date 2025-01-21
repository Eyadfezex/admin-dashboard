import { DealsChart, UpcomingEvents } from "@/components";
import { Col, Row } from "antd";

export const Home = () => {
  return (
    <Row>
      <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
        <UpcomingEvents />
      </Col>
      <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
        <DealsChart />
      </Col>
    </Row>
  );
};
