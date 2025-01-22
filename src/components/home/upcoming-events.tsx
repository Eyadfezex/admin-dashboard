import { CalendarOutlined } from "@ant-design/icons";
import Card from "antd/es/card/Card";
import { Text } from "@/components/text";
import { Badge, List } from "antd";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import { getDate } from "@/utils/helpers";
import { useList } from "@refinedev/core";
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries";
import dayjs from "dayjs";

const UpcomingEvents = () => {
  const { data, isLoading } = useList({
    resource: "events",
    pagination: { pageSize: 5 },
    sorters: [{ field: "startDate", order: "asc" }],
    filters: [
      {
        field: "startDate",
        operator: "gte",
        value: dayjs().format("YYY-MM-DD"),
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });
  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "1rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <CalendarOutlined />
        <Text size="sm" style={{ marginLeft: "0.7rem" }}>
          UpcomingEvents
        </Text>
      </div>
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        ></List>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<Text size="sm">{renderDate}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.title}
                    </Text>
                  }
                ></List.Item.Meta>
              </List.Item>
            );
          }}
        ></List>
      )}
      {!isLoading && data?.data.length === 0 && <span>no upcoming events</span>}
    </Card>
  );
};

export default UpcomingEvents;
