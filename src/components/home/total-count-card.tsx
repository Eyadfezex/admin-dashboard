import { totalCountVariants } from "@/constants";
import { Card, Skeleton } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";

type DashboardTotalConteCardProps = {
  isLoading: boolean;
  totalCount?: number;
  resource: string;
};
type ResourceType = keyof typeof totalCountVariants;

const DashboardTotalConteCard = ({
  isLoading,
  totalCount,
  resource,
}: DashboardTotalConteCardProps & { resource: ResourceType }) => {
  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];
  const config: AreaConfig = {
    data: totalCountVariants[resource].data || [], // Ensure fallback to an empty array
    xField: "index", // Matches the "timeText" field in your data
    yField: "value", // Matches the "value" field
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    autoFit: true,
    isStack: false, // Optional: Can be true if you want stacked areas
    smooth: true, // Makes the lines smooth
    startOnZero: false, // Avoids starting from zero on Y-axis
    legend: {
      offsetY: -5,
    },
    xAxis: false,
    yAxis: {
      tickCount: 12, // Adjust tick count for better visualization
      label: {
        style: {
          stroke: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    line: {
      color: primaryColor,
    },
    areaStyle: () => {
      return {
        fill: `l(270) 0(#fff) 0.2${secondaryColor} 1:${primaryColor}`,
      };
    },
    tooltip: false,
  };
  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      bodyStyle={{ padding: "8px 8px 8px 12px" }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxxl"
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
          strong
        >
          {isLoading ? (
            <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
          ) : (
            totalCount
          )}
        </Text>
        <Area {...config} style={{ width: "50%" }} />
      </div>
    </Card>
  );
};

export default DashboardTotalConteCard;
