import { DollarCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
import { mapDealsData } from "@/utils/helpers";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

const DealsChart = () => {
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  const dealData = useMemo(() => {
    return mapDealsData(data?.data);
  }, [data?.data]);

  const config: AreaConfig = {
    data: dealData || [], // Ensure fallback to an empty array
    xField: "timeText", // Matches the "timeText" field in your data
    yField: "value", // Matches the "value" field
    seriesField: "state", // Groups data by "state" (e.g., Won/Lost)
    isStack: false, // Optional: Can be true if you want stacked areas
    smooth: true, // Makes the lines smooth
    animation: true, // Enables animations
    startOnZero: false, // Avoids starting from zero on Y-axis
    color: ["#5B8FF9", "#5AD8A6"], // Adjusted to 2 colors for "Won" and "Lost"
    legend: {
      offsetY: -5,
    },
    yAxis: {
      tickCount: 5, // Adjust tick count for better visualization
      label: {
        formatter: (v) => `$${(Number(v) / 1000).toLocaleString()}k`,
      },
    },
    tooltip: {
      formatter: (data) => ({
        name: data.state,
        value: `$${(Number(data.value) / 1000).toLocaleString()}k`,
      }),
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0 24px" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DollarCircleOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
};

export default DealsChart;
