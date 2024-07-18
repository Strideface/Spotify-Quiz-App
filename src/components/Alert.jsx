import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

export default function Alert({ trigger, content, color }) {
  return (
    <Popover placement="top" color={color}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        <div>{content}</div>
      </PopoverContent>
    </Popover>
  );
}

// const colors = [
//     "default",
//     "primary",
//     "secondary",
//     "success",
//     "warning",
//     "danger",
//     "foreground",
//   ];
