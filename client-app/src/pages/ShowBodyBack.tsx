import { useState, useEffect } from 'react';
import BodyPart from '../components/BodyPartsBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { saveBodyPart, getBodyParts } from '../api/endpoints';

const ShowBodyBack = () => {
  const [bodyParts, setBodyParts] = useState<Record<string, number | boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const staticPatientId = location.state?.patientId;
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const handleBodyPartClick = async (id: string, isClicked: number | boolean) => {
    setBodyParts({ ...bodyParts, [id]: isClicked });
    try {
      await saveBodyPart(id, isClicked as number, staticPatientId, token!);
    } catch (error) {
      console.error(`Error while saving body part ${id}`, error);
    }
  };

  useEffect(() => {
    const fetchInitialBodyParts = async () => {
      try {
        const { data } = await getBodyParts(staticPatientId, token!);
        setBodyParts(data || {});
      } catch (error) {
        console.error('Error fetching body parts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialBodyParts();
  }, [staticPatientId, token]);

  const goToShowBodyFront = () => {
    navigate('/ShowBodyFront', { state: { patientId: staticPatientId } });
  };

  return (
    <div className="bodyparts-container" style={{ paddingTop: '40px' }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Back</h1>
          <svg
            className="body-svg"
            viewBox="0 0 103 202"
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
          <button onClick={goToShowBodyFront}>Go to Front</button>
        </>
      )}
    </div>
  );
};

export default ShowBodyBack;
