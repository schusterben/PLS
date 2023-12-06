import React, { useState, useEffect } from 'react';

const BodyPartsFront = ({ id, onClick, initialClickedState }) => {
  const [isClicked, setIsClicked] = useState(initialClickedState);

  useEffect(() => {
    setIsClicked(initialClickedState);
  }, [initialClickedState]);

  const handleClick = () => {
    setIsClicked(!isClicked);
    onClick(id, !isClicked);
  };

  const getBodyPart = () => {
    switch (id) {
      case 'kopf_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="kopf_vorne"
            cx="52.273449"
            cy="20.800844"
            rx="21.162607"
            ry="18.630329"
          />
        );
      case 'hals_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="hals_vorne"
            width="14.108405"
            height="11.214372"
            x="44.495739"
            y="38.345917"
          />
        );
      case 'brust_links':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="brust_links"
            width="19.004412"
            height="34.00441"
            x="51.497795"
            y="49.497795"
          />
        );
      case 'brust_rechts':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="brust_rechts"
            width="19.004412"
            height="34.00441"
            x="32.497795"
            y="49.497795"
          />
        );
      case 'leiste_links_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="leiste_links_vorne"
            width="19.17296"
            height="23.152252"
            x="51.5"
            y="82.5"
          />
        );
      case 'leiste_rechts_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="leiste_rechts_vorne"
            width="19.004314"
            height="23.156567"
            x="32.497841"
            y="82.497841"
          />
        );
      case 'schulter_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="schulter_links_vorne"
            cx="73.978683"
            cy="50.102921"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'schulter_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="schulter_rechts_vorne"
            cx="28.035931"
            cy="49.017662"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'huefte_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="huefte_links_vorne"
            cx="72.53167"
            cy="106.53654"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'huefte_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="huefte_rechts_vorne"
            cx="30.568203"
            cy="107.98357"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'oberschenkel_rechts_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="oberschenkel_rechts_vorne"
            width="7.5968332"
            height="37.260658"
            x="45.877144"
            y="104.16055"
            transform="rotate(11.084325)"
          />
        );
      case 'unterschenkel_links_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="unterschenkel_links_vorne"
            width="7.5968332"
            height="31.472595"
            x="74.883072"
            y="154.83069"
          />
        );
      case 'oberschenkel_links_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="oberschenkel_links_vorne"
            width="7.5968332"
            height="37.260658"
            x="47.448467"
            y="122.23477"
            transform="rotate(-10.379456)"
          />
        );
      case 'unterschenkel_rechts_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="unterschenkel_rechts_vorne"
            width="7.5968332"
            height="31.472595"
            x="16.278927"
            y="155.19244"
          />
        );
      case 'knie_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="knie_links_vorne"
            cx="79.404991"
            cy="150.67052"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'knie_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="knie_rechts_vorne"
            cx="20.077335"
            cy="151.03227"
            rx="6.3306942"
            ry="5.6071858"
          />
        );
      case 'oberarm_links_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="oberarm_links_vorne"
            width="5.608892"
            height="25.70512"
            x="31.055252"
            y="85.254852"
            transform="matrix(0.84710696,-0.53142243,0.57047303,0.82131633,0,0)"
          />
        );
      case 'oberarm_rechts_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="oberarm_rechts_vorne"
            width="5.3013601"
            height="29.510719"
            x="43.3629"
            y="30.410044"
            transform="matrix(0.85927699,0.51151056,-0.44289859,0.89657171,0,0)"
          />
        );
      case 'ellbogen_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="ellbogen_rechts_vorne"
            cx="11.937879"
            cy="79.766754"
            rx="5.0645556"
            ry="4.521924"
          />
        );
      case 'ellbogen_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="ellbogen_links_vorne"
            cx="94.056038"
            cy="75.425705"
            rx="5.7880635"
            ry="4.883678"
          />
        );
      case 'fuss_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="fuss_rechts_vorne"
            cx="18.087696"
            cy="191.72961"
            rx="7.9585872"
            ry="6.5115709"
          />
        );
      case 'fuss_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="fuss_links_vorne"
            cx="79.947617"
            cy="191.0061"
            rx="7.9585872"
            ry="6.5115709"
          />
        );
      case 'auge_rechts':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="auge_rechts"
            cx="42.68697"
            cy="15.736297"
            rx="5.0645552"
            ry="4.521924"
          />
        );
      case 'auge_links':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="auge_links"
            cx="60.051159"
            cy="16.098051"
            rx="5.0645552"
            ry="4.521924"
          />
        );
      case 'mund':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="mund"
            width="19.17296"
            height="6.5115709"
            x="41.963459"
            y="25.322775"
          />
        );
      case 'unterarm_links_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="unterarm_links_vorne"
            width="5.7880635"
            height="31.472595"
            x="91.885506"
            y="78.138855"
          />
        );
      case 'unterarm_rechts_vorne':
        return (
          <rect
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="unterarm_rechts_vorne"
            width="5.7880635"
            height="31.472595"
            x="8.3203363"
            y="81.39463"
          />
        );
      case 'hand_links_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="hand_links_vorne"
            cx="94.056023"
            cy="112.50549"
            rx="7.9585872"
            ry="6.5115709"
          />
        );
      case 'hand_rechts_vorne':
        return (
          <ellipse
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="hand_rechts_vorne"
            cx="10.852616"
            cy="116.48479"
            rx="7.9585872"
            ry="6.5115709"
          />
        );
      case 'genital_vorne':
        return (
          <path
            style={{ fill: isClicked ? 'red' : '#808080', stroke: 'black', strokeWidth: 1 }}
            id="genital_vorne"
            d="m 36.785142,106.2725 h 29.999996 l -15.23523,12.96018 z"
            sodipodi: nodetypes="cccc"
          />
        );
      // Add more cases for other body parts
      default:
        return null;
    }
  };

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      {getBodyPart()}
    </g>
  );
};

export default BodyPartsFront;
