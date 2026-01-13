// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import { useParams } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import humanizeDuration from "humanized-duration";
// import Youtube from "react-youtube";

// const Player = () => {
//   const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
//   const { courseId } = useParams();
//   const [courseDate, setCourseData] = useState(null);
//   const [openSection, setOpenSection] = useState({});
//   const [playerData, setPlayerData] = useState(null);

//   const getCourseData = () => {
//     enrolledCourses.map((course) => {
//       if (course._id === courseId) {
//         setCourseData(course);
//       }
//     });
//   };

//   const toggleSection = (index) => {
//     setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
//   };

//   useEffect(() => {
//     getCourseData();
//   }, [enrolledCourses]);

//   return (
//     <>
//       <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
//         {/* left column */}
//         <div className="text-gray-800">
//           <h2 className="text-xl font-semibold">Course Structure</h2>
//           <div className="pt-5">
//             {courseDate &&
//               courseDate.courseContent.map((chapter, index) => (
//                 <div
//                   key={index}
//                   className="border border-gray-300 bg-white mb-2 rounded"
//                 >
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                     onClick={() => toggleSection(index)}
//                   >
//                     <div className="flex items-center gap-2">
//                       <img
//                         className={`transform transition-transform ${
//                           openSection[index] ? "rotate-180" : ""
//                         }`}
//                         src={assets.down_arrow_icon}
//                         alt="arrow icon"
//                       />
//                       <p className="font-medium md:text-base text-sm">
//                         {chapter.chapterTitle}
//                       </p>
//                     </div>
//                     <p className="text-sm md:text-default">
//                       {chapter.chapterContent.length} lectures -{" "}
//                       {calculateChapterTime(chapter)}
//                     </p>
//                   </div>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                       openSection[index] ? "max-h-96" : "max-h-0"
//                     }`}
//                   >
//                     <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300 ">
//                       {chapter.chapterContent.map((lecture, index) => (
//                         <li key={index} className="flex items-start gap-2 py-1">
//                           <img
//                             src={
//                               false ? assets.blue_tick_icon : assets.play_icon
//                             }
//                             alt="play icon"
//                             className="w-4 h-4 mt-1"
//                           />
//                           <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
//                             <p>{lecture.lectureTitle}</p>
//                             <div className="flex gap-2">
//                               {lecture.lectureUrl && (
//                                 <p
//                                   onClick={() =>
//                                     setPlayerData({
//                                       ...lecture,
//                                       chapter: index + 1,
//                                       lecture: i + 1,
//                                     })
//                                   }
//                                   className="text-blue-500 cursor-pointer"
//                                 >
//                                   Watch
//                                 </p>
//                               )}
//                               <p>
//                                 {humanizeDuration(
//                                   lecture.lectureDuration * 60 * 1000,
//                                   { units: ["h", "m"] }
//                                 )}{" "}
//                               </p>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//         {/* Right column */}
//         <div className="md:mt-10">
//           {playerData ? (
//             <div>
//               <Youtube
//                 videoId={playerData.lectureUrl.split("/").pop()}
//                 iframeClassName="w-full aspect-video"
//               />

//               <div className="flex justify-between items-center mt-1">
//                 <p>
//                   {playerData.chapter}.{playerData.lecture}{" "}
//                   {playerData.lectureTitle}
//                 </p>

//                 <button className="text-blue-600">Mark Complete</button>
//               </div>
//             </div>
//           ) : (
//             <img src={courseDate ? courseDate.courseThumbnail : ""} alt="" />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Player;

// import React, { useContext, useEffect, useState, useRef } from "react";
// import { AppContext } from "../../context/AppContext";
// import { useParams } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import humanizeDuration from "humanized-duration";
// import Youtube from "react-youtube";
// import Footer from "../../components/student/Footer";
// import Rating from "../../components/student/Rating";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "../../components/student/Loading.jsx";

// const Player = () => {
//   const {
//     enrolledCourses,
//     calculateChapterTime,
//     backendUrl,
//     getToken,
//     userData,
//     fetchEnrolledCourses,
//   } = useContext(AppContext);

//   const { courseId } = useParams();

//   const [courseData, setCourseData] = useState(null);
//   const [openSection, setOpenSection] = useState({});
//   const [playerData, setPlayerData] = useState(null);
//   const [progressData, setProgressData] = useState(null);
//   const [initialRating, setInitialRating] = useState(0);

//   const getCourseData = () => {
//     enrolledCourses.map((course) => {
//       if (course._id === courseId) {
//         setCourseData(course);
//         course.courseRatings.map((item) => {
//           if (item.userId === userData._id) {
//             setInitialRating(item.rating);
//           }
//         });
//       }
//     });
//   };

