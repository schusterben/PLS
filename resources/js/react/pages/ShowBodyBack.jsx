import React, { useState } from 'react';
import BodyPart from '../components/BodyPartsBack';
import {useNavigate } from 'react-router-dom';



const Component = () => {
  const [bodyParts, setBodyParts] = useState({});
  const navigate = useNavigate();

  const handleBodyPartClick = (id, isClicked) => {
    setBodyParts({ ...bodyParts, [id]: isClicked });
  };

  const goToShowBodyFront = () => {
    navigate('/ShowBodyFront');
  };


  return (
    <div className="bodyparts-container" style={{ paddingTop: '40px' }}>
      <h1>Back</h1>
      <svg className="body-svg" viewBox="0 0 103 202" preserveAspectRatio="xMidYMid meet" version="1.1" xmlns="http://www.w3.org/2000/svg" >
        {/* First Layer */}
        <g className="first-layer">
        <BodyPart id="kopf_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="hals_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="ruecken_rechts" onClick={handleBodyPartClick} />
          <BodyPart id="oberschenkel_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="unterschenkel_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="oberschenkel_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="unterschenkel_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="oberarm_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="oberarm_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="unterarm_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="unterarm_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="becken_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="ruecken_links" onClick={handleBodyPartClick} />
          <BodyPart id="becken_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="genital_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="huefte_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="huefte_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="knie_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="knie_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="ellbogen_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="ellbogen_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="fuss_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="fuss_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="hand_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="hand_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="schulter_rechts_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="schulter_links_hinten" onClick={handleBodyPartClick} />
          <BodyPart id="brustwirbel" onClick={handleBodyPartClick} />
          <BodyPart id="lendenwirbel" onClick={handleBodyPartClick} />
          {/* ... other BodyPart components for the first layer ... */}
        </g>

        {/* Second Layer */}
        <g className="second-layer">




        </g>
      </svg>

      <div>
        <h2>Clicked Body Parts</h2>
        <ul>
          {Object.entries(bodyParts).map(([part, clicked]) => (
            <li key={part}>{`${part}: ${clicked ? 'Clicked' : 'Not Clicked'}`}</li>
          ))}
        </ul>
      </div>

      <button onClick={goToShowBodyFront}>Go to Front</button>




    </div>
  );
};

export default Component;
