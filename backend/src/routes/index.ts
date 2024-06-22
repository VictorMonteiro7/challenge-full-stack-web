import { Router } from 'express';
import * as Middlewares from '@src/middlewares';
import * as UserController from '@src/controllers/User';

const route = Router();

route.post('/register', UserController.Register);
route.post('/login', UserController.Login);

// user info
route.get('/user', Middlewares.CheckToken, UserController.GetUserInfo);
route.delete('/user', Middlewares.CheckToken, UserController.Delete);


export default route;
