import {PrismaClient, TopListenedArtist, TopListenedMusic, User} from "@prisma/client";
import {StatisticsService} from "../services/StatisticsService";

const express = require("express");

type Request = InstanceType<typeof express>;
type Response = InstanceType<typeof express>;

const service: StatisticsService = new StatisticsService();

export default class StatisticsController {

    router = express.Router();

    constructor() {

        this.router.get('/statistics/user/:user/artist/:rank', async function getArtist(req: Request, res: Response) {
            const user: User = JSON.parse(req.params.user);
            const rank: number = parseInt(req.params.rank);
            let artist: TopListenedArtist | null = null;
            try {
                artist = await service.getArtist(user, rank);
            } catch (error) {
                res.status(403).send({error: error});
                return;
            }
            res.status(200).send(artist);
        })

        this.router.get('/statistics/user/:user/music/:rank', async function getMusic(req: Request, res: Response) {
            const user: User = JSON.parse(req.params.user);
            const rank: number = parseInt(req.params.rank);
            let music: TopListenedMusic | null;
            try {
                music = await service.getMusic(user, rank);
            } catch (error) {
                res.status(403).send({error: error});
                return;
            }
            res.status(200).send(music);
        })

        this.router.get('/statistics/user/:user', async function getUserMusicStatistic(req: Request , res: Response) {
            const user: User = JSON.parse(req.params.user);
            res.status(200).send(new PrismaClient().userMusicStatistic.findUnique({
                where: {
                    user_id: user.user_id
                }
            }))
        })

        this.router.post('/statistics/user/update/information', async function updateUserInformation(req: Request, res: Response) {
            const user: User = JSON.parse(req.body.user);
            const token: string = req.body.token;
            const message: string = await service.updateUserInformation(user, token);
            res.status(200).send(message);
        })

        this.router.post('/statistics/user/update/statistics', async function updateUserStatistics(req: Request, res: Response) {
            const user: User = JSON.parse(req.body.user);
            const token: string = req.body.token;
            let message: string = await service.updateTopListenedArtists(user, token);
            if (message === "user created") {
                res.status(200).send(message);
                return;
            }
            message = await service.updateTopListenedMusics(user, token);
            res.status(200).send(message);
        })
    }
}



