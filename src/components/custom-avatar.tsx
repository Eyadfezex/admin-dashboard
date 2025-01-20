import { getNameInitials, getRandomColorFromString } from "@/utils";
import { Avatar as AntdAvatar } from "antd";
import { AvatarProps } from "antd/lib";
type Props = AvatarProps & {
  name?: string;
};
const CustomAvatar = ({ name = "Eyad Ahmed", style, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt="Eyad Ahmed"
      size="small"
      style={{
        backgroundColor: getRandomColorFromString(name),
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style,
      }}
      {...rest}
    >
      {getNameInitials(name)}
    </AntdAvatar>
  );
};

export default CustomAvatar;
