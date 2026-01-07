import React, { act, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Graph, Input, Signup } from '../components'
import graphService from '../appwrite/config';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';


function HomePage() {
  const [error, setError] = useState("");
  const [studyHoursData, setStudyHoursData] = useState([]);
  const [activityDates, setActivityDates] = useState([]);
  const [streaks,setStreaks] = useState(0);
  const [noOfHours,setNoOfHours] = useState(0);
  const user = useSelector(state => state.auth.userData);
  const authStatus = useSelector(state => state.auth.status);
  const today = new Date().toLocaleDateString('en-CA');

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: today,
    }
  });

  function validateDate(inputDate) {
    // Ensure both dates are in 'YYYY-MM-DD' format for comparison
    const today =  new Date().toLocaleDateString('en-CA'); // Convert today's date to 'YYYY-MM-DD'
    const userDate = new Date(inputDate).toLocaleDateString('en-CA'); // Convert inputDate to 'YYYY-MM-DD'
  
    // Compare dates: inputDate should not be in the future
    return userDate <= today;
  }
  


  const generateGraph = async (data) => {
    if (!validateDate(data.date)) {
      setError("Hours can't be set on future dates");
      return;
    }
    if (data.studyHours < 0 || data.studyHours > 24) {
      setError("Study hours should be between 0 and 24");
      return;
    }
  
    try {
      const studyHours = parseFloat(data.studyHours);
      const compositeKey = `${user.$id}_${data.date}`;
      console.log("Data ", data);
  
      // Save the data
      await graphService.saveGraphData({ ...data, compositeKey, userId: user.$id, studyHours });
  
      // Insert the new entry into the existing data in sorted order
      const newEntry = { date: data.date, studyHours };
      const updatedStudyHoursData = [...studyHoursData, newEntry].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
  
      setStudyHoursData(updatedStudyHoursData);
      reset();
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  



  function calculateStreak(activityDates) {
    if (!activityDates || activityDates.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for today
    let streak = 0;
  
    // Loop through dates from the most recent to the oldest
    for (let i = activityDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(activityDates[i]);
      const previousDate = new Date(activityDates[i - 1]);
  
      // Check if today is part of the streak
      if (i === activityDates.length - 1 && currentDate.toDateString() === today.toDateString()) {
        streak++; // Include today
        continue;
      }
  
      // If dates are not consecutive, break the streak
      if (previousDate && (currentDate - previousDate) / (1000 * 60 * 60 * 24) !== 1) {
        break;
      }
  
      streak++;
    }
  
    return streak;
  }
  

  
  useEffect(() => {
    if(studyHoursData.length > 0) return;
    async function fetchData() {
      try {
        const hoursAndDate = await graphService.getStudyHoursAndDate(user.$id);
        const sortedData = hoursAndDate.sort((a, b) => new Date(a.date) - new Date(b.date));
        setStudyHoursData(sortedData);   
      } catch (error) {
        console.log("Error fetching study hours and date", error);
      }
    }

    fetchData();
  }, []);


  useEffect(() => {
    if (studyHoursData.length > 0) {
      // Extract and sort activity dates
     
      const data = studyHoursData.map((e) => new Date(e.date).toISOString().split('T')[0]); // Ensure date format is 'YYYY-MM-DD'
      // Calculate streak
      const calculatedStreak = calculateStreak(data);
      setStreaks(calculatedStreak);
      setActivityDates(data); // Update the activity dates
  
      // Calculate total hours
      const hours = studyHoursData.reduce((accumulator, ele) => accumulator + parseFloat(ele.studyHours), 0);
      setNoOfHours(hours);
    }
  }, [studyHoursData]);
  
  
  
  

  return (
    <div className='sm:flex justify-center'>


      <div className='sm:w-[500px]'>
        {/* Error Message */}
        {error && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}

        {/* Form Section */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(generateGraph)}
            className="w-full max-w-md bg-main-dark-bg p-6 rounded-lg mx-auto px-4"
          >
            <h2 className="text-white text-center text-lg font-bold mb-4">
              {authStatus? "Track Study Hours":"Login To Use"}
            </h2>

            {/* Input for Study Hours */}
            <Input
              type="float"
              placeholder="Enter study hours"
              className="bg-transparent text-white"
              onInput={() => setError("")}
              {...register("studyHours", {
                required: "Study hours is required",
              })}
            />

            {/* Input for Date */}
            <Input
              type="date"
              placeholder="Enter date"
              className="bg-transparent text-white"
              onInput={() => setError("")}
              {...register("date", {
                required: "Date is required",
              })}
            />

            {/* Submit Button */}
            <button className="mt-4 w-full bg-blue-950 text-blue-400 border border-blue-400 font-medium overflow-hidden relative px-4 py-[9px] rounded-md hover:brightness-150  hover:border-b active:opacity-75 outline-none duration-300 group">
                Submit
            </button>
          </form>
        </div>

        {/* Graph Section */}
        <div className="flex justify-center md:mt-14 mt-4">
        <div className="graph-container w-full max-w-[500px] mx-auto">
            <Graph arrayOfHoursAndDate={studyHoursData} />
          </div>
        </div>
      </div>


      <div className="flex justify-center mt-12 sm:ml-11 sm:w-400">
        {/* card1 */}

        <div> 
          <div
            className="relative drop-shadow-xl md:w-[180px] w-[160px] h-64 overflow-hidden rounded-xl bg-[#ffd828] m-4"
          >
            <div
              className="absolute flex flex-col items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#4f4c2e]"
            >
              <div className='display-block'>
                <p className="text-[18px] font-bold text-yellow-400 p-3"><span className='text-green-500'>Success</span> doesn't come from what you do occasionally, it comes from what you do <span className='text-green-500'>consistently</span>  </p>
              </div>
            </div>

            <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
          </div>
        </div> 

        {/* car2 */}
        <div>
          <div
            className="relative drop-shadow-xl md:w-40 md:h-40 w-36 h-36 overflow-hidden rounded-xl  bg-[#45ff20] m-4"
          >
            <div
              className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#203a22]"
            >
              <div>
                <p className="text-4xl font-bold mt-2 text-[#35e13a]">{parseInt(noOfHours)}<span className='text-sm'>hrs</span></p>
                <p className="mt-2 text-sm text-gray-400 text-center">Total Hours</p>
              </div>

            </div>
            <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
          </div>
          <div
            className="relative drop-shadow-xl md:w-40 md:h-40 w-36 h-36 overflow-hidden rounded-xl bg-[#ff3729] m-4 mt-7"
          >
            <div
              className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#5e2e2e]"
            >
              <div className='text-center'>
                <p className="text-6xl font-bold mt-2 text-[#fc2f2f]"><FontAwesomeIcon icon={faFireFlameCurved} /></p>
                <p className="mt-2 text-xl font-bold text-red-200 text-center">Day-{streaks}</p>
              </div>
            </div>
            <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default HomePage;
