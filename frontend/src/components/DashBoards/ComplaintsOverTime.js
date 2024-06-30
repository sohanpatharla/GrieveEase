import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';

// Function to get the day of the week index from a timestamp
const getDayIndex = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDay();
};

// Function to get the day of the week name from an index
const getDayName = (index) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[index];
};

const ComplaintsOverTime = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('In complaints service');
    axios.get('http://localhost:5000/api/complaints/complaintsovertime')
      .then(response => {
        console.log('Response received:', response.data);
        const formattedData = response.data.map(item => ({
          x: getDayIndex(new Date(item._id).getTime()), // Convert to day index
          y: item.count  // Ensure the count property is correctly named
        }));
        console.log('Formatted data:', formattedData);
        setData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  console.log(JSON.stringify(data));

  const xAxisData = data.map(item => item.x);
  const yAxisData = data.map(item => item.y);

  // Log xAxisData and yAxisData to ensure they are correct
  console.log('xAxisData:', xAxisData);
  console.log('yAxisData:', yAxisData);

  return (
    <LineChart
      xAxis={[{
        data: xAxisData,
        ticks: xAxisData.map(index => ({ value: index, label: getDayName(index) }))
      }]}
      series={[{ data: yAxisData }]}
      width={800}
      height={400}
      grid={{ vertical: true, horizontal: true }}
    />
  );
};

export default ComplaintsOverTime;
