import { SmartDatetimeInput } from "@/registry/new-york/extension/smart-datetime-input";

const SmartDateTimeInputDemo = () => {
  return (
    <SmartDatetimeInput
      onValueChange={console.log}
      disabled={(date) => date < new Date()}
    />
  );
};

export default SmartDateTimeInputDemo;
