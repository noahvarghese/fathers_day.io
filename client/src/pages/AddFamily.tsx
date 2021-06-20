import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Buttons/PrimaryButton";
import "./AddFamily.css";
import { relationship_types } from "./Family";
import Back from "../components/Back";
import { Link, useHistory } from "react-router-dom";
import Logout from "../components/Logout";
import { server } from "../util/permalink";
import { sendJSON } from "../util/request";

interface AddFamilyState {
    email: string;
    relationship: relationship_types | "";
}

interface AddFamilyProps {
    setLoggedIn: () => void;
}

const AddFamily: React.FC<AddFamilyProps> = ({ setLoggedIn }) => {
    const history = useHistory();

    const [addFamilyState, setAddFamilyState] = useState<AddFamilyState>({
        email: "",
        relationship: "",
    });

    const addFamily = async () => {
        await sendJSON(server + "family/add", addFamilyState);
        history.goBack();
    };

    return (
        <div className="AddFamily">
            <nav>
                <Back />
                <Link to="/home">home</Link>
                <Logout setLoggedIn={setLoggedIn} />
            </nav>
            <h1>Add Family</h1>
            <form>
                <Input
                    type="email"
                    name="email"
                    value={addFamilyState.email}
                    onChange={(e) =>
                        setAddFamilyState({
                            ...addFamilyState,
                            email: e.target.value,
                        })
                    }
                />
                <Input
                    type="text"
                    name="relationship"
                    value={addFamilyState.relationship}
                    onChange={(e) =>
                        setAddFamilyState({
                            ...addFamilyState,
                            relationship: e.target.value as relationship_types,
                        })
                    }
                />
                <Button text="add" onClick={addFamily} />
            </form>
        </div>
    );
};

export default AddFamily;
