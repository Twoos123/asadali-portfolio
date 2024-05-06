import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ProjectItem({ id, image, name }) {
  const navigate = useNavigate();
  return (
    <Link to={`/project/${id}`}>
      <div className="projectItem" onClick={() => {
        navigate("/project" + id);
        }}
      >
        <div style={{ backgroundImage: `url(${image})` }} className="bgImage" />
        <h1> {name} </h1>
      </div>
    </Link>
  );
}

export default ProjectItem;
