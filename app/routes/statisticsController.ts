import {PrismaClient, TopListenedArtist, TopListenedMusic, User} from "@prisma/client";
import {StatisticsService} from "../services/StatisticsService";

const express = require("express");

type Request = InstanceType<typeof express>;
type Response = InstanceType<typeof express>;

const service: StatisticsService = new StatisticsService();

export default class StatisticsController {

    router = express.Router();

    constructor() {

        this.router.get('/statistics/user/artist/:rank', async function getArtist(req: Request, res: Response) {
            const user: User = req.body.user;
            const rank: number = parseInt(req.params.rank);
            let artist: TopListenedArtist | null = null;
            try {
                artist = await service.getArtist(user, rank);
            } catch (error: any) {
                res.status(403).send({error: error.message});
                return;
            }
            res.status(200).send(artist);
        })

        this.router.get('/statistics/user/music/:rank', async function getMusic(req: Request, res: Response) {
            const user: User = req.body.user;
            const rank: number = parseInt(req.params.rank);
            let music: TopListenedMusic | null;
            try {
                music = await service.getMusic(user, rank);
            } catch (error: any) {
                res.status(403).send({error: error.message});
                return;
            }
            res.status(200).send(music);
        })

        this.router.get('/statistics/user', async function getUserMusicStatistic(req: Request , res: Response) {
            const user: User = req.body.user;
            let userInformation = null;
            try {
                userInformation = await new PrismaClient().userMusicStatistic.findUnique({
                    where: {
                        user_id: user.user_id
                    }
                });
            } catch (error: any) {

            }
            res.status(userInformation != null ? 200: 403).send(userInformation != null ? userInformation: "non existent user")
        })

        this.router.post('/statistics/user/update/information', async function updateUserInformation(req: Request, res: Response) {
            const user: User = req.body.user;
            const token: string = req.body.token;
            const message: string = await service.updateUserInformation(user, token);
            res.status(200).send(message);
        })

        this.router.post('/statistics/user/update/statistics', async function updateUserStatistics(req: Request, res: Response) {
            const user: User = req.body.user;
            const token: string = req.body.token;
            let message: string = await service.updateTopListenedArtists(user, token);
            if (message !== "user updated") {
                res.status(200).send(message);
                return;
            }
            message = await service.updateTopListenedMusics(user, token);
            res.status(200).send(message);
        })
    }
}



