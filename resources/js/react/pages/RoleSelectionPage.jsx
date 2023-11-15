import { Fragment, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

export default function RoleSelection() {
    const { user } = useStateContext();
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [nextPage, setNextPage] = useState("");
    const [submitted, setSubmitted] = useState("");

    const roles = [];

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleRoleChange = (item) => {
        setSelectedRole(item.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setSubmitted(selectedRole);
    };

    return (
        <div>
            <h3>Willkommen bei der Rolenauswahl</h3>
            <h4>User {user.name} im Einsatz für</h4>
            {/* TODO: Load Operations from DB */}
            <select
                value={selectedOption}
                onChange={handleOptionChange}
                style={{ textAlign: "center" }}
            >
                <option value="">Einsatz auswählen</option>
                <option value="test">test</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            <p>in Funktion als</p>
            <select
                value={selectedRole}
                onChange={handleRoleChange}
                style={{ textAlign: "center" }}
            >
                <option value="">Rolle auswählen</option>
                <option value="Einsatzleiter">Einsatzleiter</option>
                <option value="Triage">Triage</option>
                <option value="San-Hist">San-Hist</option>
                <option value="Transport">Transport</option>
                <option value="Betreuung">Betreuung</option>
                <option value="Leitstelle">Leitstelle</option>
            </select>
            <form
                onSubmit={handleSubmit}
                style={{
                    position: "absolute",
                    bottom: "50px",
                    left: "0",
                    width: "100%",
                    textAlign: "center",
                    padding: "0",
                }}
            >
                <button type="submit">Bestätigen</button>
            </form>
            {submitted.toUpperCase() == "TRIAGE" ? (
                <Navigate to="/ScanPatient" />
            ) : submitted.toUpperCase() == "" ? (
                ""
            ) : (
                <Navigate to="/NotFound" />
            )}
        </div>
    );
}
