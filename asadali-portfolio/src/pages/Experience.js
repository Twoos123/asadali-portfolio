import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping, FaQuestion } from 'react-icons/fa';
import uOttaHack from "../assets/uOttaHack.JPG";
import eightbyeight from "../assets/8x8.svg";
import SESA from "../assets/SESA.jpg";

function Experience() {
  return (
    <div className="relative bg-blue-800 bg-opacity-60">
      <div className='py-16 text-center'>
        <h1 className="text-4xl font-bold text-gray-100">Experience</h1>
      </div>
      <VerticalTimeline lineColor="#ffffff">
        <VerticalTimelineElement 
          className="vertical-timeline-element--work"
          date={<span className="text-gray-100">2024 January - 2024 May</span>}
          iconStyle={{ background: '#e9d35b', color: '#fff' }}
          icon={<FaBriefcase />}
          contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-100">Fuze: an 8x8 Company</h3>
              <h4 className="text-lg text-gray-300 mb-2">Backend Developer</h4>
              <p className="text-gray-200">Completed a CO-OP term at 8x8 as a Backend Developer, focusing on designing and implementing robust APIs to support scalable solutions.</p>
            </div>
            <img src={eightbyeight} alt="Fuze: an 8x8 Company" className="w-24 h-auto ml-4" />
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement 
          className="vertical-timeline-element--volunteer"
          date={<span className="text-gray-100">2023 June - 2024 March</span>}
          iconStyle={{ background: '#00B34B', color: '#fff' }}
          icon={<FaHandsHelping />}
          contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-100">uOttaHack 6 Logistics Coordinator</h3>
              <h4 className="text-lg text-gray-300 mb-2">Ottawa's Largest Hackathon</h4>
              <p className="text-gray-200">Coordinated logistics for uOttaHack 6, including food arrangements, networking activities, and challenge organization during the 36-hour event.</p>
            </div>
            <img src={uOttaHack} alt="uOttaHack 6" className="w-24 h-auto ml-4" />
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement 
          className="vertical-timeline-element--volunteer"
          date={<span className="text-gray-100">2024 April - 2024 September</span>}
          iconStyle={{ background: '#00B34B', color: '#fff' }}
          icon={<FaHandsHelping />}
          contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-100">uOttawa Software Engineering Student Association (SESA)</h3>
              <h4 className="text-lg text-gray-300 mb-2">VP of Development</h4>
              <p className="text-gray-200">Overseeing the Development team at uOttawa SESA, driving innovation and managing project execution to support the association's goals.</p>
            </div>
            <img src={SESA} alt="uOttawa SESA" className="w-24 h-auto ml-4" />
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement 
          className="vertical-timeline-element--volunteer"
          date={<span className="text-gray-100">2024 September - Present</span>}
          iconStyle={{ background: '#00B34B', color: '#fff' }}
          icon={<FaHandsHelping />}
          contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-100">uOttawa Software Engineering Student Association (SESA)</h3>
              <h4 className="text-lg text-gray-300 mb-2">Co-Director of SESA</h4>
              <p className="text-gray-200">Co-directing the uOttawa SESA team, collaborating on strategic initiatives, and ensuring the smooth operation of all association activities.</p>
            </div>
            <img src={SESA} alt="uOttawa SESA" className="w-24 h-auto ml-4" />
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement 
          iconStyle={{ background: '#000000', color: '#fff' }}
          icon={<FaQuestion />}
          contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
        >
          <h3 className="text-xl font-semibold text-gray-100">Future experience coming soon!</h3>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default Experience;
