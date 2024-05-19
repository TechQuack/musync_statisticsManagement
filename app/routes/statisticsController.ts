import {PrismaClient, User} from "@prisma/client";
import {StatisticsService} from "../services/StatisticsService";
import {Request, Response, Router} from "express";

const router = Router();
const service = new StatisticsService();

router.get('/statistics/user/:user/artist/:rank', async function getArtist(req: Request, res: Response) {
    const user: User = JSON.parse(req.params.user);
    const rank: number = parseInt(req.params.rank);
    res.status(200).send(await service.getArtist(user, rank));
})

router.get('statistics/user/:user/music/:rank', async function getMusic(req: Request, res: Response) {
    const user: User = JSON.parse(req.params.user);
    const rank: number = parseInt(req.params.rank);
    res.status(200).send(await service.getMusic(user, rank));
})

router.get('/statistics/user/:user', async function getUserMusicStatistic(req: Request , res: Response) {
    const user: User = JSON.parse(req.params.user);
    res.status(200).send(new PrismaClient().userMusicStatistic.findUnique({
        where: {
            user_id: user.user_id
        }
    }))
})

router.post('/statistics/user/update/information', async function updateUserInformation(req: Request, res: Response) {
    const user: User = req.body.user;
    const token: string = req.body.token;
    const message: string = await service.updateUserInformation(user, token);
    res.status(200).send(message);
})

router.post('/statistics/user/update/statistics', async function updateUserStatistics(req: Request, res: Response) {
    const user: User = req.body.user;
    const token: string = req.body.token;
    let message: string = await service.updateTopListenedArtists(user, token);
    if (message === "user created") {
        res.status(200).send(message);
        return;
    }
    message = await service.updateTopListenedMusics(user, token);
    res.status(200).send(message);
})

module.exports = router;