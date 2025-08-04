import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";


const MiniPanelButton = ({ icon: Icon, label, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="miniPanelRow" onClick={onClick} style={{ cursor: "pointer" }}>
        <Icon size={16} />
      </div>
    </TooltipTrigger>
    <TooltipContent
      side="top"
      style={{
        backgroundColor: "white",
        color: "#1f2937",
        padding: "6px 12px",
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "9999px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        whiteSpace: "nowrap",
        zIndex: 9999,
      }}
    >
      {label}
    </TooltipContent>
  </Tooltip>
);

export default MiniPanelButton;
