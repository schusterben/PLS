import React, { useState, useEffect } from 'react';
import BodyPart from '../components/BodyPartsBack';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from "./../contexts/ContextProvider";

// Function to get default body parts
const getDefaultBodyParts = () => {
  return {
    hals_vorne: false,
    brust_links: false,
    brust_rechts: false,
    leiste_links_vorne: false,
    leiste_rechts_vorne: false,
    oberschenkel_rechts_vorne: false,
    unterschenkel_links_vorne: false,
    oberschenkel_links_vorne: false,
    unterschenkel_rechts_vorne: false,
    oberarm_links_vorne: false,
    oberarm_rechts_vorne: false,
    unterarm_links_vorne: false,
    unterarm_rechts_vorne: false,
    genital_vorne: false,
    kopf_vorne: false,
    schulter_links_vorne: false,
    schulter_rechts_vorne: false,
    huefte_links_vorne: false,
    huefte_rechts_vorne: false,
    knie_links_vorne: false,
    knie_rechts_vorne: false,
    ellbogen_rechts_vorne: false,
    ellbogen_links_vorne: false,
    fuss_rechts_vorne: false,
    fuss_links_vorne: false,
    auge_rechts: false,
    auge_links: false,
    mund: false,
    hand_links_vorne: false,
    hand_rechts_vorne: false,

    kopf_hinten: false,
    hals_hinten: false,
    ruecken_rechts: false,
    oberschenkel_rechts_hinten: false,
    unterschenkel_links_hinten: false,
    oberschenkel_links_hinten: false,
    unterschenkel_rechts_hinten: false,
    oberarm_links_hinten: false,
    oberarm_rechts_hinten: false,
    unterarm_links_hinten: false,
    unterarm_rechts_hinten: false,
    becken_links_hinten: false,
    ruecken_links: false,
    becken_rechts_hinten: false,
    genital_hinten: false,
    huefte_rechts_hinten: false,
    huefte_links_hinten: false,
    knie_links_hinten: false,
    knie_rechts_hinten: false,
    ellbogen_rechts_hinten: false,
    ellbogen_links_hinten: false,
    fuss_rechts_hinten: false,
    fuss_links_hinten: false,
    hand_links_hinten: false,
    hand_rechts_hinten: false,
    schulter_rechts_hinten: false,
    schulter_links_hinten: false,
    brustwirbel: false,
    lendenwirbel: false,
  };
};



// ... (your imports)

const Component = () => {
  const [bodyParts, setBodyParts] = useState(getDefaultBodyParts());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const staticPatientId = 1; // Static patient ID for testing
  const { token } = useStateContext();

  const handleBodyPartClick = async (id, isClicked) => {
    setBodyParts((prevBodyParts) => ({ ...prevBodyParts, [id]: isClicked }));

    try {
      const response = await fetch('/api/save-body-part', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idpatient: staticPatientId, bodyPartId: id, isClicked }),
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
      const response = await fetch(`/api/get-body-parts?idpatient=${staticPatientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const initialBodyPartsResponse = await response.json();
        console.log('API Response:', initialBodyPartsResponse);

        const initialBodyParts = extractBodyParts(initialBodyPartsResponse);
        setBodyParts(Object.keys(initialBodyParts).length > 0 ? initialBodyParts : getDefaultBodyParts());
      } else {
        console.error(`Failed to fetch initial body parts for patient ${staticPatientId}`);
        setError('Failed to fetch initial body parts. Please try again later.');
      }
    } catch (error) {
      console.error(`Error while fetching initial body parts for patient ${staticPatientId}`, error);
      setError('Error connecting to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractBodyParts = (response) => {
    const bodyParts = {};
    for (const key in response) {
      if (key !== 'idbody' && key !== 'idpatient') {
        bodyParts[key] = response[key];
      }
    }
    return bodyParts;
  };

  useEffect(() => {
    fetchInitialBodyParts();
  }, []);

  const goToShowBodyFront = () => {
    navigate('/ShowBodyFront');
  };

  return (
    <div className="bodyparts-container" style={{ paddingTop: '40px' }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Back</h1>
          {error ? (
            <>
              <p style={{ color: 'red' }}>{error}</p>
              <p>Displaying default body parts:</p>
            </>
          ) : null}
          <svg
            className="body-svg"
            viewBox="0 0 105 201"
            width="100%"
            //height="auto"
            preserveAspectRatio="xMidYMid meet"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="first-layer">
              {Object.entries(bodyParts).map(([part, clicked]) => (
                <BodyPart key={part} id={part} onClick={handleBodyPartClick} initialClickedState={clicked || false} />
              ))}
            </g>
          </svg>
          <div>
          <button onClick={goToShowBodyFront}>Go to Back</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Component;
