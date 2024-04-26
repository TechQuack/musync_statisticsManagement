import {PrismaClient, User, TopListenedArtist, UserMusicStatistic, TopListenedMusic} from '@prisma/client';

export default class StatisticsService {

    async getArtist(user, rank) {
        if (rank < 1 || rank > 3) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        const prisma = new PrismaClient();
        return prisma.topListenedArtist.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.id
                    }
                }
            }
        });
    }

    async getMusic(user, rank) {
        if (!this.checkRankValidity(rank)) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        const prisma = new PrismaClient();
        return prisma.topListenedMusic.findFirst({
           where: {
               AND: {
                   top_ranking: rank,
                   userMusicStatistic: {
                       user_id: user.id
                   }
               }
           }
        });
    }

    async getTopListenedArtists(user) {
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        const prisma = new PrismaClient();
        return prisma.topListenedArtist.findMany({
           where: {
               userMusicStatistic: {
                   user_id: user.id
               }
           }
        });
    }

    async getTopListenedMusics(user) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const prisma = new PrismaClient();
        return prisma.topListenedMusic.findMany({
           where: {
               userMusicStatistic: {
                   user_id: user.id
               }
           }
        });
    }

    checkRankValidity(rank) {
        return rank >= 1 && rank <= 3;
    }

    checkUserExistence(user) {
        const prisma = new PrismaClient();
        return prisma.user.findUnique({
           where: {
               user_id: user.id
           }
        }) != null;
    }

}