//   useEffect(() => {
//     if (enrolledCourses.length > 0) {
//       getCourseData();
//     }
//   }, [enrolledCourses]);

//   // ✅ Correct way to get course
//   useEffect(() => {
//     if (!enrolledCourses.length) return;

//     const course = enrolledCourses.find((c) => c._id === courseId);

//     setCourseData(course);
//   }, [enrolledCourses, courseId]);

//   const toggleSection = (index) => {
//     setOpenSection((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const playerRef = useRef(null);

//   const onPlayerReady = (event) => {
//     playerRef.current = event.target;
//   };

//   useEffect(() => {
//     if (playerRef.current && playerData?.lectureUrl) {
//       const videoId = playerData.lectureUrl.split("/").pop();
//       playerRef.current.loadVideoById(videoId);
//     }
//   }, [playerData]);

//   const markLectureCompleted = async (lectureId) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         backendUrl + "/api/user/update-course-progress",
//         { courseId, lectureId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getCourseProgress();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const getCourseProgress = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         backendUrl + "/api/user/get-course-progress",
//         { courseId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         setProgressData(data.progressData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleRate = async (rating) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         backendUrl + "/api/user/add-rating",
//         { courseId, rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         fetchEnrolledCourses();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getCourseProgress();
//   }, []);

//   return courseData ? (
//     <>
//       <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
//         {/* LEFT COLUMN */}
//         <div className="text-gray-800">
//           <h2 className="text-xl font-semibold">Course Structure</h2>

//           <div className="pt-5">
//             {courseData?.courseContent.map((chapter, chapterIndex) => (
//               <div
//                 key={chapterIndex}
//                 className="border border-gray-300 bg-white mb-2 rounded"
//               >
//                 <div
//                   className="flex items-center justify-between px-4 py-3 cursor-pointer"
//                   onClick={() => toggleSection(chapterIndex)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <img
//                       className={`transition-transform ${
//                         openSection[chapterIndex] ? "rotate-180" : ""
//                       }`}
//                       src={assets.down_arrow_icon}
//                       alt=""
//                     />
//                     <p className="font-medium">{chapter.chapterTitle}</p>
//                   </div>

//                   <p className="text-sm">
//                     {chapter.chapterContent.length} lectures –{" "}
//                     {calculateChapterTime(chapter)}
//                   </p>
//                 </div>

//                 <div
//                   className={`overflow-hidden transition-all duration-300 ${
//                     openSection[chapterIndex] ? "max-h-96" : "max-h-0"
//                   }`}
//                 >
//                   <ul className="pl-6 py-2 border-t">
//                     {chapter.chapterContent.map((lecture, lectureIndex) => (
//                       <li
//                         key={lectureIndex}
//                         className="flex justify-between items-center py-1 text-sm"
//                       >
//                         <p>{lecture.lectureTitle}</p>

//                         <div className="flex gap-3 items-center">
//                           {lecture.lectureUrl && (
//                             <button
//                               onClick={() =>
//                                 setPlayerData({
//                                   ...lecture,
//                                   chapter: chapterIndex + 1,
//                                   lecture: lectureIndex + 1,
//                                 })
//                               }
//                               className="text-blue-600 cursor-pointer"
//                             >
//                               Watch
//                             </button>
//                           )}

//                           <span className="text-gray-500">
//                             {humanizeDuration(
//                               lecture.lectureDuration * 60 * 1000,
//                               { units: ["h", "m"] }
//                             )}
//                           </span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center gap-2 py-3 mt-10">
//             <h1 className="text-xl font-bold">Rate this Course:</h1>
//             <Rating initialRating={initialRating} onRate={handleRate} />
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="md:mt-10">
//           {playerData ? (
//             <div>
//               <Youtube
//                 videoId={playerData.lectureUrl.split("/").pop()}
//                 onReady={onPlayerReady}
//                 opts={{
//                   width: "100%",
//                   playerVars: { autoplay: 1 },
//                 }}
//                 iframeClassName="w-full aspect-video"
//               />

//               <div className="flex justify-between items-center mt-2">
//                 <p>
//                   {playerData.chapter}.{playerData.lecture}{" "}
//                   {playerData.lectureTitle}
//                 </p>

