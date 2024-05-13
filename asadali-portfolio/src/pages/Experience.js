import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css"
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import uOttaHack from "../assets/uOttaHack.JPG"
import eightbyeight from "../assets/8x8.svg"
import SESA from "../assets/SESA.jpg"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import "../styles/Experience.css"
import LocationOnIcon from '@mui/icons-material/LocationOn'

function Experience() {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="experience">
      <div className='experience-header'>
        <h1>Experience</h1>
      </div>
      <VerticalTimeline lineColor="#3e497a">
        <VerticalTimelineElement 
          className="vertical-timeline-element--work"
          date="2024 January - 2024 May"
          iconStyle={{ background: '#e9d35b', color: '#fff' }}
          icon={<WorkIcon />}
        >

        <img src={eightbyeight} alt="Fuze: an 8x8 Company" className="timeline-image1" />
          <a href='https://maps.app.goo.gl/5vaXRxQEmYTNqU229' target="_blank" rel="noopener noreferrer">
            <div className="location-pin">
              <LocationOnIcon />
            </div>
          </a>
        <h3 className="vertical-timeline-element-title"> 
          Fuze: an 8x8 Company
        </h3>
        <h4 className="vertical-timeline-element-subtitle">
          Backend Developer
        </h4>
        <p> CO-OP term at 8x8 as a Backend Developer, implementing and designing APIs.</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement 
        className="vertical-timeline-element--volunteer"
        date="2023 June - 2024 March"
        iconStyle={{ background: '#00B34B', color: '#fff' }}
        icon={<VolunteerActivismIcon />}
      >
        <img src={uOttaHack} alt="uOttaHack 6" className="timeline-image" />
        <h3 className="vertical-timeline-element-title"> 
          uOttaHack 6 Logistics Coordinator
        </h3>

        <h4 className="vertical-timeline-element-subtitle">
          Ottawa's Largest Hackathon
        </h4>

        <p> Assisted with food selection, networking events, and challenges during the 36-hour hackathon.</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
        
        <div className='button-container'>
          <button onClick={handleShowMore} className='toggle-button'>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>

      <VerticalTimeline lineColor="#3e497a">
        {showMore && (
          <div className='additional-elements'>
            <VerticalTimelineElement 
              className="vertical-timeline-element--volunteer"
              date="2024 April - Present"
              iconStyle={{ background: '#00B34B', color: '#fff' }}
              icon={<VolunteerActivismIcon />}
            >
              <img src={SESA} alt="uOttawa SESA" className="timeline-image" />
              <h3 className="vertical-timeline-element-title"> 
                uOttawa Software Engineering Student Association (SESA)
              </h3>
              <h4 className="vertical-timeline-element-subtitle">
                VP of Development
              </h4>
              <p> Leading the Development team at uOttawa SESA.</p>
            </VerticalTimelineElement>

            <VerticalTimelineElement 
              className="vertical-timeline-element--work"
              iconStyle={{ background: '#000000', color: '#fff' }}
              icon={<QuestionMarkIcon />}
            >
              <h3 className="vertical-timeline-element-title"> 
                Future experience coming soon!
              </h3>
              <h4 className="vertical-timeline-element-subtitle">
              </h4>
              <p> </p>
            </VerticalTimelineElement>
          </div>
        )}
      </VerticalTimeline>
    </div>
  );
}

export default Experience;