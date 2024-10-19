import React, { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart"; // Ensure pieArcLabelClasses is imported correctly
import api from "../../api";

const ComplaintStatusOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/admin/complaintStatuses`
        );
        const statusData = Object.entries(response.data).map(
          ([key, value], index) => ({
            id: index,
            label: key,
            value: value,
          })
        );
        setData(statusData);
      } catch (error) {
        console.error("Error fetching complaint statuses:", error);
      }
    };

    fetchStatusData();
  }, []);

  return (
    <div>
      <h2>Complaint Status Overview</h2>
      {data.length > 0 ? (
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={400}
          height={300}
          colors={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
              },
            }}
          // series={[
          //   {
          //     arcLabel: (item) => `${item.label} (${item.value})`,
          //     arcLabelMinAngle: 45,
          //     data,
          //   },
          // ]}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ComplaintStatusOverview;
