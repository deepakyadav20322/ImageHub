import React from "react";

const CustomTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button ref={ref} {...props} className="my-custom-trigger">
      {props.children || "Open Dialog"}
    </button>
  )
);

export default CustomTrigger