//                 <button
//                   onClick={() => markLectureCompleted(playerData.lectureId)}
//                   className="text-blue-600"
//                 >
//                   {progressData &&
//                   progressData.lectureCompleted.includes(playerData.lectureId)
//                     ? "Completed"
//                     : " Mark Complete"}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <img src={courseData?.courseThumbnail} alt="" />
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   ) : (
//     <Loading />
//   );
// };

// export default Player;

// Copu code from github
// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import { useParams } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import  humanizeDuration  from "humanize-duration";
// import YouTube from 'react-youtube'
// import Footer from "../../components/student/Footer";
// import Rating from "../../components/student/Rating";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "../../components/student/Loading";

// const Player = () => {

//   const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchEnrolledCourses} = useContext(AppContext)
//   const {courseId} = useParams();
//   const [courseData, setCourseData] = useState(null)
//   const [openSections, setOpenSections] = useState({})
//   const [playerData, setPlayerData] = useState(null)
//   const [progressData, setProgressData] = useState(null)
//   const [initialRating, setInitialRating] = useState(0)

//   const getCourseData = () =>{
//     enrolledCourses.map((course)=>{
//       if(course._id === courseId)
//       {
//         setCourseData(course)
// 		course.courseRatings.map((item)=>{
// 			if(item.userId === userData._id){
// 			setInitialRating(item.rating)
// 			}
// 		})
//       }
//     })
//   }

//   const toggleSection = (index) => {
// 		setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
// 	};

//   useEffect(()=>{
// 	if(enrolledCourses.length > 0){
// 		getCourseData()
// 	}
//   },[enrolledCourses])

//   const markLectureAsCompleted = async (lectureId) => {
// 	try {
// 		const token = await getToken();
// 		const {data} = await axios.post(backendUrl + '/api/user/update-course-progress',{courseId, lectureId}, {headers: {Authorization: `Bearer ${token}`}})

// 		if(data.success){
// 			// console.log("data palyer", data);
// 			toast.success(data.message)
// 			getCourseProgress()
// 		}else{
// 			toast.error(data.message)
// 		}
// 	} catch (error) {
// 		toast.error(error.message)
// 	}
//   }

//   const getCourseProgress = async () => {
// 	try {
// 		const token = await getToken();
// 		const {data} = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, {headers: {Authorization: `Bearer ${token}`}})

// 		if(data.success){
// 			setProgressData(data.progressData)
// 			toast.success(data.message)
// 		}else{
// 			toast.error(data.message)
// 		}
// 	} catch (error) {
// 		toast.error(error.message)
// 	}
//   }

//   const handleRate = async (rating)=>{
// 	try {
// 		const token = await getToken();

// 		const {data} = await axios.post(backendUrl + '/api/user/add-rating', {courseId, rating},{headers: {Authorization: `Bearer ${token}`}})
// 		console.log("data", data);

// 		if(data.success){
// 			toast.success(data.message)
// 			fetchEnrolledCourses();
// 		}
// 		else{
// 			toast.error(data.message)
// 		}

// 	} catch (error) {
// 		toast.error(error.message)
// 	}
//   }

//   useEffect(()=>{
// 	getCourseProgress();
//   },[])

// 	return courseData ? (
// 		<>
// 			<div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
// 				{/* Left column */}
// 				<div className="text-gray-800">
// 					<h2 className="text-xl font-semibold">Course Structure</h2>
// 					<div className="pt-5">
// 						{courseData &&  courseData.courseContent.map((chapter, index) => (
// 							<div
// 								className="border border-gray-300 bg-white mb-2 rounded"
// 								key={index}
// 							>
// 								<div
// 									className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
// 									onClick={() => toggleSection(index)}
// 								>
// 									<div className="flex items-center gap-2">
// 										<img
// 											className={`transform transition-transform ${
// 												openSections[index] ? "rotate-180" : ""
// 											}`}
// 											src={assets.down_arrow_icon}
// 											alt="down_arrow_icon"
// 										/>
// 										<p className="font-medium md:text-base text-sm">
// 											{chapter.chapterTitle}
// 										</p>
// 									</div>
// 									<p className="text-sm md:text-default">
// 										{chapter.chapterContent.length} lectures -{" "}
// 										{calculateChapterTime(chapter)}{" "}
// 									</p>
// 								</div>

// 								<div
// 									className={`overflow-hidden transition-all duration-300 ${
// 										openSections[index] ? "max-h-9g" : "max-h-0"
// 									}`}
// 								>
// 									<ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
// 										{chapter.chapterContent.map((lecture, i) => (
// 											<li key={i} className="flex items-start gap-2 py-1">
// 												<img onClick={() =>
// 																	setPlayerData({
//                                     ...lecture, chapter: index + 1, lecture: i+1
//                                   })}

// 													className="w-4 h-4 mt-1 cursor-pointer"
// 													src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
// 													alt="play_icon"
// 												/>
// 												<div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
// 													<p>{lecture.lectureTitle}</p>
// 													<div className="flex gap-2">
// 														{lecture.lectureUrl && (
// 															<p
// 																onClick={() =>
// 																	setPlayerData({
//                                     ...lecture, chapter: index + 1, lecture: i+1
//                                   })
// 																}
// 																className="text-blue-500 cursor-pointer"
// 															>
// 																Watch
// 															</p>
// 														)}
// 														<p>
// 															{humanizeDuration(
// 																lecture.lectureDuration * 60 * 1000,
// 																{ units: ["h", "m"] }
// 															)}
// 														</p>
// 													</div>
// 												</div>
// 											</li>
// 										))}
// 									</ul>
// 								</div>
// 							</div>
// 						))}
// 					</div>

//             <div className=" flex items-center gap-2 py-3 mt-10 ">
//               <h1 className="text-xl font-bold">Rate this Course:</h1>
//               <Rating initialRating={initialRating} onRate={handleRate}/>
//             </div>

// 				</div>

// 				{/* right column */}
// 				<div className="md:mt-10">
//           {playerData ? (
//             <div className="">
//               <YouTube videoId={playerData.lectureUrl.split('/').pop()}  iframeClassName="w-full aspect-video"/>

//               <div className="flex justify-between items-center mt-1">
//                 <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle} </p>
//                 <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark As Complete'}</button>
//               </div>
//             </div>
//           )
//           :
// 		//   in this image course thumbnail will be shown player icon will be shown the above thumbnail
//           <img src={courseData ? courseData.courseThumbnail : ''} alt="courseThumbnail" />

//         }
//         </div>
// 			</div>
//       <Footer/>
// 		</>
// 	)
// 	: <Loading/>;
// };

// export default Player;

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // Video states
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ------------------ Course Data ------------------ */
  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.forEach((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (enrolledCourses.length) getCourseData();
  }, [enrolledCourses]);

  /* ------------------ Course Progress ------------------ */
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ------------------ Rating ------------------ */
  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchEnrolledCourses();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ------------------ Helpers ------------------ */
  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getFirstLecture = () => {
    if (!courseData) return null;
    for (let i = 0; i < courseData.courseContent.length; i++) {
      const chapter = courseData.courseContent[i];
      if (chapter.chapterContent.length) {
        return {
          ...chapter.chapterContent[0],
          chapter: i + 1,
          lecture: 1,
        };
      }
    }
    return null;
  };

  const handleThumbnailClick = () => {
    const firstLecture = getFirstLecture();
    if (firstLecture) setPlayerData(firstLecture);
    else toast.info("No lectures available");
  };

  /* ------------------ YouTube ------------------ */
  useEffect(() => {
    if (playerData) {
      setIsLoadingVideo(true);
      setIsPlaying(false);
    }
  }, [playerData]);

  const onPlayerReady = (event) => {
    try {
      event.target.playVideo();
    } catch {}
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      setIsPlaying(true);
      setIsLoadingVideo(false);
    } else if (event.data === 3) {
      setIsLoadingVideo(true);
    } else {
      setIsPlaying(false);
      setIsLoadingVideo(false);
    }
  };

  const youtubeOpts = {
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  /* ------------------ UI ------------------ */
  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border rounded mb-2 bg-white">
                <div
                  onClick={() => toggleSection(index)}
                  className="flex justify-between px-4 py-3 cursor-pointer"
                >
                  <div className="flex gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      className={`transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      alt=""
                    />
                    <p>{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm">
                    {chapter.chapterContent.length} lectures —{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {openSections[index] && (
                  <ul className="pl-6 py-2 border-t">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex gap-2 py-1">
                        <img
                          src={
                            progressData?.lectureCompleted.includes(
                              lecture.lectureId
                            )
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          className="w-4 h-4 cursor-pointer"
                          onClick={() =>
                            setPlayerData({
                              ...lecture,
                              chapter: index + 1,
                              lecture: i + 1,
                            })
                          }
                          alt=""
                        />
                        <div className="flex justify-between w-full">
                          <p>{lecture.lectureTitle}</p>
                          <p>
                            {humanizeDuration(lecture.lectureDuration * 60000, {
                              units: ["h", "m"],
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-2 items-center">
            <h2 className="font-bold">Rate this course:</h2>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:mt-10">
          {playerData ? (
            <div className="relative">
              {isLoadingVideo && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/30 z-20">
                  <Loading />
                </div>
              )}

              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={youtubeOpts}
                iframeClassName="w-full aspect-video"
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
              />

              <div className="flex justify-between mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  className="text-blue-600"
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                >
                  {progressData?.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark As Complete"}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleThumbnailClick}
              className="relative cursor-pointer"
            >
              <img
                src={courseData.courseThumbnail}
                className="w-full aspect-video rounded"
                alt=""
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center">
                  <img src={assets.play_icon} className="w-8" alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
