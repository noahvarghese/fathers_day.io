import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Back from "../components/Back";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import Input from "../components/Input";
import Logout from "../components/Logout";
import Error from "../components/Error";
import Success from "../components/Success";
import { server } from "../util/permalink";
import { sendJSON } from "../util/request";
import "./GiftCoupons.css";

interface GiftCouponsProps {
    setLoggedIn: () => void;
}

interface GiftOpts {
    to: { name: string; id: number };
    coupon: string;
    quantity: number | undefined;
}

const emptyGiftOpts = (): GiftOpts => ({
    to: { name: "", id: -1 },
    coupon: "",
    quantity: undefined,
});

const GiftCoupons: React.FC<GiftCouponsProps> = (props) => {
    const history = useHistory();
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [family, setFamily] = useState<{ name: string; id: number }[]>([]);
    const [giftOpts, setGiftOpts] = useState<GiftOpts>(emptyGiftOpts());

    const loadFamily = async () => {
        const response = await fetch(server + "family/all", {
            method: "GET",
            credentials: "include",
        });

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data as { name: string; id: number }[];
    };

    const loadData = async () => {
        setFamily(await loadFamily());
    };

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, []);

    function checkData<T>(info: any): boolean {
        for (const key of Object.keys(info)) {
            if (!info[key as keyof T]) {
                setError(`${key} cannot be empty`);
                return false;
            } else {
                if (info[key as keyof T] === -1) {
                    setError("Invalid property for " + key);
                }
            }
            if (typeof key === "object") {
                checkData<typeof key>(key);
            }
        }

        return true;
    }

    return (
        <div className="GiftCoupons">
            <nav>
                <Back />
                <Link to="/home">home</Link>
                <Logout setLoggedIn={props.setLoggedIn} />
            </nav>
            <h1>Gift Coupons</h1>
            {error ? <Error message={error} /> : null}
            {showSuccess ? <Success message="Coupons sent" /> : null}
            <form>
                <Input
                    type="text"
                    name="to"
                    value={giftOpts.to.name}
                    datalist={{
                        list: "family",
                        options: family.map((fam) => fam.name),
                    }}
                    onChange={(e) => {
                        setGiftOpts({
                            ...giftOpts,
                            to: family.find(
                                (fam) => fam.name === e.target.value
                            ) ?? { name: "", id: -1 },
                        });
                        setError("");
                    }}
                    placeholder="to"
                />
                <Input
                    type="text"
                    name="coupon"
                    value={giftOpts.coupon}
                    onChange={(e) => {
                        setGiftOpts({ ...giftOpts, coupon: e.target.value });
                        setError("");
                    }}
                />
                <Input
                    type="number"
                    name="quantity"
                    value={giftOpts.quantity ?? ""}
                    onChange={(e) =>
                        Number(e.target.value) > 0
                            ? setGiftOpts({
                                  ...giftOpts,
                                  quantity: Number(e.target.value),
                              })
                            : ""
                    }
                />
                <PrimaryButton
                    text="send"
                    onClick={async () => {
                        if (checkData<GiftOpts>(giftOpts)) {
                            const response = await sendJSON(
                                server + "coupons/gift",
                                giftOpts
                            );
                            if (response.status === 200) {
                                setGiftOpts(emptyGiftOpts());
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 1000);
                            }
                        }
                    }}
                />
            </form>
        </div>
    );
};

export default GiftCoupons;
