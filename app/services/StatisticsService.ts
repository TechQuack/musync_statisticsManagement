import {PrismaClient, User} from "@prisma/client";

export class StatisticsService {

    public async getArtist(user: User, rank: number) {
        if (!this.verifyRank(rank)) {
            throw new Error(`invalid rank: ${rank} less than 1 ot greater than 3`);
        }
        if (!this.checkUserExistence(user)) {
            throw new Error('not existent user');
        }
        return new PrismaClient().topListenedArtist.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.user_id
                    }
                }
            }
        });
    }

    public async getMusic(user: User, rank: number) {
        if (!this.verifyRank(rank)) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        return new PrismaClient().topListenedMusic.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.user_id
                    }
                }
            }
        });
    }

    public async getTopListenedArtists(user: User) {
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        return new PrismaClient().topListenedArtist.findMany({
            where: {
                userMusicStatistic: {
                    user_id: user.user_id
                }
            }
        });
    }

    public async getTopListenedMusics(user: User) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        return new PrismaClient().topListenedMusic.findMany({
            where: {
                userMusicStatistic: {
                    user_id: user.user_id
                }
            }
        });
    }

    //tools

    private verifyRank(rank: number) {
        return rank >= 1 && rank <= 3;
    }

    private checkUserExistence(user: User) {
        const prisma: PrismaClient = new PrismaClient();
        return prisma.user.findUnique({
            where: {
                user_id: user.user_id
            }
        }) != null;
    }
}