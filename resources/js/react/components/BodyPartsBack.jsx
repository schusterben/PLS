import React, { useState, useEffect } from "react";

/**
 * The `BodyPart` component represents a clickable body part graphic element.
 * It allows toggling the clicked state and handles rendering based on the ID.
 *
 * @param {object} props - Component props.
 * @param {string} props.id - The unique identifier for the body part.
 * @param {function} props.onClick - Callback function triggered when the body part is clicked.
 * @param {boolean} props.initialClickedState - The initial clicked state of the body part.
 */
const BodyPart = ({ id, onClick, initialClickedState }) => {
    // State to manage the clicked state of the body part
    const [isClicked, setIsClicked] = useState(initialClickedState);

    // Effect to update the clicked state if it changes externally
    useEffect(() => {
        setIsClicked(initialClickedState);
    }, [initialClickedState]);

    // Handle click event for the body part
    const handleClick = () => {
        setIsClicked(!isClicked);

        // Call the provided onClick callback with the ID and updated clicked state
        onClick(id, !isClicked);
    };

    /**
     * Render the SVG element for the specific body part based on its ID.
     * You can add more cases for other body parts following the same structure.
     * @returns {JSX.Element|null} The SVG element for the body part or null if ID doesn't match.
     */
    const getBodyPart = () => {
        switch (id) {
            case "hals_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="hals_hinten"
                        width="14.108405"
                        height="11.214372"
                        x="43.410477"
                        y="38.345917"
                    />
                );
            case "ruecken_links":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="ruecken_links"
                        width="11.937881"
                        height="43.410473"
                        x="30.387331"
                        y="49.560295"
                    />
                );
            case "oberschenkel_links_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="oberschenkel_links_hinten"
                        width="7.5968332"
                        height="37.260658"
                        x="44.81213"
                        y="104.36919"
                        transform="rotate(11.084325)"
                    />
                );
            case "unterschenkel_rechts_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="unterschenkel_rechts_hinten"
                        width="7.5968332"
                        height="31.472595"
                        x="73.797806"
                        y="154.83069"
                    />
                );
            case "oberschenkel_rechts_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="oberschenkel_rechts_hinten"
                        width="7.5968332"
                        height="37.260658"
                        x="46.380962"
                        y="122.03924"
                        transform="rotate(-10.379456)"
                    />
                );
            case "unterschenkel_links_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="unterschenkel_links_hinten"
                        width="7.5968332"
                        height="31.472595"
                        x="15.193666"
                        y="155.19244"
                    />
                );
            case "oberarm_rechts_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="oberarm_rechts_hinten"
                        width="5.608892"
                        height="25.70512"
                        x="30.162931"
                        y="84.677483"
                        transform="matrix(0.84710696,-0.53142243,0.57047303,0.82131633,0,0)"
                    />
                );
            case "oberarm_links_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="oberarm_links_hinten"
                        width="5.3013601"
                        height="29.510719"
                        x="42.386909"
                        y="30.966864"
                        transform="matrix(0.85927699,0.51151056,-0.44289859,0.89657171,0,0)"
                    />
                );
            case "unterarm_rechts_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="unterarm_rechts_hinten"
                        width="5.7880635"
                        height="31.472595"
                        x="90.80024"
                        y="78.138855"
                    />
                );
            case "unterarm_links_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="unterarm_links_hinten"
                        width="5.7880635"
                        height="31.472595"
                        x="7.235074"
                        y="81.39463"
                    />
                );
            case "becken_rechts_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="becken_rechts_hinten"
                        width="12.113685"
                        height="18.625257"
                        x="58.154491"
                        y="93.244614"
                    />
                );
            case "ruecken_rechts":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="ruecken_rechts"
                        width="11.937881"
                        height="43.410473"
                        x="58.242386"
                        y="49.560295"
                    />
                );
            case "becken_links_hinten":
                return (
                    <rect
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="becken_links_hinten"
                        width="11.763668"
                        height="18.636993"
                        x="29.93181"
                        y="93.238747"
                    />
                );
            case "genital_hinten":
                return (
                    <path
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="genital_hinten"
                        d="m 34.092779,113.31881 h 30 l -15.235231,12.96018 z"
                        sodipodi:nodetypes="cccc"
                    />
                );
            case "huefte_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="huefte_links_hinten"
                        cx="28.035913"
                        cy="113.40987"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "huefte_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="huefte_rechts_hinten"
                        cx="69.999382"
                        cy="113.77161"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "knie_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="knie_rechts_hinten"
                        cx="77.234451"
                        cy="150.67052"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "hand_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="hand_links_hinten"
                        cx="9.767354"
                        cy="116.48479"
                        rx="7.9585872"
                        ry="6.5115709"
                    />
                );
            case "hand_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="hand_rechts_hinten"
                        cx="92.970757"
                        cy="112.50549"
                        rx="7.9585872"
                        ry="6.5115709"
                    />
                );
            case "fuss_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="fuss_links_hinten"
                        cx="17.002436"
                        cy="191.72961"
                        rx="7.9585872"
                        ry="6.5115709"
                    />
                );
            case "ellbogen_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="ellbogen_rechts_hinten"
                        cx="92.970772"
                        cy="75.425705"
                        rx="5.7880635"
                        ry="4.883678"
                    />
                );
            case "ellbogen_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="ellbogen_links_hinten"
                        cx="10.852616"
                        cy="79.766754"
                        rx="5.0645556"
                        ry="4.521924"
                    />
                );
            case "knie_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="knie_links_hinten"
                        cx="18.992075"
                        cy="151.03227"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "schulter_links_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="schulter_links_hinten"
                        cx="26.95067"
                        cy="49.017662"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "kopf_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="kopf_hinten"
                        cx="51.188187"
                        cy="20.800844"
                        rx="21.162607"
                        ry="18.630329"
                    />
                );
            case "schulter_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="schulter_rechts_hinten"
                        cx="72.893417"
                        cy="50.102921"
                        rx="6.3306942"
                        ry="5.6071858"
                    />
                );
            case "fuss_rechts_hinten":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="fuss_rechts_hinten"
                        cx="78.86235"
                        cy="191.0061"
                        rx="7.9585872"
                        ry="6.5115709"
                    />
                );
            case "brustwirbel":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="brustwirbel"
                        cx="50.392338"
                        cy="70.472542"
                        rx="6.5475974"
                        ry="20.232826"
                    />
                );
            case "lendenwirbel":
                return (
                    <ellipse
                        style={{
                            fill: isClicked ? "red" : "#808080",
                            stroke: "black",
                            strokeWidth: 1,
                        }}
                        id="lendenwirbel"
                        cx="50.00864"
                        cy="101.80787"
                        rx="7.0820742"
                        ry="9.7679596"
                    />
                );
            // Add more cases for other body parts
            default:
                return null;
        }
    };

    return (
        <g onClick={handleClick} style={{ cursor: "pointer" }}>
            {getBodyPart()}
        </g>
    );
};

export default BodyPart;
