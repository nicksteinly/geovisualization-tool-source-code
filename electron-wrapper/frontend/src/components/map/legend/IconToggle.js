import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function IconToggle({ onClickFunction }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggleVisibility = () => {
    onClickFunction();
    setIsVisible(!isVisible);
  };

  return (
    <IconButton onClick={handleToggleVisibility}>
      {isVisible ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  );
}

export default IconToggle;
