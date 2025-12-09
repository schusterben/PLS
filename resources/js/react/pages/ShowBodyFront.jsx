import React, { useState, useEffect } from "react";
import BodyPart from "../components/BodyPartsFront";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/BodyMap.css"; // <- Styles einbinden

/**
 * Component for managing and displaying body parts on the front side of a patient.
 */
const Component = () => {
  const [bodyParts, setBodyParts] = useState({});
  const navigate = useNavigate();
  const { token } = useStateContext();
  const location = useLocation();
  const staticPatientId = location.state?.patientId;
  const [isLoading, setIsLoading] = useState(true);

  /** Save click */
  const handleBodyPartClick = async (id, isClicked) => {
    setBodyParts((prev) => ({ ...prev, [id]: isClicked }));

    try {
      const response = await fetch("/api/save-body-part", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idpatient: staticPatientId,
          bodyPartId: id,
          isClicked,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to save body part ${id} for patient ${staticPatientId}`);
      }
    } catch (error) {
      console.error(`Error while saving body part ${id} for patient ${staticPatientId}`, error);
    }
  };

  /** Load initial state */
  const fetchInitialBodyParts = async () => {
    try {
      const response = await fetch(`/api/get-body-parts?idpatient=${staticPatientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const initialBodyParts = await response.json();
        setBodyParts(initialBodyParts || {});
      } else {
        console.error(`Failed to fetch initial body parts for patient ${staticPatientId}`);
      }
    } catch (error) {
      console.error(`Error while fetching initial body parts for patient ${staticPatientId}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialBodyParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Nav */
  const goToShowBodyBack = () => {
    navigate("/ShowBodyBack", { state: { patientId: staticPatientId } });
  };

  return (
    <div className="bodyparts-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Front</h1>

          <svg
            className="body-svg"
            viewBox="0 0 105 201"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="first-layer">
              {Object.entries(bodyParts).map(([part, clicked]) => (
                <BodyPart
                  key={part}
                  id={part}
                  onClick={handleBodyPartClick}
                  initialClickedState={clicked || false}
                />
              ))}
            </g>
          </svg>

          <button onClick={goToShowBodyBack}>Go to Back</button>
          
          <button
               className="back-to-triage-btn"
               onClick={() => {
               const from = location.state?.fromTriage || "/"; //fallback falls es nicht klappt
               navigate(`/${from}`, {
               state: { patientId: staticPatientId },
             });
            }}
            >
               Zurück zur Triage
          </button>
      </>
      )}
    </div>
  );
};

export default Component;
