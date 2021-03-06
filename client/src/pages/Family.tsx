import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Logout from "../components/Logout";
import Back from "../components/Back";
import { server } from "../util/permalink";
import "./Family.css";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import { sendJSON } from "../util/request";

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
    id: number;
    name: string;
    confirmed: boolean;
    relationship: relationship_types;
    initiator: boolean;
}

const Family: React.FC<FamilyProps> = ({ setLoggedIn }) => {
    const history = useHistory();

    const [family, setFamily] = useState<FamilyAttributes[]>([]);
    const [pendingFamily, setPendingFamily] = useState<FamilyAttributes[]>([]);

    const loadFamily = async (): Promise<FamilyAttributes[]> => {
        const response = await fetch(server + "family", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        return data as FamilyAttributes[];
    };

    const loadPendingFamily = async (): Promise<FamilyAttributes[]> => {
        const response = await fetch(server + "family/pending", {
            method: "GET",
            credentials: "include",
        });

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data as FamilyAttributes[];
    };

    const loadData = async () => {
        setFamily(await loadFamily());
        setPendingFamily(await loadPendingFamily());
    };

    useEffect(() => {
        (async () => {
            await loadData();
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
                <tbody>
                    {family.length > 0
                        ? family.map((fam) => (
                              <tr>
                                  <td>{fam.name}</td>
                                  <td>{fam.relationship.toLowerCase()}</td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
            <h2>Requests</h2>
            <table>
                <tbody>
                    {pendingFamily.length > 0
                        ? pendingFamily.map((fam) => (
                              <tr>
                                  <td>{fam.name}</td>
                                  <td>{fam.relationship.toLowerCase()}</td>
                                  {!fam.initiator ? (
                                      <>
                                          <td>
                                              <SecondaryButton
                                                  text="yes"
                                                  className="acceptBtn"
                                                  onClick={async () => {
                                                      await sendJSON(
                                                          server +
                                                              "family/add/confirm",
                                                          {
                                                              confirmed: true,
                                                              id: fam.id,
                                                          }
                                                      );
                                                      await loadData();
                                                  }}
                                              />
                                          </td>
                                          <td>
                                              <SecondaryButton
                                                  text="no"
                                                  className="declineBtn"
                                                  onClick={async () => {
                                                      await sendJSON(
                                                          server +
                                                              "family/add/confirm",
                                                          {
                                                              confirmed: false,
                                                              id: fam.id,
                                                          }
                                                      );
                                                      await loadData();
                                                  }}
                                              />
                                          </td>{" "}
                                      </>
                                  ) : null}
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
            <footer>
                <SecondaryButton
                    text="refresh"
                    onClick={async () => await loadData()}
                />
                <SecondaryButton
                    text="add"
                    onClick={() => history.push("/family/add")}
                />
            </footer>
        </div>
    );
};

export default Family;
