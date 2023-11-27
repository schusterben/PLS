import React, { useState, useEffect } from 'react';
import BodyPart from '../components/BodyPartsFront';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from "./../contexts/ContextProvider";

const Component = () => {
  const [bodyParts, setBodyParts] = useState({});
  const navigate = useNavigate();
  const staticPatientId = 3; // Static patient ID for testing
  const { token } = useStateContext();
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const handleBodyPartClick = async (id, isClicked) => {
    setBodyParts({ ...bodyParts, [id]: isClicked });

    // Make an API request to save the clicked body part immediately
    try {
        const response = await fetch('/api/save-body-part', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bodyPartId: id, isClicked }),
        });

        if (response.ok) {
            console.log(`Body part ${id} saved successfully for patient ${staticPatientId}!`);
        } else {
            console.error(`Failed to save body part ${id} for patient ${staticPatientId}`);
        }
    } catch (error) {
        console.error(`Error while saving body part ${id} for patient ${staticPatientId}`, error);
    }
};


const fetchInitialBodyParts = async () => {
  try {
    const response = await fetch(`/get-body-parts?patient_id=${staticPatientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const initialBodyParts = await response.json();
      setBodyParts(initialBodyParts);
    } else {
      console.error(`Failed to fetch initial body parts for patient ${staticPatientId}`);
    }
  } catch (error) {
    console.error(`Error while fetching initial body parts for patient ${staticPatientId}`, error);
  } finally {
    setIsLoading(false);
  }
};





  // Fetch initial body parts when the component mounts
  useEffect(() => {
    fetchInitialBodyParts();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  // Function to navigate to the back page
  const goToShowBodyBack = () => {
    navigate('/ShowBodyBack');
  };

  return (
    <div className="bodyparts-container" style={{ paddingTop: '40px' }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Front</h1>
          <svg className="body-svg" viewBox="0 0 105 201" preserveAspectRatio="xMidYMid meet" version="1.1" xmlns="http://www.w3.org/2000/svg" >
            {/* First Layer */}
            <g className="first-layer">
              <BodyPart id="hals_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="brust_links" onClick={handleBodyPartClick} />
              <BodyPart id="brust_rechts" onClick={handleBodyPartClick} />
              <BodyPart id="leiste_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="leiste_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="oberschenkel_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="unterschenkel_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="oberschenkel_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="unterschenkel_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="oberarm_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="oberarm_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="unterarm_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="unterarm_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="genital_vorne" onClick={handleBodyPartClick} />



            </g>

            {/* Second Layer */}
            <g className="second-layer">

              <BodyPart id="kopf_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="schulter_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="schulter_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="huefte_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="huefte_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="knie_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="knie_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="ellbogen_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="ellbogen_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="fuss_rechts_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="fuss_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="auge_rechts" onClick={handleBodyPartClick} />
              <BodyPart id="auge_links" onClick={handleBodyPartClick} />
              <BodyPart id="mund" onClick={handleBodyPartClick} />
              <BodyPart id="hand_links_vorne" onClick={handleBodyPartClick} />
              <BodyPart id="hand_rechts_vorne" onClick={handleBodyPartClick} />
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

          <button onClick={goToShowBodyBack}>Go to Back</button>
        </>
      )}
    </div>
  );

};

export default Component;