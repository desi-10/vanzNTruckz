import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loader = ({ color }: { color?: string }) => {
  return (
    <div className="flex items-center justify-center space-x-3">
      <p className={`text-sm font-medium ${color ? "#f77f1e" : "#fff"}`}>
        Loading...
      </p>
      <RotatingLines
        width="30"
        visible={true}
        strokeColor={color ? "#f77f1e" : "#fff"}
      />
    </div>
  );
};

export default Loader;
