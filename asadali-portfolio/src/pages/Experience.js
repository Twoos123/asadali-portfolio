import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import uOttaHack from "../assets/uOttaHack.JPG";
import eightbyeight from "../assets/8x8.svg";
import SESA from "../assets/SESA.jpg";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import "../styles/Experience.css";

function Experience() {
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
          <h3 className="vertical-timeline-element-title"> 
            Fuze: an 8x8 Company
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            Backend Developer
          </h4>
          <p>Completed a CO-OP term at 8x8 as a Backend Developer, focusing on designing and implementing robust APIs to support scalable solutions.</p>
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
          <p>Coordinated logistics for uOttaHack 6, including food arrangements, networking activities, and challenge organization during the 36-hour event.</p>
          </VerticalTimelineElement>

        <VerticalTimelineElement 
          className="vertical-timeline-element--volunteer"
          date="2024 April - 2024 September"
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
          <p>Overseeing the Development team at uOttawa SESA, driving innovation and managing project execution to support the association's goals.</p>
          </VerticalTimelineElement>

        <VerticalTimelineElement 
          className="vertical-timeline-element--volunteer"
          date="2024 September - Present"
          iconStyle={{ background: '#00B34B', color: '#fff' }}
          icon={<VolunteerActivismIcon />}
        >
          <img src={SESA} alt="uOttawa SESA" className="timeline-image" />
          <h3 className="vertical-timeline-element-title"> 
            uOttawa Software Engineering Student Association (SESA)
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            Co-Director of SESA
          </h4>
          <p>Co-directing the uOttawa SESA team, collaborating on strategic initiatives, and ensuring the smooth operation of all association activities.</p>
          </VerticalTimelineElement>


        <VerticalTimelineElement 
          className="vertical-timeline-element--work"
          iconStyle={{ background: '#000000', color: '#fff' }}
          icon={<QuestionMarkIcon />}
        >
          <h3 className="vertical-timeline-element-title"> 
            Future experience coming soon!
          </h3>
        </VerticalTimelineElement>

      </VerticalTimeline>
      
    </div>
  );
}

export default Experience;
