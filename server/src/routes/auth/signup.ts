import { Request, Response, Router } from "express";
import validator from "validator";
import User from "../../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    if (req.session && req.session.user_id && req.session.business_id) {
        const {SqlConnection: connection} = req;

        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;

        if (validator.isEmail(email) === false) {
            res.status(400).json({ message: "Invalid email." });
            return;
        }

        const user : User = new User({name, email});
        if ( password === confirmPassword ) {
            if ((password as string).length > 8) {
                user.hashPassword(password);
                connection.manager.save(user);
                res.sendStatus(200);
            }
            else {
                res.status(400).json({message: "Password must be greater than 8 characters."})
            }
        }
        else {
            res.status(400).json({message: "Password and confirm password do not match"});
        }
    }
});

export default router;
