import {Router, Request, Response, NextFunction} from "express";
import {User} from '../../models/user';
import { authenticationService } from "../../../common";
import jwt from 'jsonwebtoken';

const router = Router()

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) return new Error('wrong credentials')

    const isEqual = await authenticationService.pwdCompare(user.password, password);
    if(!isEqual){
        return next(new Error('Wrong credentials'))
    }

    const token = jwt.sign({
        email, userId: user.id
    }, process.env.JWT_KEY!)

    req.session = {jwt: token}
    res.status(200).send(user)
})

export {router as signinrouter}