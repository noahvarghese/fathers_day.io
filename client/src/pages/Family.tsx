import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Logout from "../components/Logout";
import Back from "../components/Back";
import { server } from "../util/permalink";
import "./Family.css";
import SecondaryButton from "../components/Buttons/SecondaryButton";

export enum relationship_types {
    Husband = "HUSBAND",
    Wife = "WIFE",
    Child = "CHILD",
    GrandChild = "GRANDCHILD",
    GreatGrandChild = "GREATGRANDCHILD",
    Parent = "PARENT",
    GrandParent = "GRANDPARENT",
    GreatGrandParent = "GREATGRANDPARENT",
    Partner = "PARTNER",
}

interface FamilyProps {
    setLoggedIn: () => void;
}

interface FamilyAttributes {
    name: string;
    confirmed: boolean;
    relationship: relationship_types;
}

const Family: React.FC<FamilyProps> = ({ setLoggedIn }) => {
    const history = useHistory();

    const [family, setFamily] = useState<FamilyAttributes[]>([]);
    const [pendingFamily, setPendingFamily] = useState<FamilyAttributes[]>([]);

    const loadFamily = async (): Promise<FamilyAttributes[]> => {
        const response = await fetch(server + "family", {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        return data as FamilyAttributes[];
    };

    const loadPendingFamily = async (): Promise<FamilyAttributes[]> => {
        const response = await fetch(server + "family/pending", {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();
        return data as FamilyAttributes[];
    };

    useEffect(() => {
        (async () => {
            setFamily(await loadFamily());
            setPendingFamily(await loadPendingFamily());
        })();
    }, []);

    return (
        <div className="Family">
            <nav>
                <Back />
                <Link to="/home">home</Link>
                <Logout setLoggedIn={setLoggedIn} />
            </nav>
            <h1>Family</h1>
            <table>
                {family.map((fam) => (
                    <tr>
                        <td>{fam.name}</td>
                        <td>{fam.relationship.toLowerCase()}</td>
                    </tr>
                ))}
            </table>
            <h2>Requests</h2>
            <table>
                {pendingFamily.map((fam) => (
                    <tr>
                        <td>{fam.name}</td>
                        <td>{fam.relationship.toLowerCase()}</td>
                        <td>
                            <SecondaryButton text="yes" className="acceptBtn" />
                        </td>
                        <td>
                            <SecondaryButton text="no" className="declineBtn" />
                        </td>
                    </tr>
                ))}
            </table>
            <footer>
                <SecondaryButton
                    text="add"
                    onClick={() => history.push("/family/add")}
                />
            </footer>
        </div>
    );
};

export default Family;
